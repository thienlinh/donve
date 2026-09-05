import { buildSrcmap, PatchHistory, Srcmap } from "@dv/studio-core";
import type { PatchOp } from "@dv/studio-core";
import {
  DrawOverlay,
  HoverSelectOverlay,
  useCanvasTransform,
  wheelZoomFactor,
  type CanvasTransform,
  type DrawOverlayHandle,
  type DrawTool,
  type InspectorProp,
  type InspectorValues,
  type LayerKind,
  type LayerNode,
  type OverlayTarget,
  type StudioMode
} from "@dv/studio-ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@dv/ui/components/shadcn/alert-dialog";
import { domToBlob, domToCanvas } from "modern-screenshot";
import * as React from "react";

import { deabsolutizeAssetPaths } from "@/lib/absolutize-asset-paths";
import * as m from "@/paraglide/messages.js";

export type ZoomControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  /** Cmd+0 (studio-builder-spec.md §10). */
  reset: () => void;
  /** Cmd+1 (studio-builder-spec.md §10). */
  fit: () => void;
};

/** Element clicked while in "comment" mode — just enough to open the comment dialog. */
export type CommentTarget = { srcmapId: string; tag: string; text: string };

/** FR-B-14 — composite() screenshots the iframe and layers the draw canvas on top. */
export type DrawControls = {
  undo: () => void;
  clear: () => void;
  composite: () => Promise<string | null>;
};

/** FR-B-26: `.thumbnail.jpg`, re-captured client-side after every version-creating action. */
export type ThumbnailControls = {
  capture: () => Promise<Blob | null>;
};

/** FR-B-12 — crops the shot to just the commented element, not the whole artboard (unlike
 * `ThumbnailControls`/`composite` above, which always shoot the fixed 1200x800 artboard). */
export type CommentScreenshotControls = {
  capture: (srcmapId: string) => Promise<Blob | null>;
};

/** FR-B-28 PNG export — full page height, unlike the fixed-artboard thumbnail/draw shots. */
export type ExportControls = {
  capturePng: () => Promise<Blob | null>;
};

/** Cmd+Z/Shift+Cmd+Z/Cmd+S — reads straight off `PatchHistory`, no second stack (FR-B-15). */
type HistoryControls = {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  flushSave: () => void;
};

/** Explicit save trigger for the toolbar's Save button — mirrors Cmd+S. */
export type SaveControls = { save: () => void };

/** Visible Undo/Redo toolbar buttons — mirrors Cmd+Z/Shift+Cmd+Z (`HistoryControls` above),
 * which until now was the *only* way to undo/redo (no button surfaced it). */
export type UndoRedoControls = { undo: () => void; redo: () => void };
/** Reactive counterpart to `UndoRedoControls` — drives the buttons' disabled state, since
 * `HistoryControls.canUndo`/`canRedo` above are plain imperative reads, not observable. */
export type HistoryState = { canUndo: boolean; canRedo: boolean };

/** Fired on an explicit save (Cmd+S or the toolbar button) — creates a `manual` pageVersion. */
export type ManualSaveInput = { html: string; patch: PatchOp[] };

/** Everything the Inspector needs about the current selection — `tag`/`imageSrc` aren't styles
 * so they don't belong in `InspectorValues`, but the sidebar needs all three from one place to
 * decide "replace `<img src>`" vs "background-image style" (studio-page.tsx's `onUploadImage`). */
export type SelectedElementInfo = {
  tag: string;
  imageSrc?: string;
  values: InspectorValues;
};

export type CanvasProps = {
  html: string;
  mode: StudioMode;
  selectedId: string | null;
  hoveredId: string | null;
  drawTool: DrawTool;
  drawColor: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onLayersChange: (layers: LayerNode[]) => void;
  onSelectedElementChange: (info: SelectedElementInfo | null) => void;
  onCommitReady: (commit: (op: PatchOp) => void) => void;
  onTransformChange?: (transform: CanvasTransform) => void;
  onZoomControlsReady?: (controls: ZoomControls) => void;
  /** Esc (deselect) or a confirmed Delete — parent owns `selectedId`, clears it here. */
  onDeselect?: () => void;
  onCommentTarget?: (target: CommentTarget) => void;
  onDrawControlsReady?: (controls: DrawControls) => void;
  onDrawCanUndoChange?: (canUndo: boolean) => void;
  onCommentScreenshotControlsReady?: (
    controls: CommentScreenshotControls
  ) => void;
  onManualSave?: (input: ManualSaveInput) => Promise<unknown> | void;
  onThumbnailControlsReady?: (controls: ThumbnailControls) => void;
  onExportControlsReady?: (controls: ExportControls) => void;
  onSaveControlsReady?: (controls: SaveControls) => void;
  /** Unsaved edits pending an explicit save (Cmd+S / the toolbar Save button). */
  onDirtyChange?: (dirty: boolean) => void;
  onUndoRedoControlsReady?: (controls: UndoRedoControls) => void;
  /** Fires after every commit/undo/redo so a toolbar button can reflect canUndo/canRedo. */
  onHistoryStateChange?: (state: HistoryState) => void;
};

/** Fixed artboard width (`w-[1200px]` below — deliberate desktop-viewport rendering).
 * `CONTENT_HEIGHT` is no longer the iframe's actual height (that's now dynamic, tracking
 * the loaded page's real `scrollHeight`) — it's only (a) the fallback/initial value before
 * first load and (b) the fixed capture box size for `composite()`/`captureThumbnail()`,
 * which intentionally stay a fixed "one screen" shot regardless of page length. */
const CONTENT_WIDTH = 1200;
const CONTENT_HEIGHT = 800;
const FIT_PADDING = 48;
const ZOOM_STEP = 1.2;

// studio-builder-spec.md §10 — Delete on a section this big confirms first.
const LARGE_SECTION_CHILD_THRESHOLD = 5;
const LARGE_SECTION_HEIGHT_RATIO = 0.3;

function isLargeSection(el: Element): boolean {
  if (el.children.length >= LARGE_SECTION_CHILD_THRESHOLD) return true;
  const pageHeight = el.ownerDocument.body.scrollHeight;
  if (pageHeight <= 0) return false;
  return (
    (el as HTMLElement).offsetHeight / pageHeight > LARGE_SECTION_HEIGHT_RATIO
  );
}

function isTextInput(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    el.getAttribute("contenteditable") === "true"
  );
}

const INSPECTOR_PROPS: InspectorProp[] = [
  "font-family",
  "font-size",
  "font-weight",
  "color",
  "text-align",
  "text-transform",
  "font-style",
  "text-decoration",
  "line-height",
  "letter-spacing",
  "width",
  "height",
  "opacity",
  "overflow",
  "padding",
  "margin",
  "border-width",
  "border-color",
  "border-radius",
  "background-image"
];
const NUMERIC_INSPECTOR_PROPS = new Set<InspectorProp>([
  "font-size",
  "line-height",
  "letter-spacing",
  "width",
  "height",
  "opacity",
  "padding",
  "margin",
  "border-width",
  "border-radius"
]);

function inferKind(el: Element): LayerKind {
  const tag = el.tagName.toLowerCase();
  if (tag === "img" || tag === "svg") return "image";
  if (el.children.length === 0 && (el.textContent ?? "").trim()) return "text";
  return "section";
}

/** Fallback when generation hasn't named a layer yet (Phase 2 wires AI-given names). */
function deriveLayers(root: Element): LayerNode[] {
  const tagCounts = new Map<string, number>();
  function fallbackName(tag: string): string {
    const n = (tagCounts.get(tag) ?? 0) + 1;
    tagCounts.set(tag, n);
    return `${tag} ${n}`;
  }

  const layers: LayerNode[] = [];
  // Reversed sibling order: a later DOM sibling paints on top, so it surfaces first in
  // the panel — "top of list = topmost layer" (studio-builder-spec.md §8).
  // `parentSrcmapId`/`depth` track the nearest srcmap'd ancestor (not the raw DOM parent) —
  // an element without a srcmap id is skipped from the list but its children still nest
  // under whichever ancestor above it does have one.
  function walk(el: Element, parentSrcmapId: string | null, depth: number) {
    const srcmapId = el.getAttribute(Srcmap.idAttr);
    let childParentSrcmapId = parentSrcmapId;
    let childDepth = depth;
    if (srcmapId) {
      const tag = el.tagName.toLowerCase();
      const kind = inferKind(el);
      layers.push({
        srcmapId,
        name: el.getAttribute("data-cc-name") ?? fallbackName(tag),
        kind,
        hidden: el.getAttribute("data-cc-hidden") === "true",
        thumbnailUrl:
          kind === "image" && tag === "img"
            ? (el.getAttribute("src") ?? undefined)
            : undefined,
        parentSrcmapId,
        depth
      });
      childParentSrcmapId = srcmapId;
      childDepth = depth + 1;
    }
    for (const child of Array.from(el.children).toReversed())
      walk(child, childParentSrcmapId, childDepth);
  }
  for (const child of Array.from(root.children).toReversed())
    walk(child, null, 0);
  return layers;
}

/**
 * Inline style wins when present (it's the same surface `setStyle` ops write, so an edited
 * value round-trips exactly) — falling back to `getComputedStyle` for everything else, since
 * most AI-generated HTML is styled via CSS classes/`<style>` blocks, not inline `style=`, and
 * would otherwise show blank Inspector fields for values that are visibly set on the element.
 */
function readInspectorValues(el: HTMLElement): InspectorValues {
  const values: InspectorValues = {};
  const computed = el.ownerDocument.defaultView?.getComputedStyle(el);
  for (const prop of INSPECTOR_PROPS) {
    const raw =
      el.style.getPropertyValue(prop) || computed?.getPropertyValue(prop) || "";
    if (!raw) continue;
    if (NUMERIC_INSPECTOR_PROPS.has(prop)) {
      const n = Number.parseFloat(raw);
      if (!Number.isNaN(n)) Object.assign(values, { [prop]: n });
    } else {
      Object.assign(values, { [prop]: raw });
    }
  }
  return values;
}

function measureOverlayTarget(
  iframe: HTMLIFrameElement,
  el: Element,
  scale: number,
  containerRect: DOMRect
): OverlayTarget {
  const iframeRect = iframe.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    srcmapId: el.getAttribute(Srcmap.idAttr) ?? "",
    tag: el.tagName.toLowerCase(),
    name: el.getAttribute("data-cc-name"),
    text: (el.textContent ?? "").trim().slice(0, 20),
    // `HoverSelectOverlay` positions itself with `inset-0` inside the
    // (relatively-positioned) canvas container, not the viewport — every
    // coordinate here must be container-relative, not `getBoundingClientRect()`'s
    // viewport-relative default.
    rect: {
      top: iframeRect.top - containerRect.top + elRect.top * scale,
      left: iframeRect.left - containerRect.left + elRect.left * scale,
      width: elRect.width * scale,
      height: elRect.height * scale
    }
  };
}

/**
 * Owns the iframe/srcmap/PatchHistory engine — the only studio component with a DOM/fetch
 * dependency (everything else in @dv/studio-ui is presentational, consumer-wired). "view" mode
 * still allows click-to-select (studio-builder-spec.md §10: select has no hotkey, it's entered
 * by picking an element), so the parent promotes mode to "select" once `onSelect` fires there.
 */
export function Canvas({
  html,
  mode,
  selectedId,
  hoveredId,
  drawTool,
  drawColor,
  onSelect,
  onHover,
  onLayersChange,
  onSelectedElementChange,
  onCommitReady,
  onTransformChange,
  onZoomControlsReady,
  onDeselect,
  onCommentTarget,
  onDrawControlsReady,
  onDrawCanUndoChange,
  onCommentScreenshotControlsReady,
  onManualSave,
  onThumbnailControlsReady,
  onExportControlsReady,
  onSaveControlsReady,
  onDirtyChange,
  onUndoRedoControlsReady,
  onHistoryStateChange
}: CanvasProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const drawOverlayRef = React.useRef<DrawOverlayHandle>(null);
  const srcmapRef = React.useRef<Srcmap | null>(null);
  const modeRef = React.useRef(mode);
  modeRef.current = mode;
  const selectedIdRef = React.useRef(selectedId);
  selectedIdRef.current = selectedId;
  const onManualSaveRef = React.useRef(onManualSave);
  onManualSaveRef.current = onManualSave;
  const onSaveControlsReadyRef = React.useRef(onSaveControlsReady);
  onSaveControlsReadyRef.current = onSaveControlsReady;
  const onDirtyChangeRef = React.useRef(onDirtyChange);
  onDirtyChangeRef.current = onDirtyChange;
  const onUndoRedoControlsReadyRef = React.useRef(onUndoRedoControlsReady);
  onUndoRedoControlsReadyRef.current = onUndoRedoControlsReady;
  const onHistoryStateChangeRef = React.useRef(onHistoryStateChange);
  onHistoryStateChangeRef.current = onHistoryStateChange;
  const dirtyRef = React.useRef(false);
  // Dynamic artboard height, tracking the loaded page's real `doc.body.scrollHeight` —
  // `contentHeightRef` is read (not `contentHeight` state) from `doFitToScreen`, which is
  // also called synchronously inside `handleLoad` before the state update above it commits.
  const [contentHeight, setContentHeight] = React.useState(CONTENT_HEIGHT);
  const contentHeightRef = React.useRef(contentHeight);
  contentHeightRef.current = contentHeight;
  const markDirty = React.useCallback(() => {
    if (dirtyRef.current) return;
    dirtyRef.current = true;
    onDirtyChangeRef.current?.(true);
  }, []);
  // `handleLoad` below wires these into DOM listeners on the iframe's own document
  // ONCE, when it loads — the iframe only fires `load` once per `srcDoc` change, so
  // those listeners never get torn down/re-attached on a normal re-render. Reading
  // through a ref (updated every render, looked up at call time) instead of closing
  // over the prop directly is what keeps them from going stale — e.g. without this,
  // clicking an element while in "edit" mode called a click handler still holding
  // the very first render's `onSelect`, which itself closed over that render's
  // `mode` ("view") and silently forced the mode back to "select" on every click.
  const onSelectRef = React.useRef(onSelect);
  onSelectRef.current = onSelect;
  const onHoverRef = React.useRef(onHover);
  onHoverRef.current = onHover;
  const onCommentTargetRef = React.useRef(onCommentTarget);
  onCommentTargetRef.current = onCommentTarget;
  const pendingOpsRef = React.useRef<PatchOp[]>([]);
  // Serializes manual-save requests (an explicit save while another is still in flight)
  // so two saves can never race — otherwise whichever response lands last wins the
  // landing page's `currentVersionId`, regardless of which save the user triggered last.
  const saveQueueRef = React.useRef<Promise<unknown> | undefined>(undefined);
  const commitFnRef = React.useRef<((op: PatchOp) => void) | null>(null);
  const historyControlsRef = React.useRef<HistoryControls | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(
    null
  );

  const [hoverTarget, setHoverTarget] = React.useState<OverlayTarget | null>(
    null
  );
  const [selectedTarget, setSelectedTarget] =
    React.useState<OverlayTarget | null>(null);
  const [revision, setRevision] = React.useState(0);
  const [spaceHeld, setSpaceHeld] = React.useState(false);
  const [isPanning, setIsPanning] = React.useState(false);

  const { transform, style, zoomAt, pan, fitToScreen, reset } =
    useCanvasTransform();

  React.useEffect(() => {
    onTransformChange?.(transform);
  }, [transform, onTransformChange]);

  // Point relative to the outer (unscaled) container — `originRect` is the iframe's own
  // bounding rect when the source event fired inside the iframe document, undefined for
  // events on the container itself (studio-builder-spec.md §4.2, FR-B-05).
  const toContainerPoint = React.useCallback(
    (clientX: number, clientY: number, originRect?: DOMRect) => {
      const containerRect = containerRef.current!.getBoundingClientRect();
      if (!originRect) {
        // Event fired on the container itself — clientX/Y are already real
        // viewport coordinates, no scale involved.
        return {
          x: clientX - containerRect.left,
          y: clientY - containerRect.top
        };
      }
      // Event fired inside the (transformed) iframe document — clientX/Y are
      // local to the iframe's own unscaled viewport. `originRect` is already
      // on-screen/scaled (it's `iframe.getBoundingClientRect()` post-transform),
      // so only the local offset needs the scale factor applied.
      return {
        x: originRect.left - containerRect.left + clientX * transform.scale,
        y: originRect.top - containerRect.top + clientY * transform.scale
      };
    },
    [transform.scale]
  );
  const toContainerPointRef = React.useRef(toContainerPoint);
  toContainerPointRef.current = toContainerPoint;
  const zoomAtRef = React.useRef(zoomAt);
  zoomAtRef.current = zoomAt;

  const handleWheel = React.useCallback(
    (
      e: {
        preventDefault: () => void;
        ctrlKey: boolean;
        metaKey: boolean;
        deltaX: number;
        deltaY: number;
        clientX: number;
        clientY: number;
      },
      originRect?: DOMRect
    ) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        zoomAt(
          toContainerPoint(e.clientX, e.clientY, originRect),
          wheelZoomFactor(e.deltaY)
        );
      } else {
        pan({ dx: e.deltaX, dy: e.deltaY });
      }
    },
    [zoomAt, pan, toContainerPoint]
  );
  const handleWheelRef = React.useRef(handleWheel);
  handleWheelRef.current = handleWheel;

  // React's synthetic `onWheel` is attached passively — `preventDefault()` inside it is a
  // silent no-op (browsers log "Unable to preventDefault inside passive event listener"), so
  // a two-finger trackpad swipe over the canvas gutter never actually gets blocked and instead
  // falls through to Chrome/Safari's built-in swipe-to-go-back/forward gesture. A real
  // `addEventListener` with `{ passive: false }` — same as the iframe-document listener below
  // — is the only way to make `preventDefault()` stick.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      handleWheelRef.current(e);
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const zoomAtCenter = React.useCallback(
    (factor: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      zoomAt({ x: rect.width / 2, y: rect.height / 2 }, factor);
    },
    [zoomAt]
  );

  const doFitToScreen = React.useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    fitToScreen(
      { width: CONTENT_WIDTH, height: contentHeightRef.current },
      { width: rect.width, height: rect.height },
      FIT_PADDING
    );
  }, [fitToScreen]);

  React.useEffect(() => {
    onZoomControlsReady?.({
      zoomIn: () => zoomAtCenter(ZOOM_STEP),
      zoomOut: () => zoomAtCenter(1 / ZOOM_STEP),
      reset,
      fit: doFitToScreen
    });
  }, [onZoomControlsReady, zoomAtCenter, reset, doFitToScreen]);

  // Screenshots the live iframe body, then draws the annotation layer on top — the PNG
  // sent to chat (studio-builder-spec.md §7). `domToCanvas` needs a same-origin document,
  // which `sandbox="allow-same-origin"` on the iframe guarantees.
  const composite = React.useCallback(async (): Promise<string | null> => {
    const doc = iframeRef.current?.contentDocument;
    const drawCanvas = drawOverlayRef.current?.getCanvas();
    if (!doc?.body || !drawCanvas) return null;
    const shot = await domToCanvas(doc.body, {
      width: CONTENT_WIDTH,
      height: CONTENT_HEIGHT
    });
    const output = document.createElement("canvas");
    output.width = CONTENT_WIDTH;
    output.height = CONTENT_HEIGHT;
    const ctx = output.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(shot, 0, 0, CONTENT_WIDTH, CONTENT_HEIGHT);
    ctx.drawImage(drawCanvas, 0, 0, CONTENT_WIDTH, CONTENT_HEIGHT);
    return output.toDataURL("image/png");
  }, []);

  React.useEffect(() => {
    onDrawControlsReady?.({
      undo: () => drawOverlayRef.current?.undo(),
      clear: () => drawOverlayRef.current?.clear(),
      composite
    });
  }, [onDrawControlsReady, composite]);

  // FR-B-26: no draw overlay in the shot — just the page itself, downsized to a JPEG.
  const captureThumbnail = React.useCallback(async (): Promise<Blob | null> => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return null;
    const shot = await domToCanvas(doc.body, {
      width: CONTENT_WIDTH,
      height: CONTENT_HEIGHT
    });
    return new Promise((resolve) => shot.toBlob(resolve, "image/jpeg", 0.85));
  }, []);

  React.useEffect(() => {
    onThumbnailControlsReady?.({ capture: captureThumbnail });
  }, [onThumbnailControlsReady, captureThumbnail]);

  // FR-B-12: shoots just the commented element (its own bounding box), not the fixed artboard —
  // `domToCanvas` sizes the canvas to the target node when no width/height is given.
  const captureElementScreenshot = React.useCallback(
    async (srcmapId: string): Promise<Blob | null> => {
      const el = srcmapRef.current?.get(srcmapId) as HTMLElement | undefined;
      if (!el) return null;
      const shot = await domToCanvas(el);
      return new Promise((resolve) => shot.toBlob(resolve, "image/jpeg", 0.85));
    },
    []
  );

  React.useEffect(() => {
    onCommentScreenshotControlsReady?.({ capture: captureElementScreenshot });
  }, [onCommentScreenshotControlsReady, captureElementScreenshot]);

  // FR-B-28 PNG export — full document height/width, not the fixed 1200x800 artboard used
  // for the thumbnail/draw shots above, so a tall page isn't cropped.
  const capturePng = React.useCallback(async (): Promise<Blob | null> => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return null;
    return domToBlob(doc.body, {
      width: doc.body.scrollWidth,
      height: doc.body.scrollHeight
    });
  }, []);

  React.useEffect(() => {
    onExportControlsReady?.({ capturePng });
  }, [onExportControlsReady, capturePng]);

  // Delete confirms first when the selected element is a "large section"
  // (studio-builder-spec.md §10) — otherwise it's removed immediately.
  const requestDelete = React.useCallback(() => {
    const id = selectedIdRef.current;
    if (!id) return;
    const el = srcmapRef.current?.get(id);
    if (!el) return;
    if (isLargeSection(el)) {
      setDeleteConfirmId(id);
      return;
    }
    commitFnRef.current?.({ type: "remove", srcmapId: id });
    onDeselect?.();
  }, [onDeselect]);

  const confirmDelete = React.useCallback(() => {
    if (deleteConfirmId) {
      commitFnRef.current?.({ type: "remove", srcmapId: deleteConfirmId });
      onDeselect?.();
    }
    setDeleteConfirmId(null);
  }, [deleteConfirmId, onDeselect]);

  // Latest-value refs so the keydown listener below can mount once instead of
  // re-subscribing on every render (these are only ever read from inside the handler).
  const zoomAtCenterRef = React.useRef(zoomAtCenter);
  zoomAtCenterRef.current = zoomAtCenter;
  const resetRef = React.useRef(reset);
  resetRef.current = reset;
  const doFitToScreenRef = React.useRef(doFitToScreen);
  doFitToScreenRef.current = doFitToScreen;
  const requestDeleteRef = React.useRef(requestDelete);
  requestDeleteRef.current = requestDelete;
  const onDeselectRef = React.useRef(onDeselect);
  onDeselectRef.current = onDeselect;

  // Space-hold enables drag-to-pan (cursor grab/grabbing). Esc always works (even while
  // typing); every other shortcut is disabled there (studio-builder-spec.md §10) so it
  // doesn't hijack normal text entry. Cmd/Ctrl +/- /0/1 zoom, Z undoes/redoes, S force-saves,
  // Delete removes the selection (FR-B-05, FR-B-15).
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onDeselectRef.current?.();
        return;
      }
      const typing = isTextInput(document.activeElement);
      if (e.code === "Space" && !e.repeat && !typing) {
        setSpaceHeld(true);
        return;
      }
      if (typing) return;

      if (e.key === "Delete") {
        e.preventDefault();
        requestDeleteRef.current();
        return;
      }

      if (!(e.metaKey || e.ctrlKey)) return;
      switch (e.key) {
        case "+":
        case "=":
          e.preventDefault();
          zoomAtCenterRef.current(ZOOM_STEP);
          break;
        case "-":
          e.preventDefault();
          zoomAtCenterRef.current(1 / ZOOM_STEP);
          break;
        case "0":
          e.preventDefault();
          resetRef.current();
          break;
        case "1":
          e.preventDefault();
          doFitToScreenRef.current();
          break;
        case "z":
        case "Z":
          e.preventDefault();
          if (e.shiftKey) historyControlsRef.current?.redo();
          else historyControlsRef.current?.undo();
          break;
        case "s":
        case "S":
          e.preventDefault();
          historyControlsRef.current?.flushSave();
          break;
        default:
          break;
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") setSpaceHeld(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Safari doesn't set `ctrlKey` on trackpad-pinch wheel events like Chrome/Firefox do —
  // it fires non-standard `gesturestart`/`gesturechange` instead (studio-builder-spec.md §4.2).
  // `zoomAt`/`toContainerPoint` change identity on every transform update — read them via
  // refs so this listener doesn't get torn down and re-added on every zoom/pan tick.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastScale = 1;
    function onGestureStart(e: Event) {
      e.preventDefault();
      lastScale = 1;
    }
    function onGestureChange(e: Event) {
      e.preventDefault();
      const ge = e as unknown as {
        scale: number;
        clientX: number;
        clientY: number;
      };
      zoomAtRef.current(
        toContainerPointRef.current(ge.clientX, ge.clientY),
        ge.scale / lastScale
      );
      lastScale = ge.scale;
    }
    el.addEventListener("gesturestart", onGestureStart);
    el.addEventListener("gesturechange", onGestureChange);
    return () => {
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
    };
  }, []);

  // Drag state lives in refs + a window-level listener (not per-element pointer capture)
  // because a pan gesture can start on the iframe's own document — a separate document
  // can't capture a pointer into the parent, so tracking has to happen above both.
  const spaceHeldRef = React.useRef(spaceHeld);
  spaceHeldRef.current = spaceHeld;
  const dragPointerId = React.useRef<number | null>(null);

  const beginPan = React.useCallback((button: number, pointerId: number) => {
    if (button !== 1 && !(button === 0 && spaceHeldRef.current)) return false;
    dragPointerId.current = pointerId;
    setIsPanning(true);
    return true;
  }, []);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (beginPan(e.button, e.pointerId)) e.preventDefault();
    },
    [beginPan]
  );

  const handleDragMove = React.useCallback(
    (e: PointerEvent) => {
      if (dragPointerId.current !== e.pointerId) return;
      pan({ dx: -e.movementX, dy: -e.movementY });
    },
    [pan]
  );
  const handleDragMoveRef = React.useRef(handleDragMove);
  handleDragMoveRef.current = handleDragMove;

  const handleDragEnd = React.useCallback((e: PointerEvent) => {
    if (dragPointerId.current !== e.pointerId) return;
    dragPointerId.current = null;
    setIsPanning(false);
  }, []);

  // Handles drags that start on the outer container; handleLoad below wires the same
  // pair onto the iframe's own document so a drag starting over the page content works too.
  React.useEffect(() => {
    window.addEventListener("pointermove", handleDragMove);
    window.addEventListener("pointerup", handleDragEnd);
    return () => {
      window.removeEventListener("pointermove", handleDragMove);
      window.removeEventListener("pointerup", handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  const refreshLayers = React.useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return;
    onLayersChange(deriveLayers(doc.body));
    setRevision((r) => r + 1);
  }, [onLayersChange]);

  const handleLoad = React.useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return;

    // Belt-and-suspenders against the trackpad-swipe-triggers-browser-back/forward bug: the
    // generated page is a separate browsing context, so `preventDefault()` on its own wheel
    // events isn't guaranteed to suppress a *top-level* swipe-navigation gesture the OS/browser
    // recognizes independently of DOM event cancellation. `overscroll-behavior-x` is the
    // purpose-built CSS defense for exactly this (MDN) and doesn't depend on event timing.
    doc.documentElement.style.setProperty("overscroll-behavior-x", "none");
    doc.body.style.setProperty("overscroll-behavior-x", "none");

    // Artboard height tracks the real page, not a fixed 800px — measured synchronously here
    // (accurate at `load` regardless of the iframe's current CSS height) so it's already
    // correct before `doFitToScreen()` below reads it. The observer keeps it in sync with
    // later edits (e.g. a canvas op adding/removing a section) without re-fitting on every
    // change — fit-to-screen stays a load-time-only behavior (FR-B-07 below).
    function updateContentHeight() {
      const height = doc!.body.scrollHeight;
      contentHeightRef.current = height;
      setContentHeight(height);
    }
    updateContentHeight();
    new ResizeObserver(updateContentHeight).observe(doc.body);

    const srcmap = buildSrcmap(doc.body);
    srcmapRef.current = srcmap;
    const history = new PatchHistory(srcmap);

    // `force` saves even with an empty patch — undo/redo change the DOM without a
    // fresh op to record, but the source still needs to reach the server (FR-B-15).
    function persistNow(patch: PatchOp[], force = false) {
      if (patch.length === 0 && !force) return;
      dirtyRef.current = false;
      onDirtyChangeRef.current?.(false);
      // `html` (the caller's prop) was absolutized before becoming this iframe's `srcDoc`
      // (see canvas.tsx's `html={absolutizeAssetPaths(html)}` caller) so asset requests hit the
      // API's origin instead of the app's — reverse that here so the persisted/published HTML
      // keeps the root-relative paths the rest of the pipeline (buildPublishArtifacts) expects.
      const html = deabsolutizeAssetPaths(
        `<!doctype html>\n${doc!.documentElement.outerHTML}`
      );
      // Both `.catch()`s keep the queue itself always resolved — a failed
      // save (this one, or the one before it) must not skip/poison every
      // save queued after it.
      saveQueueRef.current = (saveQueueRef.current ?? Promise.resolve())
        .catch(() => undefined)
        .then(() => onManualSaveRef.current?.({ html, patch }))
        .catch(() => undefined);
    }

    function emitHistoryState() {
      onHistoryStateChangeRef.current?.({
        canUndo: history.canUndo(),
        canRedo: history.canRedo()
      });
    }

    function commit(op: PatchOp) {
      history.commit(op);
      refreshLayers();
      pendingOpsRef.current.push(op);
      markDirty();
      emitHistoryState();
    }
    commitFnRef.current = commit;

    historyControlsRef.current = {
      undo: () => {
        if (!history.undo()) return;
        refreshLayers();
        markDirty();
        emitHistoryState();
      },
      redo: () => {
        if (!history.redo()) return;
        refreshLayers();
        markDirty();
        emitHistoryState();
      },
      canUndo: () => history.canUndo(),
      canRedo: () => history.canRedo(),
      // Always `force` — undo/redo (and a save with nothing newly committed since the
      // last one) may leave `pendingOpsRef` empty even though the DOM itself changed.
      flushSave: () => persistNow(pendingOpsRef.current.splice(0), true)
    };

    onCommitReady(commit);
    onSaveControlsReadyRef.current?.({
      save: () => historyControlsRef.current?.flushSave()
    });
    onUndoRedoControlsReadyRef.current?.({
      undo: () => historyControlsRef.current?.undo(),
      redo: () => historyControlsRef.current?.redo()
    });
    emitHistoryState();
    refreshLayers();
    doFitToScreen(); // FR-B-07: fit-to-screen is the default state whenever a version loads.

    function targetFromEvent(e: MouseEvent): Element | null {
      const el =
        (e.target as Element | null)?.closest?.(`[${Srcmap.idAttr}]`) ?? null;
      // studio-builder-spec.md §4.3: html/body are never valid hover/select targets.
      if (el && (el.tagName === "HTML" || el.tagName === "BODY")) return null;
      return el;
    }

    // A keydown fired inside the iframe's own document never bubbles to the parent
    // `window` (separate browsing context) — every global shortcut in this file and
    // in `useStudioModeHotkeys` (V/E/C/D) is wired to `window`, so without this,
    // clicking an element to select it (which moves focus into the iframe) would
    // silently kill every keyboard shortcut until focus moves back out. Skipped
    // while the iframe's own contenteditable/input has focus, mirroring the same
    // `isTextInput` guard `window`'s own listener applies — otherwise inline text
    // editing (studio-builder-spec.md §5) couldn't type "z"/"s"/Delete/Escape.
    const FORWARDED_KEYS = new Set([
      "escape",
      "delete",
      "v",
      "e",
      "c",
      "d",
      "z",
      "s",
      "+",
      "=",
      "-",
      "0",
      "1"
    ]);
    doc.addEventListener("keydown", (e) => {
      if (isTextInput(doc.activeElement)) return;
      if (!FORWARDED_KEYS.has(e.key.toLowerCase())) return;
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: e.key,
          code: e.code,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
          repeat: e.repeat
        })
      );
      e.preventDefault();
    });

    // Debounced ~1 frame (studio-builder-spec.md §4.3) — throttles to the latest
    // pointer position per animation frame instead of firing on every mousemove.
    let hoverFrame: number | null = null;
    let pendingHoverEvent: MouseEvent | null = null;
    doc.body.addEventListener("mousemove", (e) => {
      if (
        modeRef.current !== "select" &&
        modeRef.current !== "edit" &&
        modeRef.current !== "comment"
      ) {
        return;
      }
      pendingHoverEvent = e;
      if (hoverFrame !== null) return;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = null;
        const ev = pendingHoverEvent;
        pendingHoverEvent = null;
        if (ev)
          onHoverRef.current(
            targetFromEvent(ev)?.getAttribute(Srcmap.idAttr) ?? null
          );
      });
    });

    doc.body.addEventListener("click", (e) => {
      if (modeRef.current === "draw") return;
      const target = targetFromEvent(e);
      const id = target?.getAttribute(Srcmap.idAttr);
      if (!id) return;
      e.preventDefault();
      if (modeRef.current === "comment") {
        onCommentTargetRef.current?.({
          srcmapId: id,
          tag: target!.tagName.toLowerCase(),
          text: (target!.textContent ?? "").trim().slice(0, 20)
        });
        return;
      }
      onSelectRef.current(id);
    });

    // FR-B-11: double-click a plain-text element to edit it in place. Blocked when the
    // element has child *elements* — `replaceText` overwrites `textContent`, which would
    // silently drop nested markup, so only leaf text nodes are eligible.
    doc.body.addEventListener("dblclick", (e) => {
      if (modeRef.current !== "edit") return;
      const el = targetFromEvent(e) as HTMLElement | null;
      const srcmapId = el?.getAttribute(Srcmap.idAttr);
      if (!el || !srcmapId || el.children.length > 0) return;
      if (el.getAttribute("contenteditable") === "true") return;
      e.preventDefault();

      const originalText = el.textContent ?? "";
      el.setAttribute("contenteditable", "true");
      el.focus();
      const range = doc.createRange();
      range.selectNodeContents(el);
      const selection = doc.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      function stopEditing(shouldCommit: boolean) {
        el!.removeAttribute("contenteditable");
        if (shouldCommit) {
          const text = el!.textContent ?? "";
          if (text !== originalText) {
            commit({ type: "replaceText", srcmapId: srcmapId!, text });
          }
        } else {
          el!.textContent = originalText;
        }
      }

      function onKeyDown(ke: KeyboardEvent) {
        if (ke.key === "Enter" && !ke.shiftKey) {
          ke.preventDefault();
          el!.blur();
        } else if (ke.key === "Escape") {
          ke.preventDefault();
          stopEditing(false);
          el!.blur();
        }
      }

      function onBlur() {
        if (el!.getAttribute("contenteditable") === "true") stopEditing(true);
        el!.removeEventListener("keydown", onKeyDown);
        el!.removeEventListener("blur", onBlur);
      }

      el.addEventListener("keydown", onKeyDown);
      el.addEventListener("blur", onBlur);
    });

    // Zoom/pan need to also work while the cursor is over the page content, not just the
    // canvas gutter — a separate document doesn't forward wheel/pointer events to the parent.
    // The iframe only fires `load` once per `srcDoc`, so these listeners are registered exactly
    // once for the whole editing session — closing over `handleWheel`/`handleDragMove` directly
    // would freeze them at whatever `transform.scale` was at that one moment (both are recreated
    // on every zoom/pan since they depend on the transform), silently corrupting the on-screen
    // anchor point for every wheel/drag over the page content from the very next zoom onward.
    // Reading through a ref (updated every render) is what keeps them current instead.
    doc.addEventListener(
      "wheel",
      (e) =>
        handleWheelRef.current(e, iframeRef.current!.getBoundingClientRect()),
      { passive: false }
    );
    doc.addEventListener("pointerdown", (e) => {
      if (beginPan(e.button, e.pointerId)) e.preventDefault();
    });
    doc.addEventListener("pointermove", (e) => handleDragMoveRef.current(e));
    doc.addEventListener("pointerup", handleDragEnd);
  }, [
    onCommitReady,
    refreshLayers,
    doFitToScreen,
    beginPan,
    handleDragEnd,
    markDirty
  ]);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    const srcmap = srcmapRef.current;
    const container = containerRef.current;
    if (!iframe || !srcmap || !container) return;
    const containerRect = container.getBoundingClientRect();

    const hoverEl = hoveredId ? srcmap.get(hoveredId) : undefined;
    setHoverTarget(
      hoverEl
        ? measureOverlayTarget(iframe, hoverEl, transform.scale, containerRect)
        : null
    );

    const selectedEl = selectedId ? srcmap.get(selectedId) : undefined;
    setSelectedTarget(
      selectedEl
        ? measureOverlayTarget(
            iframe,
            selectedEl,
            transform.scale,
            containerRect
          )
        : null
    );
    onSelectedElementChange(
      selectedEl
        ? {
            tag: selectedEl.tagName.toLowerCase(),
            imageSrc: selectedEl.getAttribute("src") ?? undefined,
            values: readInspectorValues(selectedEl as HTMLElement)
          }
        : null
    );
    // `revision` bumps after every commit so an edited element's rect/values re-measure.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- `revision` is a deliberate trigger-only dep, see comment above
  }, [hoveredId, selectedId, transform, revision, onSelectedElementChange]);

  return (
    <div
      ref={containerRef}
      className="relative size-full overflow-hidden overscroll-x-none bg-muted"
      style={{
        cursor: isPanning ? "grabbing" : spaceHeld ? "grab" : undefined,
        touchAction: "none"
      }}
      onPointerDown={handlePointerDown}
      onDoubleClick={(e) => {
        if (e.target === e.currentTarget) doFitToScreen();
      }}
    >
      <div style={style}>
        <iframe
          ref={iframeRef}
          title="Studio canvas"
          srcDoc={html}
          // No `allow-scripts`: every write path to this HTML strips `<script>`/`on*`handlers
          // server-side (`sanitizeLandingHtml`) before it's ever stored, so nothing here should
          // legitimately need to execute — and `allow-same-origin` alone is already enough for
          // `domToCanvas`'s same-origin-document requirement above. Combining the two on a
          // `srcDoc` iframe would let any script that DID slip through run as this app's own
          // origin (cookies/session-riding fetches), same risk `custom-import-page.tsx` avoids.
          sandbox="allow-same-origin"
          onLoad={handleLoad}
          className="w-[1200px] border-0 bg-white"
          style={{ height: contentHeight }}
        />
        <DrawOverlay
          ref={drawOverlayRef}
          active={mode === "draw"}
          tool={drawTool}
          color={drawColor}
          width={CONTENT_WIDTH}
          height={CONTENT_HEIGHT}
          onCanUndoChange={onDrawCanUndoChange}
        />
      </div>
      {/* Draw mode has its own overlay (DrawOverlay above) — showing a leftover
          hover/select outline from whichever mode was active before is just
          noise while the user is actually drawing. */}
      {mode !== "view" && mode !== "draw" && (
        <HoverSelectOverlay hover={hoverTarget} selected={selectedTarget} />
      )}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{m.studioDeleteConfirmTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
              {m.studioDeleteConfirmDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {m.studioDeleteConfirmCancel()}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              {m.studioDeleteConfirmAction()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
