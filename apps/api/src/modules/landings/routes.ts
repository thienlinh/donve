import {
  auditCategoryValues,
  auditResultSchema,
  auditSeveritySchema,
  autoFixResultSchema,
  businessProfileSchema,
  computeCategoryScore,
  computeOverallScore,
  convertToNativeResultSchema,
  customChatApplyInputSchema,
  customChatApplyResultSchema,
  customChatProposeInputSchema,
  customChatProposeResultSchema,
  customPageBundleSchema,
  deploymentSchema,
  eventDefinitionSchema,
  generateBusinessProfileInputSchema,
  generateLandingPageInputSchema,
  generateOptimizationHypothesesResultSchema,
  importCustomPageResponseSchema,
  landingPageDetailSchema,
  landingPageListItemSchema,
  landingPageSchema,
  nativePageDocumentSchema,
  optimizationHypothesisSchema,
  orgSettingsSchema,
  pageAssetSchema,
  pageVersionSchema,
  passesLaunchThreshold,
  publishLandingPageInputSchema,
  reviewOptimizationHypothesisInputSchema,
  strategyBriefSchema,
  templateSchema,
  updateBusinessProfileInputSchema,
  updateLandingPageSpecInputSchema,
  updateStrategyBriefInputSchema,
  wireLeadFormInputSchema,
  type AuditCategory
} from "@dv/contracts";
import {
  auditFindingsRepository,
  auditLogsRepository,
  auditRunsRepository,
  businessProfilesRepository,
  campaignsRepository,
  chatMessagesRepository,
  customPageBundlesRepository,
  deploymentsRepository,
  eventDefinitionsRepository,
  eventsRepository,
  landingPagesRepository,
  optimizationHypothesesRepository,
  organizationsRepository,
  pageAssetsRepository,
  pageVersionsRepository,
  skillsRepository,
  strategyBriefsRepository,
  templatesRepository
} from "@dv/db";
import {
  compileArchitectureFixPrompt,
  compileClassifySectionsPrompt,
  compileContentAgentPrompt,
  compileCustomImportChatPrompt,
  compileExtractContentPrompt,
  compileGeneratePrompt,
  compileOptimizationPrompt,
  compilePageArchitectPrompt,
  compileQualityCriticPrompt,
  compileResearchPrompt,
  compileStrategyPrompt
} from "@dv/studio-ai";
import {
  architectCatalogSummary,
  catalogComponents,
  componentMetaById,
  componentMetadata,
  DEFAULT_DESIGN_TOKENS
} from "@dv/studio-catalog";
import {
  detectFunnelGaps,
  InvalidGeneratedHtmlError,
  srcmapToJson,
  stampSrcmap
} from "@dv/studio-core";
import { sanitizeLandingHtml } from "@dv/studio-core/sanitize";
import { renderPageArtifact } from "@dv/studio-render";
import type { Spec } from "@json-render/core";
import { Hono, type Context } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "../../lib/ai-gateway.js";
import {
  applyCustomChatEdits,
  detectImportForms,
  splitIntoSections,
  wireLeadForm
} from "../../lib/custom-import.js";
import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { syncEventDefinitions } from "../../lib/event-definitions.js";
import {
  ALLOWED_IMAGE_MIME,
  ALLOWED_VIDEO_MIME,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES
} from "../../lib/image-upload.js";
import { extractInlineImportAssets } from "../../lib/import-assets.js";
import { resolveImportPayload } from "../../lib/import-payload.js";
import { runLighthouseSandbox } from "../../lib/lighthouse-sandbox.js";
import { log } from "../../lib/logger.js";
import { requireSrcmapVersion } from "../../lib/page-version-guards.js";
import {
  previewLandingPage,
  publishLandingPage,
  rollbackDeployment,
  unpublishLandingPage
} from "../../lib/publish.js";
import {
  checkPageStructure,
  checkSeo,
  checkTokenConsistency,
  checkTrackingCompleteness,
  type RawFinding
} from "../../lib/quality-audit.js";
import { readCappedBytes, safeFetch } from "../../lib/safe-fetch.js";
import { restoreSensitiveProps } from "../../lib/sensitive-props.js";
import { createStorageFromEnv } from "../../lib/storage.js";
import { requireChatSessionId } from "../../lib/studio-chat.js";
import type { AppEnv, Bindings } from "../../types.js";

export const landingsRoutes = new Hono<AppEnv>();

// `Variables.orgId` is nullable app-wide (platform routes never set it) but `requireOrgSession`
// guarantees it here — every handler in this module runs behind that middleware (app.ts).
function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

landingsRoutes.get("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const [rows, deployments, campaigns] = await Promise.all([
    landingPagesRepository.list(db, orgId),
    deploymentsRepository.list(db, orgId),
    campaignsRepository.list(db, orgId)
  ]);

  const liveHostnameByLandingPageId = new Map(
    deployments
      .filter((deployment) => deployment.status === "live")
      .map((deployment) => [deployment.landingPageId, deployment.hostname])
  );
  const campaignNameById = new Map(
    campaigns.map((campaign) => [campaign.id, campaign.name])
  );
  // `source: "ai"` covers both the legacy srcmap `/generate` flow and the native-AI wizard —
  // only the current version's `spec` presence tells them apart (routes.gallery card routing).
  const currentVersions = await Promise.all(
    rows
      .filter((row) => !row.deletedAt && row.currentVersionId)
      .map((row) =>
        pageVersionsRepository.findById(db, orgId, row.currentVersionId!)
      )
  );
  const isNativeByLandingPageId = new Map(
    currentVersions
      .filter((v) => v !== undefined)
      .map((v) => [v.landingPageId, v.spec !== null])
  );

  const landingPages = rows
    .filter((row) => !row.deletedAt)
    .map((row) => {
      const liveHostname = liveHostnameByLandingPageId.get(row.id) ?? null;
      return {
        ...row,
        isPublished: liveHostname !== null,
        liveHostname,
        isNative: isNativeByLandingPageId.get(row.id) ?? false,
        campaignName: row.campaignId
          ? (campaignNameById.get(row.campaignId) ?? null)
          : null
      };
    });

  return c.json({
    landingPages: z.array(landingPageListItemSchema).parse(landingPages)
  });
});

const createLandingPageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  campaignId: z.string().nullish()
});

landingsRoutes.post("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createLandingPageSchema.parse(await c.req.json());

  // Phase 1 (FR-B-00c): create the empty record only. Studio's route opens immediately in
  // "pending" state (no currentVersionId yet) — real AI generation lands in Phase 2 (FR-B-21).
  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name: body.name,
    campaignId: body.campaignId ?? null,
    source: "ai"
  });

  return c.json(landingPageSchema.parse(landingPage), 201);
});

const createManualLandingPageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  campaignId: z.string().nullish(),
  // Optional starting point from `templates` (FR — "create landing page" template picker) —
  // clones its pageSpec/tokens/seo/architectureNotes into this page's first version instead of
  // the empty canvas below. Not required: manual creation still defaults to a blank page.
  templateId: z.string().nullish()
});

/** `GET /api/landings/templates` — list, not org-scoped (`templates` has no `org_id`, see
 * `packages/db/src/schema/templates.ts`) — every org sees the same shared gallery. */
landingsRoutes.get("/templates", async (c) => {
  const db = createDbFromEnv(c.env);
  const templates = await templatesRepository.list(db);
  return c.json({ templates: z.array(templateSchema).parse(templates) });
});

const saveAsTemplateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  industry: z.string().trim().min(1).max(60),
  // The Studio's own in-memory doc (may include edits not yet landed via `PATCH .../spec`) —
  // "save as template" should capture what's actually on screen, not silently fall back to a
  // stale server version just because the user hasn't clicked Save yet. Falls back to the
  // server's current version below only when omitted (e.g. a future non-editor caller).
  document: nativePageDocumentSchema.optional()
});

/** Promotes a native page (current in-editor content, or its last-saved version if the caller
 * doesn't supply one) into the shared `templates` gallery — the intended source of new
 * templates is a page already brought to quality through the real Studio/AI pipeline (Page
 * Architect → Content Agent → Auto Fixer), not a separate offline generator, so this just
 * clones what's already there rather than re-deriving it. Legacy (srcmap, `spec` null) pages
 * with no saved version at all have nothing to clone from — 409, same as the audit/publish gates. */
landingsRoutes.post("/:id/save-as-template", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = saveAsTemplateSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, id);

  let doc = body.document;
  if (!doc) {
    if (!landingPage.currentVersionId) {
      throw new ApiError(409, "no_current_version");
    }
    const version = await pageVersionsRepository.findById(
      db,
      orgId,
      landingPage.currentVersionId
    );
    if (!version?.spec) throw new ApiError(409, "not_a_native_page");
    doc = nativePageDocumentSchema.parse(version.spec);
  }

  const template = await templatesRepository.insert(db, {
    name: body.name,
    industry: body.industry,
    thumbnailKey: landingPage.thumbnailKey,
    pageSpec: doc.pageSpec,
    tokens: doc.tokens,
    seo: doc.seo ?? null,
    architectureNotes: doc.architectureNotes ?? null
  });
  if (!template) throw new ApiError(500, "template_create_failed");

  return c.json(templateSchema.parse(template), 201);
});

// `technical/ui-ux-design.md` §"Chọn chế độ tạo": thủ công đi thẳng vào Studio với canvas gần
// như trống (chỉ root, chưa có section nào) — không cần AI, không qua wizard business/strategy.
// (Or, with `templateId` set, straight into Studio with the template's content already filled in.)
landingsRoutes.post("/manual", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createManualLandingPageSchema.parse(await c.req.json());

  const template = body.templateId
    ? await templatesRepository.findById(db, body.templateId)
    : null;
  if (body.templateId && !template) {
    throw new ApiError(404, "template_not_found");
  }

  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name: body.name,
    campaignId: body.campaignId ?? null,
    source: "manual"
  });
  if (!landingPage) throw new ApiError(500, "landing_page_create_failed");

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq: 1,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: template
      ? {
          pageSpec: template.pageSpec,
          tokens: template.tokens,
          seo: template.seo ?? undefined,
          architectureNotes: template.architectureNotes ?? undefined
        }
      : {
          pageSpec: {
            root: "page-root",
            elements: {
              "page-root": { type: "page_root", props: {}, children: [] }
            }
          },
          tokens: DEFAULT_DESIGN_TOKENS
        }
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  const updated = await landingPagesRepository.update(
    db,
    orgId,
    landingPage.id,
    {
      currentVersionId: version.id
    }
  );
  if (!updated) throw new ApiError(500, "landing_page_create_failed");

  return c.json(
    landingPageDetailSchema.parse({ ...updated, currentVersion: version }),
    201
  );
});

const updateSpecSchema = updateLandingPageSpecInputSchema;

// PATCH, not POST /versions — a native page's edit history is content diffs on 1 evolving
// spec (autosave-style), not discrete "restore points" the way the legacy srcmap flow's
// comment-mode/inline-edit versions are. Still lands as a new `pageVersions` row (seq+1) for
// the same audit-trail/rollback reasons.
landingsRoutes.patch("/:id/spec", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateSpecSchema.parse(await c.req.json());

  const landingPage = await landingPagesRepository.findById(db, orgId, id);
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }
  if (landingPage.source === "import") {
    throw new ApiError(409, "custom_import_has_no_spec");
  }

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: body
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: version.id
  });

  return c.json(pageVersionSchema.parse(version), 201);
});

// --- Business Intelligence + Strategy (ai/agent-pipeline.md §Agent roles: Research, Strategy) ---

const RESEARCH_FETCH_MAX_BYTES = 500 * 1024;

function stripHtmlToText(html: string): string {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Model output should be pure JSON per the prompt, but defensively strip a markdown fence in
 * case it wraps the object in one anyway (same defensive move as `extractHtml` above). */
function extractJson<T>(text: string, schema: z.ZodType<T>): T {
  const trimmed = text.trim();
  const fenced = /^```(?:json)?\n([\s\S]*?)\n```$/.exec(trimmed);
  const raw = fenced?.[1] ? fenced[1].trim() : trimmed;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ApiError(
      422,
      "model_output_invalid",
      "Model did not return valid JSON"
    );
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new ApiError(422, "model_output_invalid", result.error.message);
  }
  return result.data;
}

landingsRoutes.get("/:id/business", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

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
landingsRoutes.post("/:id/business", async (c) => {
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

landingsRoutes.patch("/:id/business", async (c) => {
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

landingsRoutes.get("/:id/strategy", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const brief = await strategyBriefsRepository.findByLandingPage(db, orgId, id);
  if (!brief) throw new ApiError(404, "strategy_brief_not_found");
  return c.json(strategyBriefSchema.parse(brief));
});

// Strategy Agent — requires a Business Knowledge Graph first (page-architect.md §agent roles:
// Strategy Agent's input IS the graph, not the raw brief).
landingsRoutes.post("/:id/strategy", async (c) => {
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

landingsRoutes.patch("/:id/strategy", async (c) => {
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
landingsRoutes.post("/:id/strategy/confirm", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

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

// --- Page Architect + Content Agent (ai/agent-pipeline.md §Agent roles) ---

const pageArchitectSectionSchema = z.object({
  componentId: z.string(),
  variant: z.string(),
  purpose: z.enum([
    "understanding",
    "desire",
    "proof",
    "risk_reduction",
    "action"
  ]),
  reason: z.string()
});
const pageArchitectResultSchema = z.object({
  sections: z.array(pageArchitectSectionSchema).min(1)
});

type ArchitectElement = {
  type: string;
  props: Record<string, unknown>;
  children: string[];
};
type ArchitectureNote = { purpose: string; reason: string };

/** Shared by `/architecture` (full page) and the Auto Fixer's structure-finding branch
 * (append-only) — validates each proposed section against the real catalog before it's allowed
 * to land as an element. */
function buildElementsFromSections(
  sections: z.infer<typeof pageArchitectSectionSchema>[]
): {
  elements: Record<string, ArchitectElement>;
  architectureNotes: Record<string, ArchitectureNote>;
  elementIds: string[];
} {
  const knownIds = new Set(componentMetadata.map((m) => m.componentId));
  const elements: Record<string, ArchitectElement> = {};
  const architectureNotes: Record<string, ArchitectureNote> = {};
  const elementIds: string[] = [];

  for (const section of sections) {
    if (!knownIds.has(section.componentId)) {
      throw new ApiError(
        422,
        "model_output_invalid",
        `Unknown componentId: ${section.componentId}`
      );
    }
    const meta = componentMetaById.get(section.componentId);
    if (
      meta &&
      meta.variants.length > 0 &&
      !meta.variants.includes(section.variant)
    ) {
      throw new ApiError(
        422,
        "model_output_invalid",
        `Unknown variant "${section.variant}" for ${section.componentId}`
      );
    }
    const elementId = `${section.componentId}-${crypto.randomUUID().slice(0, 8)}`;
    elements[elementId] = {
      type: section.componentId,
      props:
        meta && meta.variants.length > 0 ? { variant: section.variant } : {},
      children: []
    };
    architectureNotes[elementId] = {
      purpose: section.purpose,
      reason: section.reason
    };
    elementIds.push(elementId);
  }
  return { elements, architectureNotes, elementIds };
}

// Page Architect — requires a *confirmed* Strategy Brief (`strategy-brief.md` §Xác nhận).
// Seeds each element's props with only `variant` (the one prop field the flat `PageSpec`
// model has no separate slot for — page-schema.md's `PageElement` has no `variant` field of
// its own) — everything else stays for Content Agent to fill next.
landingsRoutes.post("/:id/architecture", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const strategyBriefRow = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!strategyBriefRow) throw new ApiError(409, "strategy_brief_required");
  if (!strategyBriefRow.confirmedAt) {
    throw new ApiError(409, "strategy_brief_not_confirmed");
  }
  const strategyBrief = strategyBriefSchema.parse(strategyBriefRow);

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const system = compilePageArchitectPrompt({
    strategyBrief,
    catalog: architectCatalogSummary
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
        content: "Đề xuất kiến trúc trang từ Strategy Brief ở trên."
      }
    ]
  );
  const parsed = extractJson(result.text, pageArchitectResultSchema);

  const {
    elements,
    architectureNotes,
    elementIds: rootChildren
  } = buildElementsFromSections(parsed.sections);
  elements["page-root"] = {
    type: "page_root",
    props: {},
    children: rootChildren
  };

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      pageSpec: { root: "page-root", elements },
      tokens: DEFAULT_DESIGN_TOKENS,
      architectureNotes
    }
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");
  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: version.id
  });
  await syncEventDefinitions(db, orgId, id, version.id, elements, rootChildren);

  return c.json(pageVersionSchema.parse(version), 201);
});

/** Shared by `/content-fill` (fresh element, `fixGuidance` unset) and the Auto Fixer's
 * content-finding branch (`fixGuidance` = the finding's own message). Restores any
 * `sensitiveProps` path to its pre-call value regardless of what the model returned
 * (`ai/agent-pipeline.md` §Guardrails — no `humanApproved` flow exists yet, so a model can never
 * legitimately change a sensitive field through this path). Schema mismatches come back as a
 * soft failure so a caller can choose to hard-fail (`/content-fill`) or skip-and-continue
 * (Auto Fixer, mid-loop). */
async function fillElementProps(
  db: ReturnType<typeof createDbFromEnv>,
  env: Bindings,
  orgId: string,
  connectionId: string,
  strategyBrief: z.infer<typeof strategyBriefSchema>,
  element: { type: string; props: Record<string, unknown> },
  note: { purpose: string; reason: string },
  fixGuidance?: string
): Promise<
  | { success: true; props: Record<string, unknown> }
  | { success: false; error: string }
> {
  const componentEntry = catalogComponents[element.type];
  if (!componentEntry) {
    return { success: false, error: `Unknown component type: ${element.type}` };
  }
  const currentProps = element.props as { variant?: string };
  const system = compileContentAgentPrompt({
    componentId: element.type,
    variant: currentProps.variant ?? "",
    purpose: note.purpose,
    reason: note.reason,
    strategyBrief,
    propsJsonSchema: componentEntry.props.toJSONSchema(),
    fixGuidance
  });
  const result = await runModelCompletion(
    db,
    env,
    orgId,
    connectionId,
    "patch",
    [
      { role: "system", content: system },
      { role: "user", content: `Điền props cho ${element.type}.` }
    ]
  );
  const rawProps = extractJson(result.text, z.record(z.string(), z.unknown()));
  const validated = componentEntry.props.safeParse(rawProps);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error?.message ?? "schema mismatch"
    };
  }
  const meta = componentMetaById.get(element.type);
  const props =
    meta && meta.sensitiveProps.length > 0
      ? restoreSensitiveProps(
          validated.data as Record<string, unknown>,
          element.props,
          meta.sensitiveProps
        )
      : (validated.data as Record<string, unknown>);
  return { success: true, props };
}

// Content Agent — runs once per element, in parallel (ai/agent-pipeline.md §Model routing:
// "Content Agent: model nhỏ đủ dùng"). Requires an ARCHITECTED version (has `architectureNotes`)
// already on `currentVersionId`.
landingsRoutes.post("/:id/content-fill", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);
  if (!landingPage.currentVersionId)
    throw new ApiError(409, "architecture_required");

  const currentVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!currentVersion?.spec) throw new ApiError(409, "architecture_required");
  const doc = nativePageDocumentSchema.parse(currentVersion.spec);
  if (!doc.architectureNotes) throw new ApiError(409, "architecture_required");

  const strategyBriefRow = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!strategyBriefRow) throw new ApiError(409, "strategy_brief_required");
  const strategyBrief = strategyBriefSchema.parse(strategyBriefRow);

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const rootElement = doc.pageSpec.elements[doc.pageSpec.root];
  const elementIds = rootElement?.children ?? [];

  const filled = await Promise.all(
    elementIds.map(async (elementId) => {
      const element = doc.pageSpec.elements[elementId];
      const note = doc.architectureNotes?.[elementId];
      if (!element || !note) return null;

      const outcome = await fillElementProps(
        db,
        c.env,
        orgId,
        connectionId,
        strategyBrief,
        element,
        note
      );
      if (!outcome.success) {
        throw new ApiError(
          422,
          "model_output_invalid",
          `${elementId}: ${outcome.error}`
        );
      }
      return [elementId, outcome.props] as const;
    })
  );

  const newElements = { ...doc.pageSpec.elements };
  for (const entry of filled) {
    if (!entry) continue;
    const [elementId, props] = entry;
    const existingElement = newElements[elementId];
    if (existingElement) newElements[elementId] = { ...existingElement, props };
  }

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      ...doc,
      pageSpec: { ...doc.pageSpec, elements: newElements }
    }
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");
  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: version.id
  });

  return c.json(pageVersionSchema.parse(version), 201);
});

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

landingsRoutes.post("/:id/audit", async (c) => {
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

landingsRoutes.get("/:id/audit", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

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
  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
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
  if (!version) throw new ApiError(500, "page_version_create_failed");
  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: version.id
  });
  await syncEventDefinitions(db, orgId, id, version.id, elements, rootChildren);
  return version.id;
}

// `roadmap.md` §Self-critique loop: "1 trang AI tạo tự động giảm finding critical về 0 qua tối
// đa N vòng lặp không cần thao tác tay." Stop conditions exactly match `agent-pipeline.md`
// §Stop conditions: launch threshold reached, 2 consecutive small-delta rounds (plateau), or
// `AUTO_FIX_MAX_ITERATIONS` reached.
landingsRoutes.post("/:id/auto-fix", async (c) => {
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
    const version = await pageVersionsRepository.findById(
      db,
      orgId,
      currentVersionId
    );
    if (!version?.spec) throw new ApiError(409, "no_version_to_audit");

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
landingsRoutes.get("/:id/tracking-plan", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const rows = await eventDefinitionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  return c.json({
    eventDefinitions: rows.map((row) => eventDefinitionSchema.parse(row))
  });
});

// --- Optimization Loop (`product/vision.md` §Optimization Loop, `ai/agent-pipeline.md` §Agent
// roles: "Input: Analytics + Quality history. Output: Ranked hypothesis, không tự publish") ---

const OPTIMIZATION_LOOKBACK_DAYS = 30;
const OPTIMIZATION_AUDIT_HISTORY_LIMIT = 5;

landingsRoutes.post("/:id/optimization", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

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

landingsRoutes.get("/:id/optimization", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const rows = await optimizationHypothesesRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  return c.json(rows.map((row) => optimizationHypothesisSchema.parse(row)));
});

// Approval only — "không tự publish", so this never touches `pageVersions`/publish state,
// just records what a human decided about the hypothesis for whoever acts on it manually.
landingsRoutes.patch("/:id/optimization/:hypothesisId", async (c) => {
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

// --- Custom Import (`page-system/custom-import.md`) — raw HTML+asset pages, no Component
// Library, no srcmap patch editor. The srcmap-editable `/import` mode that used to live here
// has been retired in favor of this one (`roadmap.md` §Migration dữ liệu cũ folds any
// pre-existing page still in that shape into `custom_import` too, via
// `runLegacyImportMigration`) — sanitize-only (no `stampSrcmap`), `source: "custom_import"`,
// tracked in `customPageBundles`. ---

async function requireCustomImportVersion(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPageId: string
) {
  const landingPage = await requireLandingPage(db, orgId, landingPageId);
  if (landingPage.source !== "custom_import") {
    throw new ApiError(409, "not_a_custom_import_page");
  }
  if (!landingPage.currentVersionId) {
    throw new ApiError(409, "no_version_to_edit");
  }
  const version = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!version?.htmlKey) throw new ApiError(409, "no_version_to_edit");
  return { landingPage, version };
}

landingsRoutes.post("/import-custom", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const form = await c.req.formData();
  const { rawHtml, zipAssets, sourceKind } = await resolveImportPayload(form);

  let html: string;
  try {
    html = sanitizeLandingHtml(rawHtml);
  } catch (err) {
    if (err instanceof InvalidGeneratedHtmlError) {
      throw new ApiError(422, "import_html_invalid", err.message);
    }
    throw err;
  }

  const rawName = form.get("name");
  const name =
    typeof rawName === "string" && rawName.trim()
      ? rawName.trim()
      : "Imported page";

  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name,
    campaignId: null,
    source: "custom_import"
  });
  if (!landingPage) throw new ApiError(500, "landing_page_create_failed");

  const { html: finalHtml } = await extractInlineImportAssets(
    db,
    c.env,
    orgId,
    landingPage.id,
    html,
    zipAssets
  );

  const storage = createStorageFromEnv(c.env);
  const seq = 1;
  const htmlKey = `landing-pages/${landingPage.id}/v${seq}/index.html`;
  await storage.put({
    key: htmlKey,
    body: finalHtml,
    contentType: "text/html"
  });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq,
    htmlKey,
    srcmapKey: null,
    origin: "import",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  const updated = await landingPagesRepository.update(
    db,
    orgId,
    landingPage.id,
    { currentVersionId: version.id }
  );
  if (!updated) throw new ApiError(500, "landing_page_create_failed");

  const detectedForms = detectImportForms(finalHtml);
  await customPageBundlesRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    sourceKind,
    detectedForms: detectedForms.map((f) => ({
      selector: f.selector,
      wired: false
    }))
  });

  return c.json(
    importCustomPageResponseSchema.parse({
      ...updated,
      currentVersion: version,
      funnelGaps: detectFunnelGaps(finalHtml),
      detectedForms
    }),
    201
  );
});

landingsRoutes.get("/:id/custom-html", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const { version } = await requireCustomImportVersion(db, orgId, id);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(version.htmlKey as string);
  if (!object) throw new ApiError(404, "html_not_found");
  return new Response(object.body, {
    headers: { "content-type": object.contentType ?? "text/html" }
  });
});

landingsRoutes.get("/:id/custom-import", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const bundle = await customPageBundlesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!bundle) throw new ApiError(404, "custom_page_bundle_not_found");
  return c.json(customPageBundleSchema.parse(bundle));
});

landingsRoutes.post("/:id/wire-lead-form", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = wireLeadFormInputSchema.parse(await c.req.json());
  const { version } = await requireCustomImportVersion(db, orgId, id);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(version.htmlKey as string);
  if (!object) throw new ApiError(404, "html_not_found");
  const currentHtml = await new Response(object.body).text();

  const wiredHtml = wireLeadForm(currentHtml, body.selector, body.fieldMapping);

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const htmlKey = `landing-pages/${id}/v${seq}/index.html`;
  await storage.put({
    key: htmlKey,
    body: wiredHtml,
    contentType: "text/html"
  });

  const newVersion = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    htmlKey,
    srcmapKey: null,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: "wire-lead-form",
    createdBy: c.get("userId") ?? null
  });
  if (!newVersion) throw new ApiError(500, "page_version_create_failed");
  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: newVersion.id
  });

  const bundle = await customPageBundlesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (bundle) {
    await customPageBundlesRepository.update(db, orgId, bundle.id, {
      detectedForms: (
        bundle.detectedForms as { selector: string; wired: boolean }[]
      ).map((f) => (f.selector === body.selector ? { ...f, wired: true } : f))
    });
  }

  return c.json(pageVersionSchema.parse(newVersion), 201);
});

landingsRoutes.post("/:id/reupload-custom", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireCustomImportVersion(db, orgId, id);
  const form = await c.req.formData();
  const { rawHtml, zipAssets, sourceKind } = await resolveImportPayload(form);

  let html: string;
  try {
    html = sanitizeLandingHtml(rawHtml);
  } catch (err) {
    if (err instanceof InvalidGeneratedHtmlError) {
      throw new ApiError(422, "import_html_invalid", err.message);
    }
    throw err;
  }

  const { html: finalHtml } = await extractInlineImportAssets(
    db,
    c.env,
    orgId,
    id,
    html,
    zipAssets
  );

  const storage = createStorageFromEnv(c.env);
  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const htmlKey = `landing-pages/${id}/v${seq}/index.html`;
  await storage.put({
    key: htmlKey,
    body: finalHtml,
    contentType: "text/html"
  });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    htmlKey,
    srcmapKey: null,
    origin: "import",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");
  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: version.id
  });

  const detectedForms = detectImportForms(finalHtml);
  const bundle = await customPageBundlesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (bundle) {
    await customPageBundlesRepository.update(db, orgId, bundle.id, {
      sourceKind,
      detectedForms: detectedForms.map((f) => ({
        selector: f.selector,
        wired: false
      })),
      lastReuploadedAt: new Date()
    });
  }

  return c.json(
    importCustomPageResponseSchema.parse({
      ...(await landingPagesRepository.findById(db, orgId, id)),
      currentVersion: version,
      funnelGaps: detectFunnelGaps(finalHtml),
      detectedForms
    }),
    201
  );
});

// `page-system/custom-import.md` §Editing "Comment mode + AI chat" — dry-run propose, no
// persistence. `POST /:id/custom-chat/apply` (below) re-validates the same edits against
// whatever HTML is current at apply time before landing a new version.
landingsRoutes.post("/:id/custom-chat", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = customChatProposeInputSchema.parse(await c.req.json());
  const { version } = await requireCustomImportVersion(db, orgId, id);

  const storage = createStorageFromEnv(c.env);
  const [object, connectionId] = await Promise.all([
    storage.get(version.htmlKey as string),
    resolveGenerateConnectionId(db, orgId)
  ]);
  if (!object) throw new ApiError(404, "html_not_found");
  const html = await new Response(object.body).text();

  const system = compileCustomImportChatPrompt({ html, message: body.message });
  const result = await runModelCompletion(
    db,
    c.env,
    orgId,
    connectionId,
    "patch",
    [
      { role: "system", content: system },
      { role: "user", content: body.message }
    ]
  );
  const parsed = extractJson(result.text, customChatProposeResultSchema);
  return c.json(parsed);
});

landingsRoutes.post("/:id/custom-chat/apply", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = customChatApplyInputSchema.parse(await c.req.json());
  const { version } = await requireCustomImportVersion(db, orgId, id);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(version.htmlKey as string);
  if (!object) throw new ApiError(404, "html_not_found");
  const currentHtml = await new Response(object.body).text();

  const { html: editedHtml, results } = applyCustomChatEdits(
    currentHtml,
    body.edits
  );
  if (!results.some((r) => r.status === "applied")) {
    return c.json(customChatApplyResultSchema.parse({ version, results }));
  }

  // custom-import.md §Sanitize: "bắt buộc, không có ngoại lệ" — re-run even on an AI-proposed
  // edit, same as every other write path to this HTML.
  let sanitized: string;
  try {
    sanitized = sanitizeLandingHtml(editedHtml);
  } catch (err) {
    if (err instanceof InvalidGeneratedHtmlError) {
      throw new ApiError(422, "import_html_invalid", err.message);
    }
    throw err;
  }

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const htmlKey = `landing-pages/${id}/v${seq}/index.html`;
  await storage.put({
    key: htmlKey,
    body: sanitized,
    contentType: "text/html"
  });
  const newVersion = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    htmlKey,
    srcmapKey: null,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: "ai-chat-edit",
    createdBy: c.get("userId") ?? null
  });
  if (!newVersion) throw new ApiError(500, "page_version_create_failed");
  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: newVersion.id
  });

  return c.json(
    customChatApplyResultSchema.parse({ version: newVersion, results })
  );
});

// `page-system/custom-import.md` §Editing "Convert sang native" — 1-way. Splits the raw HTML
// into sections, classifies each against the real catalog (1 batched call — classification
// benefits from seeing every section together), then extracts content per matched section in
// parallel (Content-Agent-style, narrow/independent). Anything unmatched, or that fails its own
// component's Zod validation after extraction, becomes `raw_html_block` instead of blocking the
// whole conversion or forcing a bad fit.
landingsRoutes.post("/:id/convert-to-native", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const { version } = await requireCustomImportVersion(db, orgId, id);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(version.htmlKey as string);
  if (!object) throw new ApiError(404, "html_not_found");
  const html = await new Response(object.body).text();

  const sections = splitIntoSections(html);
  if (sections.length === 0) throw new ApiError(409, "no_sections_to_convert");

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const classifySystem = compileClassifySectionsPrompt({
    catalog: architectCatalogSummary,
    sections
  });
  const classifyResult = await runModelCompletion(
    db,
    c.env,
    orgId,
    connectionId,
    "generate",
    [
      { role: "system", content: classifySystem },
      { role: "user", content: "Phân loại từng section ở trên." }
    ]
  );
  const classifySchema = z.object({
    sections: z.array(
      z.object({
        index: z.number().int(),
        componentId: z.string().nullable(),
        variant: z.string().nullable(),
        reason: z.string()
      })
    )
  });
  const classified = extractJson(classifyResult.text, classifySchema);
  const classificationByIndex = new Map(
    classified.sections.map((s) => [s.index, s])
  );

  const converted = await Promise.all(
    sections.map(async (section) => {
      const classification = classificationByIndex.get(section.index);
      const componentId = classification?.componentId ?? null;
      const meta = componentId ? componentMetaById.get(componentId) : undefined;
      const variant = classification?.variant ?? undefined;
      const componentEntry = componentId
        ? catalogComponents[componentId]
        : undefined;

      const confidentMatch =
        componentId &&
        meta &&
        componentEntry &&
        (meta.variants.length === 0 ||
          (variant && meta.variants.includes(variant)));

      if (!confidentMatch) {
        return {
          index: section.index,
          elementId: `raw_html_block-${crypto.randomUUID().slice(0, 8)}`,
          element: {
            type: "raw_html_block",
            props: { html: section.html },
            children: [] as string[]
          },
          fallback: true
        };
      }

      const extractSystem = compileExtractContentPrompt({
        componentId,
        variant: variant ?? "",
        sectionHtml: section.html,
        propsJsonSchema: componentEntry.props.toJSONSchema()
      });
      const extractResult = await runModelCompletion(
        db,
        c.env,
        orgId,
        connectionId,
        "patch",
        [
          { role: "system", content: extractSystem },
          {
            role: "user",
            content: `Trích xuất nội dung cho ${componentId}.`
          }
        ]
      );
      const rawProps = extractJson(
        extractResult.text,
        z.record(z.string(), z.unknown())
      );
      const validated = componentEntry.props.safeParse(rawProps);
      const elementId = `${componentId}-${crypto.randomUUID().slice(0, 8)}`;
      if (validated.success) {
        return {
          index: section.index,
          elementId,
          element: {
            type: componentId,
            props: validated.data as Record<string, unknown>,
            children: [] as string[]
          },
          fallback: false
        };
      }
      return {
        index: section.index,
        elementId,
        element: {
          type: "raw_html_block",
          props: { html: section.html },
          children: [] as string[]
        },
        fallback: true
      };
    })
  );
  converted.sort((a, b) => a.index - b.index);

  const elements: Record<
    string,
    { type: string; props: Record<string, unknown>; children: string[] }
  > = {};
  const rootChildren: string[] = [];
  let sectionsConverted = 0;
  let sectionsFallback = 0;
  for (const entry of converted) {
    elements[entry.elementId] = entry.element;
    rootChildren.push(entry.elementId);
    if (entry.fallback) sectionsFallback++;
    else sectionsConverted++;
  }
  elements["page-root"] = {
    type: "page_root",
    props: {},
    children: rootChildren
  };

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const newVersion = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    htmlKey: null,
    srcmapKey: null,
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: "convert-to-native",
    createdBy: c.get("userId") ?? null,
    spec: {
      pageSpec: { root: "page-root", elements },
      tokens: DEFAULT_DESIGN_TOKENS
    }
  });
  if (!newVersion) throw new ApiError(500, "page_version_create_failed");

  const updatedLandingPage = await landingPagesRepository.update(
    db,
    orgId,
    id,
    { currentVersionId: newVersion.id, source: "manual" }
  );
  if (!updatedLandingPage)
    throw new ApiError(500, "landing_page_create_failed");
  await syncEventDefinitions(
    db,
    orgId,
    id,
    newVersion.id,
    elements,
    rootChildren
  );

  return c.json(
    convertToNativeResultSchema.parse({
      landingPage: updatedLandingPage,
      version: newVersion,
      sectionsConverted,
      sectionsFallback
    }),
    201
  );
});

// `page-system/custom-import.md` §Quality Audit — "Chỉ DOM-rule audit... Không có: strategy
// alignment, structure purpose-check, visual regression, token consistency." Reuses the exact
// same `checkSeo`/Lighthouse/`auditRuns`/`auditFindings` infra the native audit uses, just a
// narrower category set and its own (non-weighted) overall score — `computeOverallScore`'s
// uniform formula assumes every category applies, which isn't true here.
landingsRoutes.post("/:id/custom-audit", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const { version } = await requireCustomImportVersion(db, orgId, id);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(version.htmlKey as string);
  if (!object) throw new ApiError(404, "html_not_found");
  const html = await new Response(object.body).text();

  const findings: RawFinding[] = [...checkSeo(html)];
  const lighthouse = await runLighthouseSandbox(c.env, html);
  if (lighthouse?.performance == null) {
    findings.push({
      category: "performance",
      severity: "low",
      message:
        "Không đo được Performance (cần runtime Bun/VPS để chạy Lighthouse sandbox).",
      elementId: null
    });
  }
  findings.push({
    category: "visual_regression",
    severity: "low",
    message: "Custom import không có tầng visual regression.",
    elementId: null
  });

  const categoryScores: Partial<Record<AuditCategory, number>> = {
    seo: computeCategoryScore(findings.filter((f) => f.category === "seo"))
  };
  if (lighthouse?.performance != null) {
    categoryScores.performance = lighthouse.performance;
  }
  const applicableScores = Object.values(categoryScores).filter(
    (s): s is number => s !== undefined
  );
  const overallScore = Math.round(
    applicableScores.reduce((sum, s) => sum + s, 0) / applicableScores.length
  );

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

  return c.json(
    auditResultSchema.parse({ ...auditRun, findings: findingRows }),
    201
  );
});

landingsRoutes.get("/:id/custom-audit", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

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

const updateLandingPageSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  campaignId: z.string().nullable().optional()
});

landingsRoutes.patch("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = updateLandingPageSchema.parse(await c.req.json());

  const existing = await landingPagesRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }

  const landingPage = await landingPagesRepository.update(db, orgId, id, body);
  return c.json(landingPageSchema.parse(landingPage));
});

landingsRoutes.delete("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const existing = await landingPagesRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }

  await landingPagesRepository.update(db, orgId, id, {
    deletedAt: new Date()
  });
  return c.json({ ok: true });
});

landingsRoutes.post("/:id/duplicate", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const existing = await landingPagesRepository.findById(db, orgId, id);
  if (!existing || existing.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }

  // ponytail: shares the current version/thumbnail rather than deep-copying page_versions +
  // R2 assets — good enough for a P1 "duplicate" convenience action. The first edit in Studio
  // creates a fresh version scoped to the new landingPageId, same as any other edit.
  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name: `${existing.name} (copy)`,
    campaignId: existing.campaignId,
    currentVersionId: existing.currentVersionId,
    thumbnailKey: existing.thumbnailKey,
    source: existing.source
  });

  return c.json(landingPageSchema.parse(landingPage), 201);
});

landingsRoutes.get("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const landingPage = await landingPagesRepository.findById(db, orgId, id);
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }

  const currentVersion = landingPage.currentVersionId
    ? ((await pageVersionsRepository.findById(
        db,
        orgId,
        landingPage.currentVersionId
      )) ?? null)
    : null;

  return c.json(
    landingPageDetailSchema.parse({ ...landingPage, currentVersion })
  );
});

landingsRoutes.get("/:id/html", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const landingPage = await landingPagesRepository.findById(db, orgId, id);
  if (!landingPage || landingPage.deletedAt || !landingPage.currentVersionId) {
    throw new ApiError(404, "landing_page_not_found");
  }

  const foundVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!foundVersion || foundVersion.prunedAt) {
    throw new ApiError(404, "page_version_not_found");
  }
  const currentVersion = requireSrcmapVersion(foundVersion);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(currentVersion.htmlKey);
  if (!object) throw new ApiError(404, "html_not_found");

  return new Response(object.body, {
    headers: { "content-type": object.contentType ?? "text/html" }
  });
});

const createManualVersionSchema = z.object({
  html: z.string().min(1),
  patch: z.unknown()
});

// studio-builder-spec.md §5 (FR-B-10): Edit-mode inspector/inline-text commits debounce
// 800ms client-side, then land here as one `manual` pageVersion. `srcmapKey` carries over
// unchanged — `data-cc-id` ids live inline in the HTML itself, so no separate srcmap
// artifact needs regenerating for a manual edit.
landingsRoutes.post("/:id/versions", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = createManualVersionSchema.parse(await c.req.json());

  const landingPage = await landingPagesRepository.findById(db, orgId, id);
  if (!landingPage || landingPage.deletedAt || !landingPage.currentVersionId) {
    throw new ApiError(404, "landing_page_not_found");
  }

  const foundVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!foundVersion) throw new ApiError(404, "page_version_not_found");
  const currentVersion = requireSrcmapVersion(foundVersion);

  const storage = createStorageFromEnv(c.env);
  const seq = currentVersion.seq + 1;
  const htmlKey = `landing-pages/${id}/v${seq}/index.html`;
  await storage.put({
    key: htmlKey,
    body: body.html,
    contentType: "text/html"
  });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    htmlKey,
    srcmapKey: currentVersion.srcmapKey,
    origin: "manual",
    patch: body.patch,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  await landingPagesRepository.update(db, orgId, id, {
    currentVersionId: version.id
  });

  return c.json(pageVersionSchema.parse(version), 201);
});

async function requireLandingPage(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  id: string
) {
  const landingPage = await landingPagesRepository.findById(db, orgId, id);
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }
  return landingPage;
}

/** Model output should be raw HTML per the generate prompt, but defensively strip a markdown
 * fence in case it wraps the document in one anyway. */
function extractHtml(text: string): string {
  const trimmed = text.trim();
  const fenced = /^```(?:html)?\n([\s\S]*?)\n```$/.exec(trimmed);
  return fenced?.[1] ? fenced[1].trim() : trimmed;
}

const NEED_IMAGE_ATTR = "data-cc-need-image";

/** Finds every `data-cc-need-image="..."` placeholder the model left (FR-B-32/33) — each is
 * one element the AI couldn't fill with a tenant image and didn't invent a stock URL for. */
function findImagePlaceholders(
  html: string
): { srcmapId: string; description: string }[] {
  const placeholders: { srcmapId: string; description: string }[] = [];
  const re = new RegExp(
    `<[^>]*\\bdata-cc-id="([^"]+)"[^>]*\\b${NEED_IMAGE_ATTR}="([^"]*)"[^>]*>|` +
      `<[^>]*\\b${NEED_IMAGE_ATTR}="([^"]*)"[^>]*\\bdata-cc-id="([^"]+)"[^>]*>`,
    "g"
  );
  for (const match of html.matchAll(re)) {
    const srcmapId = match[1] ?? match[4];
    const description = match[2] ?? match[3] ?? "";
    if (srcmapId) placeholders.push({ srcmapId, description });
  }
  return placeholders;
}

/**
 * Everything after the model call resolves, for the very first version of a page (seq=1):
 * sanitize/stamp, store, land the `pageVersions` row, advance the page, and (FR-B-32/33)
 * nudge the user in chat if the model left any `data-cc-need-image` placeholders. Shared by
 * the non-streaming and streaming `/generate` handlers so they can't drift apart.
 */
async function persistFirstGeneratedVersion(
  db: ReturnType<typeof createDbFromEnv>,
  env: Bindings,
  orgId: string,
  landingPage: Awaited<ReturnType<typeof requireLandingPage>>,
  rawText: string
) {
  let html: string;
  try {
    html = stampSrcmap(sanitizeLandingHtml(extractHtml(rawText)));
  } catch (err) {
    // Surfaced as a clean, client-safe 422 instead of the raw parser error (`err.message` is
    // masked entirely for a 500 — see errorHandler.ts) — the retry button on the studio empty
    // state is the actual fix here, not anything this route can do about a model's one-off bad
    // output, but the user needs a real explanation to know that's what happened.
    if (err instanceof InvalidGeneratedHtmlError) {
      throw new ApiError(422, "model_output_invalid", err.message);
    }
    throw err;
  }

  const storage = createStorageFromEnv(env);
  const seq = 1;
  const htmlKey = `landing-pages/${landingPage.id}/v${seq}/index.html`;
  const srcmapKey = `landing-pages/${landingPage.id}/v${seq}/index.html.srcmap.json`;
  await storage.put({ key: htmlKey, body: html, contentType: "text/html" });
  await storage.put({
    key: srcmapKey,
    body: JSON.stringify(srcmapToJson(html), null, 2),
    contentType: "application/json"
  });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq,
    htmlKey,
    srcmapKey,
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  // Usage/billing is already recorded inside `runModelCompletion` (trial debit, platform
  // credit debit, or BYOK usage insert) — nothing left to do here but advance the page.
  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });

  const placeholders = findImagePlaceholders(html);
  if (placeholders.length > 0) {
    const sessionId = await requireChatSessionId(db, orgId, landingPage);
    const listing = placeholders
      .map((p) => `- ${p.description || "ảnh minh hoạ"} (${p.srcmapId})`)
      .join("\n");
    await chatMessagesRepository.insert(db, orgId, {
      sessionId,
      role: "assistant",
      content: [
        {
          type: "text",
          text:
            `Trang vừa tạo còn ${placeholders.length} vị trí cần ảnh minh hoạ:\n${listing}\n\n` +
            `Bạn có ảnh thật muốn dùng ở đây không? Nếu không, mình có thể gợi ý ảnh stock miễn phí ` +
            `(Unsplash/Pexels, license thương mại) — trả lời "dùng ảnh gợi ý" hoặc bỏ qua câu hỏi này.`
        }
      ],
      tokenUsage: null
    });
  }

  return version;
}

// FR-B-21: the very first version for a page created via the prompt bar (Phase 1 only created
// the empty record). Studio's pending-skeleton state (studio-page.tsx) calls this once on
// mount. FR-B-32/33: the model is instructed (compileGeneratePrompt) to prefer tenant images,
// otherwise leave a `data-cc-need-image` placeholder rather than invent/hotlink a stock URL —
// after landing the version, we ask in chat before ever inserting one (apply happens through
// the separate confirm-first `/api/studio/images/apply` endpoint, never automatically here).
landingsRoutes.post("/:id/generate", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const { prompt } = generateLandingPageInputSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, id);
  if (landingPage.currentVersionId) {
    throw new ApiError(400, "landing_page_already_generated");
  }

  const [connectionId, skills, tenantAssets, org] = await Promise.all([
    resolveGenerateConnectionId(db, orgId),
    skillsRepository.listEnabledForLandingPage(db, orgId, id),
    pageAssetsRepository.listByLandingPage(db, orgId, id),
    organizationsRepository.findById(db, orgId)
  ]);
  // FR-B-24: org.settings.designTokens (no settings UI writes it yet — see contracts/tenancy.ts).
  const { designTokens } = orgSettingsSchema.parse(org?.settings ?? {});

  const system = compileGeneratePrompt({
    skills: skills.map((s) => ({ name: s.name, content: s.content })),
    tenantImages: tenantAssets.map((asset) => ({
      url: `/api/landings/${id}/assets/${asset.id}/file`,
      description: asset.fileName
    })),
    designTokens
  });

  const result = await runModelCompletion(
    db,
    c.env,
    orgId,
    connectionId,
    "generate",
    [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  );
  const version = await persistFirstGeneratedVersion(
    db,
    c.env,
    orgId,
    landingPage,
    result.text
  );

  return c.json(pageVersionSchema.parse(version), 201);
});

/**
 * Streaming twin of POST /:id/generate (FR-B-21) — same connection resolution and
 * post-processing, but relays each text chunk to the browser as SSE so the studio UI can show
 * live progress instead of a silent multi-minute wait (a full generate can easily take minutes
 * on a slow BYOK model, with the non-streaming endpoint giving zero feedback until it's done).
 */
landingsRoutes.post("/:id/generate/stream", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const { prompt } = generateLandingPageInputSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, id);
  if (landingPage.currentVersionId) {
    throw new ApiError(400, "landing_page_already_generated");
  }

  const [connectionId, skills, tenantAssets, org] = await Promise.all([
    resolveGenerateConnectionId(db, orgId),
    skillsRepository.listEnabledForLandingPage(db, orgId, id),
    pageAssetsRepository.listByLandingPage(db, orgId, id),
    organizationsRepository.findById(db, orgId)
  ]);
  // FR-B-24: org.settings.designTokens (no settings UI writes it yet — see contracts/tenancy.ts).
  const { designTokens } = orgSettingsSchema.parse(org?.settings ?? {});

  const system = compileGeneratePrompt({
    skills: skills.map((s) => ({ name: s.name, content: s.content })),
    tenantImages: tenantAssets.map((asset) => ({
      url: `/api/landings/${id}/assets/${asset.id}/file`,
      description: asset.fileName
    })),
    designTokens
  });

  return streamSSE(c, async (stream) => {
    // Headers are already sent once streaming starts — a thrown ApiError past this point can't
    // become a normal JSON error response, so relay it as one last SSE event instead, caught
    // locally rather than via streamSSE's `onError` (which unconditionally writes its own
    // second, plain-text "error" event right after any custom one — this way there's exactly
    // one). The studio client (studio-page.tsx) reads `code` the same way it reads a failed
    // non-streaming call's response body.
    try {
      const result = await runModelCompletion(
        db,
        c.env,
        orgId,
        connectionId,
        "generate",
        [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        (delta) => stream.writeSSE({ event: "delta", data: delta })
      );
      const version = await persistFirstGeneratedVersion(
        db,
        c.env,
        orgId,
        landingPage,
        result.text
      );
      await stream.writeSSE({
        event: "done",
        data: JSON.stringify(pageVersionSchema.parse(version))
      });
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "internal_error";
      const message = err instanceof Error ? err.message : String(err);
      // Errors caught here never reach Hono's own error-handling middleware (this response
      // already started streaming), so without an explicit log call a real server-side crash
      // is otherwise completely silent — only visible as a client-reported message, with
      // nothing in the server's own logs to correlate it against.
      log("error", {
        requestId: c.get("requestId"),
        orgId,
        status: 200,
        code,
        message
      });
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({ code, message })
      });
    }
  });
});

// Design Files tab, version history (FR-B-27) — newest first, includes the current version.
landingsRoutes.get("/:id/versions", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  return c.json({ versions: z.array(pageVersionSchema).parse(versions) });
});

const updateVersionLabelSchema = z.object({
  label: z.string().trim().max(120).nullable()
});

landingsRoutes.patch("/:id/versions/:versionId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const versionId = c.req.param("versionId");
  const body = updateVersionLabelSchema.parse(await c.req.json());
  await requireLandingPage(db, orgId, id);

  const existing = await pageVersionsRepository.findById(db, orgId, versionId);
  if (!existing || existing.landingPageId !== id) {
    throw new ApiError(404, "page_version_not_found");
  }

  const version = await pageVersionsRepository.update(db, orgId, versionId, {
    label: body.label
  });
  return c.json(pageVersionSchema.parse(version));
});

// FR-B-27 Restore: lands a new immutable version (origin="restore") pointing at the same
// htmlKey/srcmapKey as the target — the content is identical, so re-uploading it to R2 would
// just duplicate bytes. History is never deleted, only appended to.
landingsRoutes.post("/:id/versions/:versionId/restore", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const versionId = c.req.param("versionId");
  const landingPage = await requireLandingPage(db, orgId, id);

  const foundTarget = await pageVersionsRepository.findById(
    db,
    orgId,
    versionId
  );
  if (
    !foundTarget ||
    foundTarget.landingPageId !== id ||
    foundTarget.prunedAt
  ) {
    throw new ApiError(404, "page_version_not_found");
  }
  const target = requireSrcmapVersion(foundTarget);

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
    seq,
    htmlKey: target.htmlKey,
    srcmapKey: target.srcmapKey,
    origin: "restore",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });

  return c.json(pageVersionSchema.parse(version), 201);
});

// Diff viewer (FR-B-27) needs both sides' HTML by explicit version, not just "current".
landingsRoutes.get("/:id/versions/:versionId/html", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const versionId = c.req.param("versionId");
  await requireLandingPage(db, orgId, id);

  const foundVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    versionId
  );
  if (
    !foundVersion ||
    foundVersion.landingPageId !== id ||
    foundVersion.prunedAt
  ) {
    throw new ApiError(404, "page_version_not_found");
  }
  const version = requireSrcmapVersion(foundVersion);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(version.htmlKey);
  if (!object) throw new ApiError(404, "html_not_found");

  return new Response(object.body, {
    headers: { "content-type": object.contentType ?? "text/html" }
  });
});

// Design Files "DATA" group — the current version's `<Page>.html.srcmap.json`, read-only.
landingsRoutes.get("/:id/srcmap", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);
  if (!landingPage.currentVersionId) {
    throw new ApiError(404, "page_version_not_found");
  }

  const foundVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!foundVersion) throw new ApiError(404, "page_version_not_found");
  const currentVersion = requireSrcmapVersion(foundVersion);

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(currentVersion.srcmapKey);
  if (!object) throw new ApiError(404, "srcmap_not_found");

  return new Response(object.body, {
    headers: { "content-type": object.contentType ?? "application/json" }
  });
});

// Design Files "IMAGES" group — the project's `.thumbnail.jpg`, auto-captured client-side
// after every save (studio-builder-spec.md, FR-B-26) and re-uploaded here.
landingsRoutes.get("/:id/thumbnail", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);
  if (!landingPage.thumbnailKey) throw new ApiError(404, "thumbnail_not_found");

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(landingPage.thumbnailKey);
  if (!object) throw new ApiError(404, "thumbnail_not_found");

  return new Response(object.body, {
    headers: { "content-type": object.contentType ?? "image/jpeg" }
  });
});

const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;

landingsRoutes.post("/:id/thumbnail", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);

  const form = await c.req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "file_required");
  if (file.size > MAX_THUMBNAIL_BYTES)
    throw new ApiError(413, "file_too_large");

  const storage = createStorageFromEnv(c.env);
  const thumbnailKey = `landing-pages/${id}/thumbnail.jpg`;
  await storage.put({
    key: thumbnailKey,
    body: await file.arrayBuffer(),
    contentType: "image/jpeg"
  });

  const updated = await landingPagesRepository.update(
    db,
    orgId,
    landingPage.id,
    {
      thumbnailKey
    }
  );
  return c.json(landingPageSchema.parse(updated));
});

// Design Files "FOLDERS" group — assets/ contents (FR-B-29).
landingsRoutes.get("/:id/assets", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const assets = await pageAssetsRepository.listByLandingPage(db, orgId, id);
  return c.json({ assets: z.array(pageAssetSchema).parse(assets) });
});

// FR-B-28 ZIP export — streams the stored asset bytes so the dashboard can bundle them
// under `assets/` without any R2 presign infra (same authenticated-stream pattern as
// `/srcmap` and `/thumbnail` above).
landingsRoutes.get("/:id/assets/:assetId/file", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const asset = await pageAssetsRepository.findById(
    db,
    orgId,
    c.req.param("assetId")
  );
  if (!asset || asset.landingPageId !== id)
    throw new ApiError(404, "asset_not_found");

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(asset.r2Key);
  if (!object) throw new ApiError(404, "asset_not_found");

  return new Response(object.body, {
    headers: { "content-type": object.contentType ?? asset.mime }
  });
});

// FR-B-29: poster/thumbnail for a video asset — same authenticated-stream shape as the
// `/file` route above, just reading `posterKey` instead of `r2Key`.
landingsRoutes.get("/:id/assets/:assetId/poster", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const asset = await pageAssetsRepository.findById(
    db,
    orgId,
    c.req.param("assetId")
  );
  if (!asset || asset.landingPageId !== id || !asset.posterKey)
    throw new ApiError(404, "asset_poster_not_found");

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(asset.posterKey);
  if (!object) throw new ApiError(404, "asset_poster_not_found");

  return new Response(object.body, {
    headers: { "content-type": object.contentType ?? "image/jpeg" }
  });
});

/** Uploads one file's bytes to R2 under `landing-pages/:id/assets/...` and returns its key —
 * shared by the main asset upload and its optional poster field below. */
async function putAssetBytes(
  storage: ReturnType<typeof createStorageFromEnv>,
  landingPageId: string,
  file: File
): Promise<string> {
  const key = `landing-pages/${landingPageId}/assets/${crypto.randomUUID()}-${file.name}`;
  await storage.put({
    key,
    body: await file.arrayBuffer(),
    contentType: file.type || "application/octet-stream"
  });
  return key;
}

// FR-B-29: image compression + WebP/AVIF conversion (or, for video, first-frame poster
// extraction) happens client-side before this call — the file arriving here is already the
// variant to store, so the API just validates + persists it as-is. Video keeps its own,
// higher size cap since it's never compressed the way images are.
landingsRoutes.post("/:id/assets", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const form = await c.req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "file_required");

  const isVideo = ALLOWED_VIDEO_MIME.has(file.type);
  const isImage = ALLOWED_IMAGE_MIME.has(file.type);
  if (!isVideo && !isImage) throw new ApiError(400, "unsupported_file_type");
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) throw new ApiError(413, "file_too_large");

  const rawFileName = form.get("fileName");
  const fileName = typeof rawFileName === "string" ? rawFileName : file.name;
  const storage = createStorageFromEnv(c.env);
  const r2Key = await putAssetBytes(storage, id, file);

  // Optional poster field, only meaningful alongside a video upload — the client extracts the
  // first frame itself (no server-side video decoding) and sends it as a second multipart part.
  const poster = form.get("poster");
  let posterKey: string | null = null;
  if (isVideo && poster instanceof File) {
    if (!ALLOWED_IMAGE_MIME.has(poster.type)) {
      throw new ApiError(400, "unsupported_poster_type");
    }
    if (poster.size > MAX_IMAGE_BYTES)
      throw new ApiError(413, "file_too_large");
    posterKey = await putAssetBytes(storage, id, poster);
  }

  const asset = await pageAssetsRepository.insert(db, orgId, {
    landingPageId: id,
    fileName,
    r2Key,
    posterKey,
    mime: file.type || "application/octet-stream",
    sizeBytes: file.size,
    variants: {},
    source: "user_upload",
    license: {},
    unverifiedSource: false,
    usageConfirmed: false
  });

  return c.json(pageAssetSchema.parse(asset), 201);
});

const confirmAssetUsageSchema = z.object({ usageConfirmed: z.literal(true) });

// FR-B-35: the only way `pageAssets.usageConfirmed` ever flips true — tenant ticks "Tôi có
// quyền sử dụng ảnh này" for one flagged (unverifiedSource) asset. Publish (lib/publish.ts)
// blocks while any unverifiedSource asset on the page still has this false; copyright
// responsibility shifts to the tenant once they confirm, the platform only warns.
landingsRoutes.patch("/:id/assets/:assetId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const assetId = c.req.param("assetId");
  confirmAssetUsageSchema.parse(await c.req.json());
  await requireLandingPage(db, orgId, id);

  const existing = await pageAssetsRepository.findById(db, orgId, assetId);
  if (!existing || existing.landingPageId !== id) {
    throw new ApiError(404, "asset_not_found");
  }

  const asset = await pageAssetsRepository.update(db, orgId, assetId, {
    usageConfirmed: true
  });
  return c.json(pageAssetSchema.parse(asset));
});

// Publish (architecture.md §5.2, outbox pattern) — build_deploy pipeline runs inline in the
// request rather than a separate queued job (no job-queue infra wired up yet, see
// packages/drivers/src/jobs). That's fine for the pattern's actual guarantee: the outbox row
// is what makes a mid-pipeline crash recoverable, not which process runs the pipeline.
landingsRoutes.post("/:id/publish", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const body = publishLandingPageInputSchema.parse(await c.req.json());

  const { deployment, live } = await publishLandingPage(
    db,
    c.env,
    orgId,
    id,
    body.subdomain
  );

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "landing_page.publish",
    targetType: "landing_page",
    targetId: id,
    meta: { subdomain: body.subdomain, live }
  });

  return c.json(
    { deployment: deploymentSchema.parse(deployment), live },
    live ? 200 : 202
  );
});

// Pre-publish preview (`ui-ux-design.md` §Studio) — builds the real publish artifacts to a
// private token URL. Deliberately *not* a `deployments` row: nothing goes live, so there's
// nothing to roll back and nothing to show in deploy history.
landingsRoutes.post("/:id/preview", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const { path } = await previewLandingPage(db, c.env, orgId, id);
  return c.json({ url: new URL(path, c.req.url).toString() });
});

// Deploy history for the current hostname (rollback target picker).
landingsRoutes.get("/:id/deployments", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const all = await deploymentsRepository.list(db, orgId);
  const deployments = all
    .filter((deployment) => deployment.landingPageId === id)
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return c.json({ deployments: z.array(deploymentSchema).parse(deployments) });
});

// Rollback goes through the same outbox mechanism as publish, per architecture.md §5.2 —
// not a direct KV/pointer write.
landingsRoutes.post("/:id/deployments/:deploymentId/rollback", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const deploymentId = c.req.param("deploymentId");
  const live = await rollbackDeployment(db, c.env, orgId, id, deploymentId);

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "landing_page.rollback",
    targetType: "landing_page",
    targetId: id,
    meta: { deploymentId, live }
  });

  return c.json({ live }, live ? 200 : 202);
});

// Unpublish (FR-G-02) — removes the hostname pointer directly, no outbox row (see
// lib/publish.ts unpublishLandingPage doc comment for why it doesn't fit that shape).
landingsRoutes.post("/:id/unpublish", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const deployment = await unpublishLandingPage(db, c.env, orgId, id);

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "landing_page.unpublish",
    targetType: "landing_page",
    targetId: id,
    meta: {}
  });

  return c.json({ deployment: deploymentSchema.parse(deployment) }, 200);
});
