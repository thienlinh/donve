import {
  collectStream,
  decryptApiKey,
  getProvider,
  pickModel
} from "@dv/ai-gateway";
import {
  generateLandingPageInputSchema,
  landingPageDetailSchema,
  landingPageListItemSchema,
  landingPageSchema,
  pageAssetSchema,
  pageVersionSchema
} from "@dv/contracts";
import {
  aiConnectionsRepository,
  aiUsageRepository,
  campaignsRepository,
  chatMessagesRepository,
  deploymentsRepository,
  landingPagesRepository,
  pageAssetsRepository,
  pageVersionsRepository,
  skillsRepository
} from "@dv/db";
import { compileGeneratePrompt } from "@dv/studio-ai";
import {
  sanitizeLandingHtml,
  srcmapToJson,
  stampSrcmap
} from "@dv/studio-core";
import { Hono, type Context } from "hono";
import { z } from "zod";

import { importAiMasterKeyFromEnv } from "../../lib/ai-gateway.js";
import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { createStorageFromEnv } from "../../lib/storage.js";
import { requireChatSessionId } from "../../lib/studio-chat.js";
import type { AppEnv } from "../../types.js";

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

  // Same BYOK-only pattern as studio/routes.ts's chat/stream — no connection picker yet
  // for studio actions, so this just requires a default connection to be set up.
  const connections = await aiConnectionsRepository.list(db, orgId);
  const connection = connections.find((row) => row.isDefault);
  if (!connection?.encryptedKey || connection.provider === "platform") {
    throw new ApiError(400, "no_ai_connection");
  }

  const [skills, tenantAssets] = await Promise.all([
    skillsRepository.listEnabledForLandingPage(db, orgId, id),
    pageAssetsRepository.listByLandingPage(db, orgId, id)
  ]);

  const system = compileGeneratePrompt({
    skills: skills.map((s) => ({ name: s.name, content: s.content })),
    tenantImages: tenantAssets.map((asset) => ({
      url: `/api/landings/${id}/assets/${asset.id}/file`,
      description: asset.fileName
    }))
  });

  const provider = getProvider(connection.provider);
  const model = pickModel(
    connection.provider,
    "generate",
    connection.defaultModel
  );
  const masterKey = await importAiMasterKeyFromEnv(c.env);
  const apiKey = await decryptApiKey(connection.encryptedKey, masterKey);

  const { text, usage } = await collectStream(
    provider.stream(
      {
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ]
      },
      { apiKey }
    )
  );
  const html = stampSrcmap(sanitizeLandingHtml(extractHtml(text)));

  const storage = createStorageFromEnv(c.env);
  const seq = 1;
  const htmlKey = `landing-pages/${id}/v${seq}/index.html`;
  const srcmapKey = `landing-pages/${id}/v${seq}/index.html.srcmap.json`;
  await storage.put({ key: htmlKey, body: html, contentType: "text/html" });
  await storage.put({
    key: srcmapKey,
    body: JSON.stringify(srcmapToJson(html), null, 2),
    contentType: "application/json"
  });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: id,
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

  await Promise.all([
    landingPagesRepository.update(db, orgId, id, {
      currentVersionId: version.id
    }),
    aiUsageRepository.insert(db, orgId, {
      connectionId: connection.id,
      model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      creditCost: provider.countCost(usage, model),
      context: { pageId: id }
    })
  ]);

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

  return c.json(pageVersionSchema.parse(version), 201);
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

const MAX_ASSET_BYTES = 20 * 1024 * 1024;

// FR-B-29: image compression + WebP/AVIF conversion happens client-side before this call —
// the file arriving here is already the variant to store, so the API just persists it as-is.
landingsRoutes.post("/:id/assets", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  await requireLandingPage(db, orgId, id);

  const form = await c.req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "file_required");
  if (file.size > MAX_ASSET_BYTES) throw new ApiError(413, "file_too_large");

  const rawFileName = form.get("fileName");
  const fileName = typeof rawFileName === "string" ? rawFileName : file.name;
  const storage = createStorageFromEnv(c.env);
  const r2Key = `landing-pages/${id}/assets/${crypto.randomUUID()}-${fileName}`;
  await storage.put({
    key: r2Key,
    body: await file.arrayBuffer(),
    contentType: file.type || "application/octet-stream"
  });

  const asset = await pageAssetsRepository.insert(db, orgId, {
    landingPageId: id,
    fileName,
    r2Key,
    mime: file.type || "application/octet-stream",
    sizeBytes: file.size,
    variants: {},
    source: "user_upload",
    license: {},
    unverifiedSource: false
  });

  return c.json(pageAssetSchema.parse(asset), 201);
});
