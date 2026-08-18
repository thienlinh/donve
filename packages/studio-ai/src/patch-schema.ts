import { z } from "zod";

import type { PatchOp } from "./types.js";

/** Zod mirror of `PatchOp` (@dv/studio-core) — the AI-facing `apply_patch` tool's input shape
 * (ai-integration-byok.md §4). Kept in lockstep with studio-core's union via the `satisfies`
 * check below rather than generating one from the other. */
export const patchOpSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("replaceText"),
    srcmapId: z.string().min(1),
    text: z.string()
  }),
  z.object({
    type: z.literal("setStyle"),
    srcmapId: z.string().min(1),
    prop: z.string().min(1),
    value: z.string().nullable()
  }),
  z.object({
    type: z.literal("setAttr"),
    srcmapId: z.string().min(1),
    attr: z.string().min(1),
    value: z.string().nullable()
  }),
  z.object({
    type: z.literal("replaceOuterHTML"),
    srcmapId: z.string().min(1),
    html: z.string().min(1)
  }),
  z.object({
    type: z.literal("insertBefore"),
    srcmapId: z.string().min(1),
    html: z.string().min(1)
  }),
  z.object({
    type: z.literal("insertAfter"),
    srcmapId: z.string().min(1),
    html: z.string().min(1)
  }),
  z.object({ type: z.literal("remove"), srcmapId: z.string().min(1) }),
  z.object({
    type: z.literal("toggleVisibility"),
    srcmapId: z.string().min(1),
    hidden: z.boolean()
  }),
  z.object({
    type: z.literal("renameLayer"),
    srcmapId: z.string().min(1),
    name: z.string().min(1)
  }),
  z.object({
    type: z.literal("moveBefore"),
    srcmapId: z.string().min(1),
    beforeSrcmapId: z.string().nullable()
  })
]) satisfies z.ZodType<PatchOp>;

/** `apply_patch` tool input (ai-integration-byok.md §4/§6). */
export const applyPatchInputSchema = z.object({
  ops: z.array(patchOpSchema).min(1),
  summary: z.string().min(1)
});
export type ApplyPatchInput = z.infer<typeof applyPatchInputSchema>;

/** `apply_full_html` fallback tool input — used once `apply_patch` has failed
 * validation twice in the same turn (ai-integration-byok.md §4/§6). */
export const applyFullHtmlInputSchema = z.object({
  html: z.string().min(1),
  summary: z.string().min(1)
});
export type ApplyFullHtmlInput = z.infer<typeof applyFullHtmlInputSchema>;
