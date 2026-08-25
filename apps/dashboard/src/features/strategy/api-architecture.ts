import { pageVersionSchema, type PageVersion } from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const landingsFetch = createApiFetch("landings");

/** Page Architect (`ai/agent-pipeline.md`) — requires a confirmed Strategy Brief. */
export async function generateArchitecture(
  landingPageId: string
): Promise<PageVersion> {
  const res = await landingsFetch(`/${landingPageId}/architecture`, {
    method: "POST"
  });
  return pageVersionSchema.parse(await res.json());
}

/** Content Agent — fills props per element in parallel from the last architected version. */
export async function fillContent(landingPageId: string): Promise<PageVersion> {
  const res = await landingsFetch(`/${landingPageId}/content-fill`, {
    method: "POST"
  });
  return pageVersionSchema.parse(await res.json());
}
