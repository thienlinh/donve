import {
  businessProfileSchema,
  strategyBriefSchema,
  updateStrategyBriefInputSchema
} from "@dv/contracts";
import { businessProfilesRepository, strategyBriefsRepository } from "@dv/db";
import { compileStrategyPrompt } from "@dv/studio-ai";
import { Hono } from "hono";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "@/lib/ai-gateway.js";
import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import type { AppEnv } from "@/types.js";

import {
  extractJson,
  requireLandingPage,
  requireLandingPageContext,
  requireOrgId
} from "../shared.js";

export const strategyRoutes = new Hono<AppEnv>();

strategyRoutes.get("/:id/strategy", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const brief = await strategyBriefsRepository.findByLandingPage(db, orgId, id);
  if (!brief) throw new ApiError(404, "strategy_brief_not_found");
  return c.json(strategyBriefSchema.parse(brief));
});

// Strategy Agent — requires a Business Knowledge Graph first (page-architect.md §agent roles:
// Strategy Agent's input IS the graph, not the raw brief).
strategyRoutes.post("/:id/strategy", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);

  const businessProfile = await businessProfilesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!businessProfile) throw new ApiError(409, "business_profile_required");

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const system = compileStrategyPrompt({
    product: businessProfileSchema.shape.product.parse(businessProfile.product),
    customer: businessProfileSchema.shape.customer.parse(
      businessProfile.customer
    ),
    market: businessProfileSchema.shape.market.parse(businessProfile.market)
  });
  const result = await runModelCompletion(
    db,
    c.env,
    orgId,
    connectionId,
    "generate",
    [
      { role: "system", content: system },
      {
        role: "user",
        content: "Sinh Strategy Brief từ Business Knowledge Graph ở trên."
      }
    ]
  );

  const extracted = extractJson(result.text, updateStrategyBriefInputSchema);
  const existing = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  // Regenerating unconfirms — a new AI draft on top of a previously-confirmed brief must be
  // re-reviewed, same reasoning as `strategy-brief.md` §Xác nhận requiring confirm before
  // Page Architect can run.
  const brief = existing
    ? await strategyBriefsRepository.update(db, orgId, existing.id, {
        ...extracted,
        confirmedAt: null,
        confirmedBy: null
      })
    : await strategyBriefsRepository.insert(db, orgId, {
        landingPageId: landingPage.id,
        ...extracted,
        confirmedAt: null,
        confirmedBy: null
      });
  if (!brief) throw new ApiError(500, "strategy_brief_save_failed");

  return c.json(strategyBriefSchema.parse(brief), existing ? 200 : 201);
});

strategyRoutes.patch("/:id/strategy", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateStrategyBriefInputSchema.parse(await c.req.json());
  await requireLandingPage(db, orgId, id);

  const existing = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!existing) throw new ApiError(404, "strategy_brief_not_found");

  // A manual edit re-unconfirms too — same reasoning as regenerate above.
  const brief = await strategyBriefsRepository.update(db, orgId, existing.id, {
    ...body,
    confirmedAt: null,
    confirmedBy: null
  });
  if (!brief) throw new ApiError(500, "strategy_brief_save_failed");
  return c.json(strategyBriefSchema.parse(brief));
});

// `strategy-brief.md` §Xác nhận — required before Page Architect (roadmap.md's next step) may
// transition the page to ARCHITECTED (`ai/agent-pipeline.md`'s state machine).
strategyRoutes.post("/:id/strategy/confirm", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const existing = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!existing) throw new ApiError(404, "strategy_brief_not_found");

  const brief = await strategyBriefsRepository.update(db, orgId, existing.id, {
    confirmedAt: new Date(),
    confirmedBy: c.get("userId") ?? null
  });
  if (!brief) throw new ApiError(500, "strategy_brief_save_failed");
  return c.json(strategyBriefSchema.parse(brief));
});
