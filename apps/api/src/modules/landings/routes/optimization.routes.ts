import {
  generateOptimizationHypothesesResultSchema,
  optimizationHypothesisSchema,
  reviewOptimizationHypothesisInputSchema
} from "@dv/contracts";
import {
  auditRunsRepository,
  eventsRepository,
  optimizationHypothesesRepository
} from "@dv/db";
import { compileOptimizationPrompt } from "@dv/studio-ai";
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

export const optimizationRoutes = new Hono<AppEnv>();

// --- Optimization Loop (`product/vision.md` §Optimization Loop, `ai/agent-pipeline.md` §Agent
// roles: "Input: Analytics + Quality history. Output: Ranked hypothesis, không tự publish") ---

const OPTIMIZATION_LOOKBACK_DAYS = 30;
const OPTIMIZATION_AUDIT_HISTORY_LIMIT = 5;

optimizationRoutes.post("/:id/optimization", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const since = new Date(
    Date.now() - OPTIMIZATION_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
  );
  const [recentEvents, auditRuns] = await Promise.all([
    eventsRepository.listByLandingPageSince(db, orgId, id, since),
    auditRunsRepository.listByLandingPage(db, orgId, id)
  ]);
  // roadmap.md §Optimization Loop's own exit condition: "AI đề xuất ít nhất 1 hypothesis có căn
  // cứ dữ liệu thật từ 1 trang đã có traffic" — refuse to hallucinate hypotheses off zero data.
  if (recentEvents.length === 0) {
    throw new ApiError(409, "no_traffic_yet");
  }

  const countByType = new Map<string, number>();
  for (const event of recentEvents) {
    countByType.set(event.type, (countByType.get(event.type) ?? 0) + 1);
  }

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const system = compileOptimizationPrompt({
    lookbackDays: OPTIMIZATION_LOOKBACK_DAYS,
    eventCounts: [...countByType.entries()].map(([type, count]) => ({
      type,
      count
    })),
    auditHistory: auditRuns
      .slice(0, OPTIMIZATION_AUDIT_HISTORY_LIMIT)
      .map((run) => ({
        createdAt: run.createdAt.toISOString(),
        overallScore: run.overallScore,
        categoryScores: run.categoryScores as Record<string, number>
      }))
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
        content: "Đề xuất hypothesis tối ưu conversion từ dữ liệu ở trên."
      }
    ]
  );
  const parsed = extractJson(
    result.text,
    generateOptimizationHypothesesResultSchema
  );

  const inserted = await Promise.all(
    parsed.hypotheses.map((h) =>
      optimizationHypothesesRepository.insert(db, orgId, {
        landingPageId: id,
        hypothesis: h.hypothesis,
        rationale: h.rationale,
        evidenceRefs: h.evidenceRefs,
        expectedImpact: h.expectedImpact,
        status: "proposed",
        reviewedBy: null
      })
    )
  );

  return c.json(
    inserted
      .filter((row) => row !== undefined)
      .map((row) => optimizationHypothesisSchema.parse(row)),
    201
  );
});

optimizationRoutes.get("/:id/optimization", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const rows = await optimizationHypothesesRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  return c.json(rows.map((row) => optimizationHypothesisSchema.parse(row)));
});

// Approval only — "không tự publish", so this never touches `pageVersions`/publish state,
// just records what a human decided about the hypothesis for whoever acts on it manually.
optimizationRoutes.patch("/:id/optimization/:hypothesisId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const hypothesisId = c.req.param("hypothesisId");
  await requireLandingPage(db, orgId, id);
  const body = reviewOptimizationHypothesisInputSchema.parse(
    await c.req.json()
  );

  const existing = await optimizationHypothesesRepository.findById(
    db,
    orgId,
    hypothesisId
  );
  if (!existing || existing.landingPageId !== id) {
    throw new ApiError(404, "hypothesis_not_found");
  }

  const updated = await optimizationHypothesesRepository.update(
    db,
    orgId,
    hypothesisId,
    { status: body.status, reviewedBy: c.get("userId") ?? null }
  );
  if (!updated) throw new ApiError(500, "hypothesis_update_failed");
  return c.json(optimizationHypothesisSchema.parse(updated));
});
