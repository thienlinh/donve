import { applyOpsToHtml } from "@dv/studio-core";

import type { PatchOp } from "./types.js";

/**
 * Server-side apply_patch handler (architecture.md §5.1): validates/applies
 * `ops` against `html` and returns the new HTML. Delegates entirely to
 * studio-core — no patch-application logic lives in this package.
 */
export function applyPatch(html: string, ops: PatchOp[]): string {
  return applyOpsToHtml(html, ops);
}
