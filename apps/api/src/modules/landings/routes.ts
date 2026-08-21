import {
  deploymentSchema,
  generateLandingPageInputSchema,
  importLandingPageResponseSchema,
  landingPageDetailSchema,
  landingPageListItemSchema,
  landingPageSchema,
  orgSettingsSchema,
  pageAssetSchema,
  pageVersionSchema,
  publishLandingPageInputSchema
} from "@dv/contracts";
import {
  auditLogsRepository,
  campaignsRepository,
  chatMessagesRepository,
  deploymentsRepository,
  landingPagesRepository,
  organizationsRepository,
  pageAssetsRepository,
  pageVersionsRepository,
  skillsRepository
} from "@dv/db";
import { compileGeneratePrompt } from "@dv/studio-ai";
import {
  applyLayerNames,
  autoNameLayers,
  detectFunnelGaps,
  InvalidGeneratedHtmlError,
  srcmapToJson,
  stampSrcmap
} from "@dv/studio-core";
import { sanitizeLandingHtml } from "@dv/studio-core/sanitize";
import { Hono, type Context } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "../../lib/ai-gateway.js";
import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import {
  extractInlineImportAssets,
  type ZipAsset
} from "../../lib/import-assets.js";
import { nameGenericLayers } from "../../lib/import-naming.js";
import { parseZipImport } from "../../lib/import-zip.js";
import { log } from "../../lib/logger.js";
import {
  publishLandingPage,
  rollbackDeployment,
  unpublishLandingPage
} from "../../lib/publish.js";
import { readCappedBytes, safeFetch } from "../../lib/safe-fetch.js";
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

  const landingPages = rows
    .filter((row) => !row.deletedAt)
    .map((row) => {
      const liveHostname = liveHostnameByLandingPageId.get(row.id) ?? null;
      return {
        ...row,
        isPublished: liveHostname !== null,
        liveHostname,
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

const MAX_IMPORT_FILE_BYTES = 20 * 1024 * 1024;

// FR-B-30: paste HTML / upload .html or .zip / paste a public artifact link → sanitize → tách
// inline assets → generate srcmap → auto-name layers (heuristic + AI) → open in Studio. Always
// multipart: the "paste HTML"/"paste link" cases have no binary payload, but the file-upload
// case does, so one request shape covers all three instead of branching on content-type.
landingsRoutes.post("/import", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const form = await c.req.formData();

  const mode = form.get("mode");
  if (mode !== "html" && mode !== "url" && mode !== "file") {
    throw new ApiError(400, "invalid_import_mode");
  }

  let rawHtml: string;
  let zipAssets: ZipAsset[] = [];

  if (mode === "html") {
    const html = form.get("html");
    if (typeof html !== "string" || !html.trim()) {
      throw new ApiError(400, "html_required");
    }
    if (html.length > MAX_IMPORT_FILE_BYTES) {
      throw new ApiError(413, "html_too_large");
    }
    rawHtml = html;
  } else if (mode === "url") {
    const url = form.get("url");
    if (typeof url !== "string" || !url.trim()) {
      throw new ApiError(400, "url_required");
    }
    // architecture.md §7: the pasted "artifact công khai" link is server-fetched, so it goes
    // through the same SSRF-checked fetch as an external <img src> found inside imported HTML.
    const res = await safeFetch(url);
    if (!res.ok) throw new ApiError(502, "import_url_fetch_failed");
    rawHtml = new TextDecoder().decode(
      await readCappedBytes(res, MAX_IMPORT_FILE_BYTES)
    );
  } else {
    const file = form.get("file");
    if (!(file instanceof File)) throw new ApiError(400, "file_required");
    if (file.size > MAX_IMPORT_FILE_BYTES) {
      throw new ApiError(413, "file_too_large");
    }
    if (file.name.toLowerCase().endsWith(".zip")) {
      const parsed = parseZipImport(new Uint8Array(await file.arrayBuffer()));
      rawHtml = parsed.html;
      zipAssets = parsed.assets;
    } else {
      rawHtml = await file.text();
    }
  }

  let html: string;
  try {
    // Same sanitize-then-stamp order as /generate — imported HTML is exactly as untrusted as
    // AI output (architecture.md §7 "HTML AI/import chứa script độc").
    html = stampSrcmap(sanitizeLandingHtml(rawHtml));
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
    source: "import"
  });
  if (!landingPage) throw new ApiError(500, "landing_page_create_failed");

  const { html: htmlWithAssets } = await extractInlineImportAssets(
    db,
    c.env,
    orgId,
    landingPage.id,
    html,
    zipAssets
  );

  // Heuristic naming always runs; the AI pass only covers the generic containers the
  // heuristic couldn't confidently label, and is skipped entirely (not a hard failure) when
  // the org has no usable AI connection/trial left.
  const { html: heuristicHtml, genericTargets } =
    autoNameLayers(htmlWithAssets);
  let finalHtml = heuristicHtml;
  try {
    const connectionId = await resolveGenerateConnectionId(db, orgId);
    const names = await nameGenericLayers(
      db,
      c.env,
      orgId,
      connectionId,
      genericTargets
    );
    if (names.length > 0) finalHtml = applyLayerNames(heuristicHtml, names);
  } catch {
    // no AI connection/trial available — heuristic names stand.
  }

  const storage = createStorageFromEnv(c.env);
  const seq = 1;
  const htmlKey = `landing-pages/${landingPage.id}/v${seq}/index.html`;
  const srcmapKey = `landing-pages/${landingPage.id}/v${seq}/index.html.srcmap.json`;
  await storage.put({
    key: htmlKey,
    body: finalHtml,
    contentType: "text/html"
  });
  await storage.put({
    key: srcmapKey,
    body: JSON.stringify(srcmapToJson(finalHtml), null, 2),
    contentType: "application/json"
  });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq,
    htmlKey,
    srcmapKey,
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

  // FR-B-31: computed from the already-in-memory final HTML — no extra fetch/round-trip,
  // just tells the wizard whether to offer AI-standardizing the form/SEO meta.
  const funnelGaps = detectFunnelGaps(finalHtml);

  return c.json(
    importLandingPageResponseSchema.parse({
      ...updated,
      currentVersion: version,
      funnelGaps
    }),
    201
  );
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

  const currentVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!currentVersion || currentVersion.prunedAt) {
    throw new ApiError(404, "page_version_not_found");
  }

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

  const currentVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!currentVersion) throw new ApiError(404, "page_version_not_found");

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

  const target = await pageVersionsRepository.findById(db, orgId, versionId);
  if (!target || target.landingPageId !== id || target.prunedAt) {
    throw new ApiError(404, "page_version_not_found");
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

  const version = await pageVersionsRepository.findById(db, orgId, versionId);
  if (!version || version.landingPageId !== id || version.prunedAt) {
    throw new ApiError(404, "page_version_not_found");
  }

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

  const currentVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!currentVersion) throw new ApiError(404, "page_version_not_found");

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

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif"
]);
const ALLOWED_VIDEO_MIME = new Set(["video/mp4", "video/webm"]);

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
