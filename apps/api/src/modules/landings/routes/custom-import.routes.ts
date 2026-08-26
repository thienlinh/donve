import {
  auditResultSchema,
  computeCategoryScore,
  convertToNativeResultSchema,
  customChatApplyInputSchema,
  customChatApplyResultSchema,
  customChatProposeInputSchema,
  customChatProposeResultSchema,
  customPageBundleSchema,
  importCustomPageResponseSchema,
  pageVersionSchema,
  wireLeadFormInputSchema,
  type AuditCategory
} from "@dv/contracts";
import {
  auditFindingsRepository,
  auditRunsRepository,
  customPageBundlesRepository,
  landingPagesRepository,
  pageVersionsRepository
} from "@dv/db";
import {
  compileClassifySectionsPrompt,
  compileCustomImportChatPrompt,
  compileExtractContentPrompt
} from "@dv/studio-ai";
import {
  architectCatalogSummary,
  catalogComponents,
  componentMetaById,
  DEFAULT_DESIGN_TOKENS
} from "@dv/studio-catalog";
import { detectFunnelGaps, InvalidGeneratedHtmlError } from "@dv/studio-core";
import { sanitizeLandingHtml } from "@dv/studio-core/sanitize";
import { Hono } from "hono";
import { z } from "zod";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "@/lib/ai-gateway.js";
import {
  applyCustomChatEdits,
  detectImportForms,
  splitIntoSections,
  wireLeadForm
} from "@/lib/custom-import.js";
import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { syncEventDefinitions } from "@/lib/event-definitions.js";
import { extractInlineImportAssets } from "@/lib/import-assets.js";
import { resolveImportPayload } from "@/lib/import-payload.js";
import { runLighthouseSandbox } from "@/lib/lighthouse-sandbox.js";
import { checkSeo, type RawFinding } from "@/lib/quality-audit.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import type { AppEnv } from "@/types.js";

import {
  extractJson,
  insertVersionAndActivate,
  requireLandingPage,
  requireLandingPageContext,
  requireOrgId
} from "../shared.js";

export const customImportRoutes = new Hono<AppEnv>();

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

customImportRoutes.post("/import-custom", async (c) => {
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

customImportRoutes.get("/:id/custom-html", async (c) => {
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

customImportRoutes.get("/:id/custom-import", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const bundle = await customPageBundlesRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!bundle) throw new ApiError(404, "custom_page_bundle_not_found");
  return c.json(customPageBundleSchema.parse(bundle));
});

customImportRoutes.post("/:id/wire-lead-form", async (c) => {
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

  const newVersion = await insertVersionAndActivate(db, orgId, id, seq, {
    htmlKey,
    srcmapKey: null,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: "wire-lead-form",
    createdBy: c.get("userId") ?? null
  });

  // oxlint-disable-next-line react-doctor/server-sequential-independent-await -- bundle fetch doesn't depend on `newVersion`, but must land after the version write (pre-split ordering, unchanged by the routes split)
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

customImportRoutes.post("/:id/reupload-custom", async (c) => {
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

  const version = await insertVersionAndActivate(db, orgId, id, seq, {
    htmlKey,
    srcmapKey: null,
    origin: "import",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
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
customImportRoutes.post("/:id/custom-chat", async (c) => {
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

customImportRoutes.post("/:id/custom-chat/apply", async (c) => {
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
  const newVersion = await insertVersionAndActivate(db, orgId, id, seq, {
    htmlKey,
    srcmapKey: null,
    origin: "manual",
    patch: null,
    chatMessageId: null,
    label: "ai-chat-edit",
    createdBy: c.get("userId") ?? null
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
customImportRoutes.post("/:id/convert-to-native", async (c) => {
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
customImportRoutes.post("/:id/custom-audit", async (c) => {
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

customImportRoutes.get("/:id/custom-audit", async (c) => {
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
