import {
  auditCategoryValues,
  auditResultSchema,
  auditSeveritySchema,
  autoFixResultSchema,
  computeCategoryScore,
  computeOverallScore,
  eventDefinitionSchema,
  nativePageDocumentSchema,
  passesLaunchThreshold,
  strategyBriefSchema,
  type AuditCategory
} from "@dv/contracts";
import {
  auditFindingsRepository,
  auditRunsRepository,
  eventDefinitionsRepository,
  pageVersionsRepository,
  strategyBriefsRepository
} from "@dv/db";
import {
  compileArchitectureFixPrompt,
  compileQualityCriticPrompt
} from "@dv/studio-ai";
import { architectCatalogSummary, componentMetaById } from "@dv/studio-catalog";
import { renderPageArtifact } from "@dv/studio-render";
import type { Spec } from "@json-render/core";
import { Hono, type Context } from "hono";
import { z } from "zod";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "@/lib/ai-gateway.js";
import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { syncEventDefinitions } from "@/lib/event-definitions.js";
import { runLighthouseSandbox } from "@/lib/lighthouse-sandbox.js";
import {
  checkPageStructure,
  checkSeo,
  checkTokenConsistency,
  checkTrackingCompleteness,
  type RawFinding
} from "@/lib/quality-audit.js";
import type { AppEnv } from "@/types.js";

import {
  buildElementsFromSections,
  extractJson,
  fillElementProps,
  insertVersionAndActivate,
  pageArchitectResultSchema,
  requireLandingPage,
  requireLandingPageContext,
  requireOrgId
} from "../shared.js";

export const auditRoutes = new Hono<AppEnv>();

// --- Quality Audit (quality/quality-spec.md §Tầng 3 — page-level) ---

const qualityCritiqueResultSchema = z.object({
  findings: z.array(
    z.object({
      category: z.enum(["strategy_alignment", "messaging_copy"]),
      severity: auditSeveritySchema,
      message: z.string(),
      elementId: z.string().nullable()
    })
  )
});

/** Shared by `/audit` and the Auto Fixer loop (`/auto-fix`, which needs a fresh audit result
 * after every fix round to decide whether to keep going). `landingPage`/`version` are passed in
 * already-fetched since the Auto Fixer re-audits on the loop's own already-loaded rows. */
async function runQualityAudit(
  c: Context<AppEnv>,
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  id: string,
  landingPage: { name: string; campaignId: string | null },
  version: { id: string; spec: unknown }
) {
  const doc = nativePageDocumentSchema.parse(version.spec);

  const strategyBriefRow = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  const strategyBrief = strategyBriefRow
    ? strategyBriefSchema.parse(strategyBriefRow)
    : null;

  const artifact = await renderPageArtifact({
    spec: doc.pageSpec as Spec,
    tokens: doc.tokens,
    description: doc.seo?.description,
    hostname: `${id}.audit.local`,
    title: landingPage.name,
    runtimeConfig: {
      orgId,
      campaignId: landingPage.campaignId,
      deployId: "audit"
    }
  });

  const findings: RawFinding[] = [
    ...checkPageStructure(doc),
    ...checkSeo(artifact.html),
    ...checkTrackingCompleteness(doc, artifact.html, componentMetaById),
    ...checkTokenConsistency(artifact.html)
  ];

  const lighthouse = await runLighthouseSandbox(c.env, artifact.html);
  if (lighthouse?.performance == null) {
    findings.push({
      category: "performance",
      severity: "low",
      message:
        "Không đo được Performance (cần runtime Bun/VPS để chạy Lighthouse sandbox).",
      elementId: null
    });
  }

  // No golden-screenshot baselines exist yet (Component Library roadmap step's tier-2 follow-up)
  // — informational only, doesn't move the score.
  findings.push({
    category: "visual_regression",
    severity: "low",
    message:
      "Chưa có golden screenshot baseline — bỏ qua tầng visual regression.",
    elementId: null
  });

  if (strategyBrief) {
    const rootChildren =
      doc.pageSpec.elements[doc.pageSpec.root]?.children ?? [];
    const elements = rootChildren
      .map((elementId) => {
        const element = doc.pageSpec.elements[elementId];
        return element
          ? {
              elementId,
              componentId: element.type,
              props: element.props
            }
          : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    const connectionId = await resolveGenerateConnectionId(db, orgId);
    const system = compileQualityCriticPrompt({ strategyBrief, elements });
    const result = await runModelCompletion(
      db,
      c.env,
      orgId,
      connectionId,
      "patch",
      [
        { role: "system", content: system },
        { role: "user", content: "Đánh giá trang hiện tại." }
      ]
    );
    const critique = extractJson(result.text, qualityCritiqueResultSchema);
    findings.push(...critique.findings);
  } else {
    findings.push(
      {
        category: "strategy_alignment",
        severity: "low",
        message: "Chưa có Strategy Brief để đối chiếu.",
        elementId: null
      },
      {
        category: "messaging_copy",
        severity: "low",
        message: "Chưa có Strategy Brief để đối chiếu.",
        elementId: null
      }
    );
  }

  const categoryScores: Partial<Record<AuditCategory, number>> = {};
  for (const category of auditCategoryValues) {
    categoryScores[category] = computeCategoryScore(
      findings.filter((f) => f.category === category)
    );
  }
  if (lighthouse?.performance != null) {
    categoryScores.performance = lighthouse.performance;
  }
  const overallScore = computeOverallScore(categoryScores);

  const auditRun = await auditRunsRepository.insert(db, orgId, {
    landingPageId: id,
    pageVersionId: version.id,
    overallScore,
    categoryScores
  });
  if (!auditRun) throw new ApiError(500, "audit_run_create_failed");

  const findingRows = await auditFindingsRepository.insertMany(
    db,
    orgId,
    findings.map((f) => ({
      auditRunId: auditRun.id,
      category: f.category,
      severity: f.severity,
      message: f.message,
      elementId: f.elementId
    }))
  );

  return auditResultSchema.parse({ ...auditRun, findings: findingRows });
}

auditRoutes.post("/:id/audit", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);
  if (!landingPage.currentVersionId)
    throw new ApiError(409, "no_version_to_audit");

  const version = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!version?.spec) throw new ApiError(409, "no_version_to_audit");

  const audit = await runQualityAudit(c, db, orgId, id, landingPage, version);
  return c.json(audit, 201);
});

auditRoutes.get("/:id/audit", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const runs = await auditRunsRepository.listByLandingPage(db, orgId, id);
  const latest = runs[0];
  if (!latest) throw new ApiError(404, "audit_not_found");

  const findingRows = await auditFindingsRepository.listByAuditRun(
    db,
    orgId,
    latest.id
  );
  return c.json(auditResultSchema.parse({ ...latest, findings: findingRows }));
});

// --- Self-critique loop / Auto Fixer (`ai/agent-pipeline.md` §Self-critique loop,
// `roadmap/roadmap.md` §Self-critique loop) ---

const AUTO_FIX_MAX_ITERATIONS = 5;
const AUTO_FIX_PLATEAU_DELTA = 2;
const AUTO_FIX_PLATEAU_STREAK = 2;

const REQUIRED_ARCHITECT_PURPOSES = [
  "understanding",
  "desire",
  "proof",
  "risk_reduction",
  "action"
] as const;

/** Applies at most 1 round of fixes for the given findings, scoped to content/structure per
 * `ai/agent-pipeline.md` (token findings have no dedicated Design Token Agent yet — a raw hex
 * literal is always `severity: "low"`, so it never blocks the launch threshold and is left for a
 * future step rather than built here). Returns the new current `pageVersionId`, or `null` when
 * nothing in scope was actionable (the loop should stop rather than spin on the same findings).
 */
async function applyAutoFixRound(
  c: Context<AppEnv>,
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  id: string,
  connectionId: string,
  strategyBrief: z.infer<typeof strategyBriefSchema> | null,
  doc: z.infer<typeof nativePageDocumentSchema>,
  findings: {
    category: AuditCategory;
    severity: string;
    message: string;
    elementId: string | null;
  }[]
): Promise<string | null> {
  const elements = { ...doc.pageSpec.elements };
  const architectureNotes = { ...doc.architectureNotes };
  const rootChildren = [...(elements[doc.pageSpec.root]?.children ?? [])];
  let touchedAnything = false;

  if (strategyBrief) {
    // Content findings: 1 refill call per distinct element, guidance listing every finding on
    // that element ordered highest-severity first (`agent-pipeline.md` §Auto Fixer: "Ưu tiên
    // thay đổi tối thiểu giải quyết finding severity cao nhất trước").
    const severityRank: Record<string, number> = {
      critical: 3,
      high: 2,
      medium: 1,
      low: 0
    };
    const guidanceByElement = new Map<string, string>();
    for (const f of findings.toSorted(
      (a, b) =>
        (severityRank[b.severity] ?? 0) - (severityRank[a.severity] ?? 0)
    )) {
      if (
        f.elementId === null ||
        (f.category !== "messaging_copy" && f.category !== "strategy_alignment")
      ) {
        continue;
      }
      const existing = guidanceByElement.get(f.elementId) ?? "";
      guidanceByElement.set(
        f.elementId,
        existing ? `${existing}\n- ${f.message}` : `- ${f.message}`
      );
    }

    await Promise.all(
      [...guidanceByElement.entries()].map(async ([elementId, guidance]) => {
        const element = elements[elementId];
        const note = architectureNotes[elementId];
        if (!element || !note) return;
        const outcome = await fillElementProps(
          db,
          c.env,
          orgId,
          connectionId,
          strategyBrief,
          element,
          note,
          guidance
        );
        if (outcome.success) {
          elements[elementId] = { ...element, props: outcome.props };
          touchedAnything = true;
        }
      })
    );
  }

  // Structure findings: append only the sections still missing, computed the same way
  // `checkPageStructure` does, rather than parsing that check's message text back apart.
  if (strategyBrief && findings.some((f) => f.category === "page_structure")) {
    const covered = new Set(
      Object.values(architectureNotes).map((n) => n.purpose)
    );
    const missingPurposes = REQUIRED_ARCHITECT_PURPOSES.filter(
      (p) => !covered.has(p)
    );
    if (missingPurposes.length > 0) {
      const system = compileArchitectureFixPrompt({
        strategyBrief,
        catalog: architectCatalogSummary,
        existingComponentIds: rootChildren.map(
          (eid) => elements[eid]?.type ?? ""
        ),
        missingPurposes
      });
      const result = await runModelCompletion(
        db,
        c.env,
        orgId,
        connectionId,
        "generate",
        [
          { role: "system", content: system },
          { role: "user", content: "Đề xuất section còn thiếu." }
        ]
      );
      const parsed = extractJson(result.text, pageArchitectResultSchema);
      const built = buildElementsFromSections(parsed.sections);

      await Promise.all(
        built.elementIds.map(async (elementId) => {
          const element = built.elements[elementId];
          const note = built.architectureNotes[elementId];
          if (!element || !note) return;
          const outcome = await fillElementProps(
            db,
            c.env,
            orgId,
            connectionId,
            strategyBrief,
            element,
            note,
            `Section mới thêm để bù purpose "${note.purpose}" còn thiếu trên trang.`
          );
          if (outcome.success) element.props = outcome.props;
        })
      );

      Object.assign(elements, built.elements);
      Object.assign(architectureNotes, built.architectureNotes);
      rootChildren.push(...built.elementIds);
      touchedAnything = true;
    }
  }

  if (!touchedAnything) return null;

  elements[doc.pageSpec.root] = {
    ...elements[doc.pageSpec.root],
    type: elements[doc.pageSpec.root]?.type ?? "page_root",
    props: elements[doc.pageSpec.root]?.props ?? {},
    children: rootChildren
  };

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const version = await insertVersionAndActivate(db, orgId, id, seq, {
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      ...doc,
      pageSpec: { ...doc.pageSpec, elements },
      architectureNotes
    }
  });
  await syncEventDefinitions(db, orgId, id, version.id, elements, rootChildren);
  return version.id;
}

// `roadmap.md` §Self-critique loop: "1 trang AI tạo tự động giảm finding critical về 0 qua tối
// đa N vòng lặp không cần thao tác tay." Stop conditions exactly match `agent-pipeline.md`
// §Stop conditions: launch threshold reached, 2 consecutive small-delta rounds (plateau), or
// `AUTO_FIX_MAX_ITERATIONS` reached.
auditRoutes.post("/:id/auto-fix", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);
  if (!landingPage.currentVersionId)
    throw new ApiError(409, "no_version_to_audit");

  const strategyBriefRow = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  const strategyBrief = strategyBriefRow
    ? strategyBriefSchema.parse(strategyBriefRow)
    : null;
  const connectionId = await resolveGenerateConnectionId(db, orgId);

  let currentVersionId = landingPage.currentVersionId;
  let previousScore: number | null = null;
  let smallDeltaStreak = 0;
  let iterations = 0;
  let stopReason: z.infer<typeof autoFixResultSchema>["stopReason"] =
    "max_iterations";
  let audit: z.infer<typeof auditResultSchema> | null = null;

  for (let i = 1; i <= AUTO_FIX_MAX_ITERATIONS; i++) {
    iterations = i;
    // oxlint-disable-next-line no-await-in-loop -- each round depends on the previous round's fixed version, must run sequentially
    const version = await pageVersionsRepository.findById(
      db,
      orgId,
      currentVersionId
    );
    if (!version?.spec) throw new ApiError(409, "no_version_to_audit");

    // oxlint-disable-next-line no-await-in-loop -- audits the version just fetched above, not parallelizable across rounds
    audit = await runQualityAudit(c, db, orgId, id, landingPage, version);

    if (passesLaunchThreshold(audit).ok) {
      stopReason = "threshold";
      break;
    }
    if (previousScore !== null) {
      const delta = Math.abs(audit.overallScore - previousScore);
      smallDeltaStreak =
        delta < AUTO_FIX_PLATEAU_DELTA ? smallDeltaStreak + 1 : 0;
      if (smallDeltaStreak >= AUTO_FIX_PLATEAU_STREAK) {
        stopReason = "plateau";
        break;
      }
    }
    previousScore = audit.overallScore;

    if (i === AUTO_FIX_MAX_ITERATIONS) {
      stopReason = "max_iterations";
      break;
    }

    const doc = nativePageDocumentSchema.parse(version.spec);
    // oxlint-disable-next-line no-await-in-loop -- produces next round's currentVersionId, must complete before the next iteration starts
    const nextVersionId = await applyAutoFixRound(
      c,
      db,
      orgId,
      id,
      connectionId,
      strategyBrief,
      doc,
      audit.findings
    );
    if (!nextVersionId) {
      stopReason = "no_actionable_findings";
      break;
    }
    currentVersionId = nextVersionId;
  }

  if (!audit) throw new ApiError(500, "audit_run_create_failed");
  return c.json(autoFixResultSchema.parse({ iterations, stopReason, audit }));
});

// `tracking-and-attribution.md` §Event registry — the "tracking plan" is just this landing
// page's current `eventDefinitions` snapshot (`syncEventDefinitions`, kept in sync by
// `/architecture` and the Auto Fixer); no separate `trackingPlans` table duplicates it.
auditRoutes.get("/:id/tracking-plan", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const rows = await eventDefinitionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  return c.json({
    eventDefinitions: rows.map((row) => eventDefinitionSchema.parse(row))
  });
});
