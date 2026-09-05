import {
  promptLibraryEntrySchema,
  promptLibraryListResponseSchema,
  type PromptLibraryEntry
} from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const promptLibraryFetch = createApiFetch("prompt-library");

export async function fetchPromptLibrary(): Promise<PromptLibraryEntry[]> {
  // No leading `/` — the backend route mounts at exactly `/api/prompt-library` (Hono's
  // sub-router `"/"` maps to the mount prefix itself, not `<prefix>/`), so a bare trailing
  // slash 404s.
  const res = await promptLibraryFetch("");
  return promptLibraryListResponseSchema.parse(await res.json()).entries;
}

export async function fetchPromptLibraryEntry(
  slug: string
): Promise<PromptLibraryEntry> {
  const res = await promptLibraryFetch(`/${slug}`);
  return promptLibraryEntrySchema.parse(await res.json());
}

const landingsFetch = createApiFetch("landings");

/** `GET /api/landings/templates/:id/preview-html` — rendered HTML for the template linked to a
 * "trang-day-du" entry (`entry.templateId`). Mirrors `studio/api.ts`'s `fetchVersionHtml`
 * (plain text response, not JSON). */
export async function fetchTemplatePreviewHtml(
  templateId: string
): Promise<string> {
  const res = await landingsFetch(`/templates/${templateId}/preview-html`);
  return res.text();
}
