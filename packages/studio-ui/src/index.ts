export {
  StudioModeProvider,
  useStudioMode,
  useStudioModeHotkeys
} from "./mode/mode-context.js";
export { STUDIO_MODES } from "./mode/types.js";
export type { StudioMode } from "./mode/types.js";

export {
  useCanvasTransform,
  wheelZoomFactor
} from "./canvas/use-canvas-transform.js";
export type {
  CanvasTransform,
  UseCanvasTransformOptions,
  UseCanvasTransformResult
} from "./canvas/use-canvas-transform.js";

export { HoverSelectOverlay } from "./components/hover-select-overlay.js";
export type {
  HoverSelectOverlayProps,
  OverlayTarget
} from "./components/hover-select-overlay.js";

export { DRAW_TOOLS, DrawOverlay } from "./components/draw-overlay.js";
export type {
  DrawOverlayHandle,
  DrawOverlayProps,
  DrawTool
} from "./components/draw-overlay.js";

export { LayerTreePanel } from "./components/layer-tree-panel.js";
export type {
  LayerKind,
  LayerNode,
  LayerTreePanelProps
} from "./components/layer-tree-panel.js";

export { InspectorPanel } from "./components/inspector-panel.js";
export type {
  InspectorPanelProps,
  InspectorProp,
  InspectorValues
} from "./components/inspector-panel.js";

export { formatViNumber, parseViNumber } from "./lib/vi-number.js";
