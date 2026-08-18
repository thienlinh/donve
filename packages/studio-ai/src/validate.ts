import { buildSrcmap } from "@dv/studio-core";
import { parseHTML } from "linkedom";

import type { PatchOp } from "./types.js";

export type PatchValidation =
  | { valid: true }
  | { valid: false; invalidIds: string[] };

/**
 * Checks every op's target id (and `moveBefore`'s anchor) exists in `html` before applying.
 * `applyOpsToHtml` itself treats a missing id as a safe no-op (studio-core/src/ops.ts) — that's
 * the right call for the live-DOM/undo path, but a server-side apply_patch tool call needs to
 * actually surface a bad id to the model instead of silently persisting a no-change version.
 */
export function validatePatchOps(
  html: string,
  ops: PatchOp[]
): PatchValidation {
  const { document } = parseHTML(html);
  const srcmap = buildSrcmap(document.documentElement);

  const invalidIds = new Set<string>();
  for (const op of ops) {
    if (!srcmap.get(op.srcmapId)) invalidIds.add(op.srcmapId);
    if (
      op.type === "moveBefore" &&
      op.beforeSrcmapId &&
      !srcmap.get(op.beforeSrcmapId)
    ) {
      invalidIds.add(op.beforeSrcmapId);
    }
  }
  return invalidIds.size === 0
    ? { valid: true }
    : { valid: false, invalidIds: [...invalidIds] };
}
