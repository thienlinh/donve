import * as React from "react";

export type CanvasTransform = {
  scale: number;
  tx: number;
  ty: number;
};

const MIN_SCALE = 0.1;
const MAX_SCALE = 4;

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export type UseCanvasTransformOptions = {
  defaultTransform?: CanvasTransform;
};

export type UseCanvasTransformResult = {
  transform: CanvasTransform;
  /** CSS for the transformed wrapper — apply directly to the iframe/canvas host. */
  style: React.CSSProperties;
  /** Zoom around a viewport point (e.g. cursor position), per FR-B-05. */
  zoomAt: (point: { x: number; y: number }, deltaScale: number) => void;
  pan: (delta: { dx: number; dy: number }) => void;
  /** Fit `contentSize` inside `viewportSize` with `padding`, per FR-B-07. */
  fitToScreen: (
    contentSize: { width: number; height: number },
    viewportSize: { width: number; height: number },
    padding?: number
  ) => void;
  reset: () => void;
};

const DEFAULT_TRANSFORM: CanvasTransform = { scale: 1, tx: 0, ty: 0 };

/** Owns the `{scale, tx, ty}` canvas transform — input handling (wheel/gesture) lives in the consumer. */
export function useCanvasTransform(
  options: UseCanvasTransformOptions = {}
): UseCanvasTransformResult {
  const defaultTransform = options.defaultTransform ?? DEFAULT_TRANSFORM;
  const [transform, setTransform] =
    React.useState<CanvasTransform>(defaultTransform);
  const rafRef = React.useRef<number | null>(null);
  const pendingRef = React.useRef<CanvasTransform | null>(null);

  const scheduleUpdate = React.useCallback((next: CanvasTransform) => {
    pendingRef.current = next;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (pendingRef.current) setTransform(pendingRef.current);
    });
  }, []);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const zoomAt = React.useCallback(
    (point: { x: number; y: number }, deltaScale: number) => {
      const current = pendingRef.current ?? transform;
      const nextScale = clampScale(current.scale * deltaScale);
      const ratio = nextScale / current.scale;
      // Keep the point under the cursor fixed on screen while scale changes.
      const tx = point.x - (point.x - current.tx) * ratio;
      const ty = point.y - (point.y - current.ty) * ratio;
      scheduleUpdate({ scale: nextScale, tx, ty });
    },
    [transform, scheduleUpdate]
  );

  const pan = React.useCallback(
    (delta: { dx: number; dy: number }) => {
      const current = pendingRef.current ?? transform;
      scheduleUpdate({
        ...current,
        tx: current.tx - delta.dx,
        ty: current.ty - delta.dy
      });
    },
    [transform, scheduleUpdate]
  );

  const fitToScreen = React.useCallback(
    (
      contentSize: { width: number; height: number },
      viewportSize: { width: number; height: number },
      padding = 0
    ) => {
      const scale = clampScale(
        Math.min(
          (viewportSize.width - padding) / contentSize.width,
          (viewportSize.height - padding) / contentSize.height
        )
      );
      const tx = (viewportSize.width - contentSize.width * scale) / 2;
      const ty = (viewportSize.height - contentSize.height * scale) / 2;
      scheduleUpdate({ scale, tx, ty });
    },
    [scheduleUpdate]
  );

  const reset = React.useCallback(() => {
    scheduleUpdate(defaultTransform);
  }, [defaultTransform, scheduleUpdate]);

  const style = React.useMemo<React.CSSProperties>(
    () => ({
      transform: `translate(${transform.tx}px, ${transform.ty}px) scale(${transform.scale})`,
      transformOrigin: "0 0",
      willChange: "transform"
    }),
    [transform]
  );

  return { transform, style, zoomAt, pan, fitToScreen, reset };
}

/** `e.deltaY` -> scale multiplier for pinch/ctrl-wheel zoom (FR-B-05). */
export function wheelZoomFactor(deltaY: number): number {
  return Math.exp(-deltaY * 0.01);
}
