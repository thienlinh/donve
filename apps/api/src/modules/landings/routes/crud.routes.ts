import {
  landingPageDetailSchema,
  landingPageListItemSchema,
  landingPageSchema,
  nativePageDocumentSchema,
  pageVersionSchema,
  templateSchema,
  updateLandingPageSpecInputSchema
} from "@dv/contracts";
import {
  campaignsRepository,
  deploymentsRepository,
  landingPagesRepository,
  pageVersionsRepository,
  templatesRepository
} from "@dv/db";
import { DEFAULT_DESIGN_TOKENS } from "@dv/studio-catalog";
import { renderPageArtifact } from "@dv/studio-render";
import type { Spec } from "@json-render/core";
import { Hono } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import type { AppEnv } from "@/types.js";

import {
  applySpecUpdate,
  requireLandingPage,
  requireOrgId
} from "../shared.js";

export const crudRoutes = new Hono<AppEnv>();

crudRoutes.get("/", async (c) => {
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

crudRoutes.post("/", async (c) => {
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
crudRoutes.get("/templates", async (c) => {
  const db = createDbFromEnv(c.env);
  const templates = await templatesRepository.list(db);
  return c.json({ templates: z.array(templateSchema).parse(templates) });
});

/** Same authenticated-stream shape as `assets.routes.ts`'s `/:id/thumbnail`, minus
 * `requireOrgId`/`requireLandingPage` — `templates` has no tenant boundary, so any signed-in
 * user can read one, same as the list route above. Key is set at seed time
 * (`tooling/seed-templates`), never by a tenant action. */
crudRoutes.get("/templates/:id/thumbnail", async (c) => {
  const db = createDbFromEnv(c.env);
  const id = c.req.param("id");
  const template = await templatesRepository.findById(db, id);
  if (!template?.thumbnailKey) throw new ApiError(404, "thumbnail_not_found");

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(template.thumbnailKey);
  if (!object) throw new ApiError(404, "thumbnail_not_found");

  return new Response(object.body, {
    headers: {
      "content-type": object.contentType ?? "image/jpeg",
      "x-content-type-options": "nosniff"
    }
  });
});

/** Renders a shared template's `pageSpec`/`tokens` to standalone HTML — the prompt library
 * detail panel's `<iframe srcDoc>` preview for the 2 "trang-day-du" entries linked to a
 * template (`prompt-library-page.tsx`). Same `renderPageArtifact` call and CSS-inlining
 * `tooling/seed-templates/run.ts`'s thumbnail capture already does (no live storage/route to
 * resolve the catalog stylesheet asset against here either) — returns raw HTML instead of a
 * screenshot. No tenant boundary, same as the list/thumbnail routes above. */
crudRoutes.get("/templates/:id/preview-html", async (c) => {
  const db = createDbFromEnv(c.env);
  const id = c.req.param("id");
  const template = await templatesRepository.findById(db, id);
  if (!template) throw new ApiError(404, "template_not_found");

  const parsed = templateSchema.parse(template);
  const artifact = await renderPageArtifact({
    spec: parsed.pageSpec as Spec,
    tokens: parsed.tokens,
    title: parsed.seo?.title ?? parsed.name,
    hostname: "template-preview.internal",
    canonicalPath: "/",
    runtimeConfig: {
      orgId: "template",
      campaignId: null,
      deployId: "template-preview"
    }
  });
  const cssAsset = artifact.assets.find((asset) => asset.mime === "text/css");
  const html = cssAsset
    ? artifact.html.replace(
        "</head>",
        `<style>${new TextDecoder().decode(cssAsset.bytes)}</style></head>`
      )
    : artifact.html;

  return c.html(html);
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
crudRoutes.post("/:id/save-as-template", async (c) => {
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
crudRoutes.post("/manual", async (c) => {
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
crudRoutes.patch("/:id/spec", async (c) => {
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

  const version = await applySpecUpdate(db, orgId, id, body, "manual");

  return c.json(pageVersionSchema.parse(version), 201);
});

const updateLandingPageSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  campaignId: z.string().nullable().optional()
});

crudRoutes.patch("/:id", async (c) => {
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

crudRoutes.delete("/:id", async (c) => {
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

crudRoutes.post("/:id/duplicate", async (c) => {
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

crudRoutes.get("/:id", async (c) => {
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
