import { z } from "zod";

import { idSchema, timestampsSchema } from "./common.js";

/** Platform-wide, read-only prompt gallery — no `orgId` (identical for every tenant). */
export const promptLibraryEntrySchema = z
  .object({
    id: idSchema,
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    promptText: z.string(),
    sortOrder: z.number(),
    // Every entry sets this (seed.ts) — may point at a `templates` row that doesn't exist in
    // this environment (`tooling/seed-templates` is a separate, manually-invoked script);
    // treat a failed lookup the same as `null`.
    templateId: idSchema.nullable()
  })
  .extend(timestampsSchema.shape);
export type PromptLibraryEntry = z.infer<typeof promptLibraryEntrySchema>;

export const promptLibraryListResponseSchema = z.object({
  entries: z.array(promptLibraryEntrySchema)
});
export type PromptLibraryListResponse = z.infer<
  typeof promptLibraryListResponseSchema
>;
