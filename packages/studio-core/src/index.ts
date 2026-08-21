export {
  applyOpsToHtml,
  detectFunnelGaps,
  InvalidGeneratedHtmlError,
  srcmapToJson,
  stampSrcmap
} from "./html.js";
export type { FunnelGaps, SrcmapEntry } from "./html.js";
export { PatchHistory } from "./history.js";
export { extractImageSources } from "./image-extract.js";
export type { ImageSource } from "./image-extract.js";
export { applyLayerNames, autoNameLayers } from "./layer-naming.js";
export type { AutoNameResult } from "./layer-naming.js";
export { applyOp } from "./ops.js";
// `sanitizeLandingHtml` deliberately isn't re-exported here — it's server-only
// (`apps/api`) and pulls in `sanitize-html`, a Node-oriented dependency. Any
// client bundle that imports from this barrel (apps/dashboard's canvas.tsx
// does, for `buildSrcmap`/`Srcmap`) would otherwise drag it into the browser
// build too. Import it from "@dv/studio-core/sanitize" instead.
export { buildSrcmap, Srcmap } from "./srcmap.js";
export type { PatchOp, PatchOpType } from "./types.js";
