import { encryptApiKey, getProvider, keyLast4 } from "@dv/ai-gateway";
import {
  aiUsageSummarySchema,
  compilePromptTemplateSchema,
  compiledPromptSchema,
  connectAiConnectionSchema,
  createPromptTemplateSchema,
  createSkillSchema,
  generateAiRequestSchema,
  generateAiResponseSchema,
  landingSkillOptionSchema,
  listAiModelsSchema,
  promptTemplateSchema,
  promptTestRunSchema,
  publicAiConnectionSchema,
  runPromptTestSchema,
  setLandingSkillSchema,
  skillSchema,
  updateAiConnectionSchema,
  updatePromptTemplateSchema,
  updateSkillSchema
} from "@dv/contracts";
import {
  aiConnectionsRepository,
  aiUsageRepository,
  compilePromptTemplate,
  landingPagesRepository,
  organizationsRepository,
  promptTemplatesRepository,
  promptTestRunsRepository,
  skillsRepository
} from "@dv/db";
import { Hono, type Context } from "hono";
import { z } from "zod";

import {
  importAiMasterKeyFromEnv,
  runModelCompletion
} from "../../lib/ai-gateway.js";
import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { runLighthouseSandbox } from "../../lib/lighthouse-sandbox.js";
import type { AppEnv } from "../../types.js";

export const aiRoutes = new Hono<AppEnv>();

/** `Variables.orgId` is nullable app-wide but `requireOrgSession` guarantees it here (app.ts). */
function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

aiRoutes.get("/connections", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const rows = await aiConnectionsRepository.list(db, orgId);
  return c.json({ connections: z.array(publicAiConnectionSchema).parse(rows) });
});

/**
 * Probes the provider's real `/models` endpoint with the key the user just typed — lets the
 * connect dialog offer a real, key-scoped model dropdown instead of a freeform text input the
 * user has to get exactly right (a wrong model id here silently breaks every future generate
 * call on this connection).
 */
aiRoutes.post("/connections/models", async (c) => {
  requireOrgId(c); // BYOK probes are still an authenticated-org-only action, no DB read needed.
  const body = listAiModelsSchema.parse(await c.req.json());

  const provider = getProvider(body.provider);
  const validation = await provider.validateKey(body.apiKey ?? "");
  if (!validation.ok) throw new ApiError(400, "invalid_api_key");

  return c.json({ models: validation.models });
});

aiRoutes.post("/connections", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = connectAiConnectionSchema.parse(await c.req.json());

  const provider = getProvider(body.provider);
  const validation = await provider.validateKey(body.apiKey);
  if (!validation.ok) throw new ApiError(400, "invalid_api_key");

  const [masterKey, existing] = await Promise.all([
    importAiMasterKeyFromEnv(c.env),
    aiConnectionsRepository.list(db, orgId)
  ]);
  const encryptedKey = await encryptApiKey(body.apiKey, masterKey);

  const row = await aiConnectionsRepository.insert(db, orgId, {
    provider: body.provider,
    encryptedKey,
    keyLast4: keyLast4(body.apiKey),
    defaultModel: body.defaultModel,
    isDefault: existing.length === 0,
    status: "active"
  });

  return c.json(publicAiConnectionSchema.parse(row), 201);
});

aiRoutes.patch("/connections/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateAiConnectionSchema.parse(await c.req.json());

  const existing = await aiConnectionsRepository.findById(db, orgId, id);
  if (!existing) throw new ApiError(404, "ai_connection_not_found");

  await Promise.all([
    body.isDefault ? aiConnectionsRepository.setDefault(db, orgId, id) : null,
    body.defaultModel
      ? aiConnectionsRepository.update(db, orgId, id, {
          defaultModel: body.defaultModel
        })
      : null
  ]);

  const updated = await aiConnectionsRepository.findById(db, orgId, id);
  return c.json(publicAiConnectionSchema.parse(updated));
});

aiRoutes.delete("/connections/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const removed = await aiConnectionsRepository.remove(
    db,
    orgId,
    c.req.param("id")
  );
  if (!removed) throw new ApiError(404, "ai_connection_not_found");
  return c.body(null, 204);
});

aiRoutes.get("/usage", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const [org, recentUsage] = await Promise.all([
    organizationsRepository.findById(db, orgId),
    aiUsageRepository.listRecent(db, orgId)
  ]);
  if (!org) throw new ApiError(404, "organization_not_found");

  return c.json(
    aiUsageSummarySchema.parse({
      aiCreditBalance: org.aiCreditBalance,
      trialUsesRemaining: org.trialUsesRemaining,
      recentUsage
    })
  );
});

aiRoutes.post("/generate", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = generateAiRequestSchema.parse(await c.req.json());

  const result = await runModelCompletion(
    db,
    c.env,
    orgId,
    body.connectionId,
    body.useCase,
    body.messages
  );

  return c.json(generateAiResponseSchema.parse(result));
});

aiRoutes.get("/skills", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const rows = await skillsRepository.list(db, orgId);
  return c.json({ skills: z.array(skillSchema).parse(rows) });
});

aiRoutes.post("/skills", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createSkillSchema.parse(await c.req.json());
  const row = await skillsRepository.insert(db, orgId, body);
  return c.json(skillSchema.parse(row), 201);
});

aiRoutes.patch("/skills/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateSkillSchema.parse(await c.req.json());

  const updated = await skillsRepository.update(db, orgId, id, body);
  if (!updated) throw new ApiError(404, "skill_not_found");
  return c.json(skillSchema.parse(updated));
});

aiRoutes.delete("/skills/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const removed = await skillsRepository.remove(db, orgId, c.req.param("id"));
  if (!removed) throw new ApiError(404, "skill_not_found");
  return c.body(null, 204);
});

/**
 * Every skill the org could enable, annotated with whether it's on for THIS landing page
 * (Studio's "skills for this page" control) — a per-landing override if one exists, else the
 * skill's org-level `isActiveDefault`.
 */
aiRoutes.get("/landings/:landingPageId/skills", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const landingPageId = c.req.param("landingPageId");

  const landingPage = await landingPagesRepository.findById(
    db,
    orgId,
    landingPageId
  );
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }

  const [all, overrides] = await Promise.all([
    skillsRepository.list(db, orgId),
    skillsRepository.listOverridesForLandingPage(db, orgId, landingPageId)
  ]);
  const options = all.map((skill) => ({
    ...skill,
    enabled: overrides.get(skill.id) ?? skill.isActiveDefault
  }));

  return c.json({ skills: z.array(landingSkillOptionSchema).parse(options) });
});

/** Toggles one skill's per-landing override, without touching the org-level default. */
aiRoutes.put("/landings/:landingPageId/skills/:skillId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const landingPageId = c.req.param("landingPageId");
  const skillId = c.req.param("skillId");
  const body = setLandingSkillSchema.parse(await c.req.json());

  const [landingPage, skill] = await Promise.all([
    landingPagesRepository.findById(db, orgId, landingPageId),
    skillsRepository.findById(db, orgId, skillId)
  ]);
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }
  if (!skill) throw new ApiError(404, "skill_not_found");

  await skillsRepository.setLandingOverride(
    db,
    orgId,
    landingPageId,
    skillId,
    body.enabled
  );

  return c.body(null, 204);
});

aiRoutes.get("/prompt-templates", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const rows = await promptTemplatesRepository.list(db, orgId);
  return c.json({
    promptTemplates: z.array(promptTemplateSchema).parse(rows)
  });
});

aiRoutes.post("/prompt-templates", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createPromptTemplateSchema.parse(await c.req.json());
  const row = await promptTemplatesRepository.insert(db, orgId, body);
  return c.json(promptTemplateSchema.parse(row), 201);
});

aiRoutes.patch("/prompt-templates/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updatePromptTemplateSchema.parse(await c.req.json());

  const updated = await promptTemplatesRepository.update(db, orgId, id, body);
  if (!updated) throw new ApiError(404, "prompt_template_not_found");
  return c.json(promptTemplateSchema.parse(updated));
});

aiRoutes.delete("/prompt-templates/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const removed = await promptTemplatesRepository.remove(
    db,
    orgId,
    c.req.param("id")
  );
  if (!removed) throw new ApiError(404, "prompt_template_not_found");
  return c.body(null, 204);
});

/** Preview the final compiled prompt (FR-F-03) — reads only, never persisted. */
aiRoutes.post("/prompt-templates/:id/compile", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = compilePromptTemplateSchema.parse(await c.req.json());

  const template = await promptTemplatesRepository.findById(db, orgId, id);
  if (!template) throw new ApiError(404, "prompt_template_not_found");

  return c.json(
    compiledPromptSchema.parse({
      compiled: compilePromptTemplate(template, body.values)
    })
  );
});

/** Every past test-bench run for this template, newest first — for the compare-2-versions UI (FR-F-04). */
aiRoutes.get("/prompt-templates/:id/test-runs", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const rows = await promptTestRunsRepository.listByTemplate(db, orgId, id);
  return c.json({ testRuns: z.array(promptTestRunSchema).parse(rows) });
});

/**
 * Test bench (FR-F-04): compile the template, run it against the chosen model, score the
 * output in a Lighthouse sandbox, and keep the run around for a later compare-2-versions.
 */
aiRoutes.post("/prompt-templates/:id/test-run", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = runPromptTestSchema.parse(await c.req.json());

  const template = await promptTemplatesRepository.findById(db, orgId, id);
  if (!template) throw new ApiError(404, "prompt_template_not_found");

  const compiled = compilePromptTemplate(template, body.values);
  const completion = await runModelCompletion(
    db,
    c.env,
    orgId,
    body.connectionId,
    "generate",
    [{ role: "user", content: compiled }]
  );

  const lighthouse = await runLighthouseSandbox(c.env, completion.text);

  const row = await promptTestRunsRepository.insert(db, orgId, {
    promptTemplateId: id,
    model: completion.model,
    compiledPrompt: compiled,
    outputHtml: completion.text,
    lighthouse,
    usage: completion.usage
  });

  return c.json(promptTestRunSchema.parse(row), 201);
});
