import {
  businessProfileSchema,
  generateBusinessProfileInputSchema,
  updateBusinessProfileInputSchema
} from "@dv/contracts";
import { businessProfilesRepository } from "@dv/db";
import { compileResearchPrompt } from "@dv/studio-ai";
import { Hono } from "hono";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "@/lib/ai-gateway.js";
import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { readCappedBytes, safeFetch } from "@/lib/safe-fetch.js";
import type { AppEnv } from "@/types.js";

import {
  extractJson,
  requireLandingPage,
  requireLandingPageContext,
  requireOrgId
} from "../shared.js";

export const businessRoutes = new Hono<AppEnv>();

// --- Business Intelligence + Strategy (ai/agent-pipeline.md §Agent roles: Research, Strategy) ---

const RESEARCH_FETCH_MAX_BYTES = 500 * 1024;

function stripHtmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

businessRoutes.get("/:id/business", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const profile = await businessProfilesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!profile) throw new ApiError(404, "business_profile_not_found");
  return c.json(businessProfileSchema.parse(profile));
});

// Research Agent — fact/inference/unknown tách rõ (strategy-brief.md §Business Knowledge Graph).
// Re-running (already has a profile) overwrites it — this is a "regenerate", not an append; the
// user's own manual edits (PATCH below) get lost if they regenerate after editing, same
// trade-off the legacy /generate route makes for pageVersions.
businessRoutes.post("/:id/business", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = generateBusinessProfileInputSchema.parse(await c.req.json());
  const landingPage = await requireLandingPage(db, orgId, id);

  const sources = await Promise.all(
    body.urls.map(async (url) => {
      try {
        const res = await safeFetch(url);
        if (!res.ok) return null;
        const bytes = await readCappedBytes(res, RESEARCH_FETCH_MAX_BYTES);
        return { url, text: stripHtmlToText(new TextDecoder().decode(bytes)) };
      } catch {
        return null;
      }
    })
  );
  const fetchedSources = sources.filter(
    (s): s is { url: string; text: string } => s !== null
  );

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const system = compileResearchPrompt({
    brief: body.brief,
    sources: fetchedSources
  });
  const result = await runModelCompletion(
    db,
    c.env,
    orgId,
    connectionId,
    "patch",
    [
      { role: "system", content: system },
      { role: "user", content: body.brief }
    ]
  );

  const extracted = extractJson(result.text, updateBusinessProfileInputSchema);
  const existing = await businessProfilesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  const profileSources = [
    { kind: "brief" as const, value: body.brief },
    ...body.urls.map((url) => ({ kind: "url" as const, value: url }))
  ];
  const profile = existing
    ? await businessProfilesRepository.update(db, orgId, existing.id, {
        ...extracted,
        sources: profileSources
      })
    : await businessProfilesRepository.insert(db, orgId, {
        landingPageId: landingPage.id,
        ...extracted,
        sources: profileSources
      });
  if (!profile) throw new ApiError(500, "business_profile_save_failed");

  return c.json(businessProfileSchema.parse(profile), existing ? 200 : 201);
});

businessRoutes.patch("/:id/business", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateBusinessProfileInputSchema.parse(await c.req.json());
  await requireLandingPage(db, orgId, id);

  const existing = await businessProfilesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!existing) throw new ApiError(404, "business_profile_not_found");

  const profile = await businessProfilesRepository.update(
    db,
    orgId,
    existing.id,
    body
  );
  if (!profile) throw new ApiError(500, "business_profile_save_failed");
  return c.json(businessProfileSchema.parse(profile));
});
