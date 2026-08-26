import { z } from "zod";

import { orgIdSchema, idSchema } from "./common.js";
import {
  funnelGapsSchema,
  landingPageDetailSchema,
  landingPageSchema,
  pageVersionSchema
} from "./studio.js";

export const customImportSourceKindValues = [
  "zip",
  "files",
  "paste_html",
  "url_fetch"
] as const;
export const customImportSourceKindSchema = z.enum(
  customImportSourceKindValues
);
export type CustomImportSourceKind = z.infer<
  typeof customImportSourceKindSchema
>;

/** `page-system/custom-import.md` §`customPageBundles`. */
export const detectedFormSchema = z.object({
  selector: z.string(),
  wired: z.boolean()
});
export type DetectedForm = z.infer<typeof detectedFormSchema>;

export const customPageBundleSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  sourceKind: customImportSourceKindSchema,
  detectedForms: z.array(detectedFormSchema).default([]),
  importedAt: z.coerce.date(),
  lastReuploadedAt: z.coerce.date().nullable()
});
export type CustomPageBundle = z.infer<typeof customPageBundleSchema>;

/** 1 `<form>` field the wizard can offer to map — computed fresh from the current HTML on every
 * import/reupload, never persisted (only the mapping outcome, via `wireLeadForm`, changes the
 * page itself). */
export const importedFormFieldSchema = z.object({
  name: z.string(),
  type: z.string()
});
export const importedFormSchema = z.object({
  selector: z.string(),
  fields: z.array(importedFormFieldSchema)
});
export type ImportedForm = z.infer<typeof importedFormSchema>;

export const importCustomPageResponseSchema = landingPageDetailSchema.extend({
  funnelGaps: funnelGapsSchema,
  detectedForms: z.array(importedFormSchema)
});
export type ImportCustomPageResponse = z.infer<
  typeof importCustomPageResponseSchema
>;

/** `POST /:id/wire-lead-form` — maps whichever of the form's own field names correspond to the
 * canonical lead fields `apps/landing-runtime/src/lead-form.ts` reads (`fullName`/`phone`/
 * `email`/`persona`) so the wizard can rename them in place. Unmapped canonical fields (e.g. no
 * `email` input existed) are simply not added — the runtime already treats them as optional. */
export const wireLeadFormInputSchema = z.object({
  selector: z.string().min(1),
  fieldMapping: z.object({
    fullName: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    persona: z.string().min(1).optional()
  })
});
export type WireLeadFormInput = z.infer<typeof wireLeadFormInputSchema>;

/** `page-system/custom-import.md` §Editing "Comment mode + AI chat" — an exact search/replace
 * op on the current raw HTML (`product/vision.md` principle #3: a typed op, never a freeform
 * rewrite). `search` must occur exactly once in the HTML the op is applied against; anything
 * else is a rejected/skipped op, not a corrupted page. */
export const customChatEditSchema = z.object({
  search: z.string().min(1),
  replace: z.string(),
  reason: z.string()
});
export type CustomChatEdit = z.infer<typeof customChatEditSchema>;

export const customChatEditStatusValues = [
  "applied",
  "not_found",
  "ambiguous"
] as const;
export const customChatEditStatusSchema = z.enum(customChatEditStatusValues);
export type CustomChatEditStatus = z.infer<typeof customChatEditStatusSchema>;

export const customChatEditResultSchema = customChatEditSchema.extend({
  status: customChatEditStatusSchema
});
export type CustomChatEditResult = z.infer<typeof customChatEditResultSchema>;

/** `POST /:id/custom-chat` — dry run: proposes edits against the current HTML, doesn't persist
 * anything yet (the dashboard shows the diff, user approves, then `POST
 * /:id/custom-chat/apply` with these same edits re-validates + lands a new version). */
export const customChatProposeInputSchema = z.object({
  message: z.string().min(1)
});
export const customChatProposeResultSchema = z.object({
  summary: z.string(),
  edits: z.array(customChatEditSchema)
});
export type CustomChatProposeResult = z.infer<
  typeof customChatProposeResultSchema
>;

export const customChatApplyInputSchema = z.object({
  edits: z.array(customChatEditSchema)
});
export const customChatApplyResultSchema = z.object({
  version: pageVersionSchema,
  results: z.array(customChatEditResultSchema)
});
export type CustomChatApplyResult = z.infer<typeof customChatApplyResultSchema>;

/** `page-system/custom-import.md` §Editing "Convert sang native" — 1-way; the page keeps its
 * id/history, only `source` (→ `manual`, same "has a full canvas editor now" meaning the doc
 * uses for `native_manual`) and the current version (→ has `spec`) change. */
export const convertToNativeResultSchema = z.object({
  landingPage: landingPageSchema,
  version: pageVersionSchema,
  sectionsConverted: z.number().int().nonnegative(),
  sectionsFallback: z.number().int().nonnegative()
});
export type ConvertToNativeResult = z.infer<typeof convertToNativeResultSchema>;
