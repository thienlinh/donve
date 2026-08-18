import * as React from "react";

export const DRAW_TOOLS = ["pen", "arrow", "rect"] as const;
export type DrawTool = (typeof DRAW_TOOLS)[number];

type Point = { x: number; y: number };
type DrawStroke = {
  tool: DrawTool;
  color: string;
  /** Freehand path for "pen"; exactly [start, end] for "arrow"/"rect". */
  points: Point[];
};

export type DrawOverlayHandle = {
  undo: () => void;
  clear: () => void;
  /** The raw canvas, for the consumer to composite over a screenshot. */
  getCanvas: () => HTMLCanvasElement | null;
};

export type DrawOverlayProps = {
  active: boolean;
  tool: DrawTool;
  color: string;
  width: number;
  height: number;
  onCanUndoChange?: (canUndo: boolean) => void;
};

function drawArrowhead(ctx: CanvasRenderingContext2D, from: Point, to: Point) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const size = 10;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - size * Math.cos(angle - Math.PI / 6),
    to.y - size * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - size * Math.cos(angle + Math.PI / 6),
    to.y - size * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: DrawStroke) {
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (stroke.tool === "pen") {
    ctx.beginPath();
    stroke.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    return;
  }

  const [from, to] = stroke.points;
  if (!from || !to) return;
  if (stroke.tool === "rect") {
    ctx.strokeRect(from.x, from.y, to.x - from.x, to.y - from.y);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  drawArrowhead(ctx, from, to);
}

/**
 * Draw-mode annotation layer (FR-B-14). Sits absolutely positioned over the iframe, inside
 * the same transformed wrapper — its intrinsic canvas size matches the content size, so
 * points are converted client->canvas-pixel via `getBoundingClientRect` ratio, which already
 * accounts for the ancestor CSS `scale()` without needing the transform passed in explicitly.
 */
export const DrawOverlay = React.forwardRef<
  DrawOverlayHandle,
  DrawOverlayProps
>(function DrawOverlay(
  { active, tool, color, width, height, onCanUndoChange },
  ref
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const strokesRef = React.useRef<DrawStroke[]>([]);
  const drawingRef = React.useRef<DrawStroke | null>(null);

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokesRef.current) drawStroke(ctx, stroke);
    if (drawingRef.current) drawStroke(ctx, drawingRef.current);
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      undo: () => {
        strokesRef.current = strokesRef.current.slice(0, -1);
        onCanUndoChange?.(strokesRef.current.length > 0);
        redraw();
      },
      clear: () => {
        strokesRef.current = [];
        onCanUndoChange?.(false);
        redraw();
      },
      getCanvas: () => canvasRef.current
    }),
    [redraw, onCanUndoChange]
  );

  function toCanvasPoint(e: React.PointerEvent): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!active) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = toCanvasPoint(e);
    drawingRef.current = { tool, color, points: [point] };
    redraw();
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const stroke = drawingRef.current;
    if (!stroke) return;
    const point = toCanvasPoint(e);
    if (stroke.tool === "pen") stroke.points.push(point);
    else stroke.points[1] = point;
    redraw();
  }

  function handlePointerUp() {
    const stroke = drawingRef.current;
    drawingRef.current = null;
    if (stroke && stroke.points.length > 1) {
      strokesRef.current = [...strokesRef.current, stroke];
      onCanUndoChange?.(true);
    }
    redraw();
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 top-0 left-0"
      style={{
        touchAction: "none",
        cursor: active ? "crosshair" : undefined,
        pointerEvents: active ? "auto" : "none"
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
});
