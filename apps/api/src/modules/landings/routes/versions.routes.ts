import { pageVersionSchema } from "@dv/contracts";
import { landingPagesRepository, pageVersionsRepository } from "@dv/db";
import { Hono } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { requireSrcmapVersion } from "@/lib/page-version-guards.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import type { AppEnv } from "@/types.js";

import {
  applySpecUpdate,
  insertVersionAndActivate,
  requireLandingPage,
  requireLandingPageContext,
  requireOrgId
} from "../shared.js";

export const versionsRoutes = new Hono<AppEnv>();

versionsRoutes.get("/:id/html", async (c) => {
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
versionsRoutes.post("/:id/versions", async (c) => {
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

  const version = await insertVersionAndActivate(db, orgId, id, seq, {
    htmlKey,
    srcmapKey: currentVersion.srcmapKey,
    origin: "manual",
    patch: body.patch,
    chatMessageId: null,
    label: null,
    createdBy: null
  });

  return c.json(pageVersionSchema.parse(version), 201);
});

// Design Files tab, version history (FR-B-27) — newest first, includes the current version.
versionsRoutes.get("/:id/versions", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  return c.json({ versions: z.array(pageVersionSchema).parse(versions) });
});

// Studio Native version diff (full row, including `spec`) — `pageVersionSchema` already carries
// `spec`, and `listByLandingPage` above doesn't trim it either, but the diff dialog only needs
// one version at a time, not the whole list.
versionsRoutes.get("/:id/versions/:versionId", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const versionId = c.req.param("versionId");
  await requireLandingPage(db, orgId, id);

  const version = await pageVersionsRepository.findById(db, orgId, versionId);
  if (!version || version.landingPageId !== id || version.prunedAt) {
    throw new ApiError(404, "page_version_not_found");
  }

  return c.json(pageVersionSchema.parse(version));
});

const updateVersionLabelSchema = z.object({
  label: z.string().trim().max(120).nullable()
});

versionsRoutes.patch("/:id/versions/:versionId", async (c) => {
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
versionsRoutes.post("/:id/versions/:versionId/restore", async (c) => {
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

  // Native (PageSpec) version — restore via the same "apply spec + bump version" path
  // `PATCH /:id/spec` uses, not the srcmap-only guard below.
  if (foundTarget.spec !== null) {
    const version = await applySpecUpdate(
      db,
      orgId,
      landingPage.id,
      foundTarget.spec,
      "restore"
    );
    return c.json(pageVersionSchema.parse(version), 201);
  }
  const target = requireSrcmapVersion(foundTarget);

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;

  const version = await insertVersionAndActivate(
    db,
    orgId,
    landingPage.id,
    seq,
    {
      htmlKey: target.htmlKey,
      srcmapKey: target.srcmapKey,
      origin: "restore",
      patch: null,
      chatMessageId: null,
      label: null,
      createdBy: null
    }
  );

  return c.json(pageVersionSchema.parse(version), 201);
});

// Diff viewer (FR-B-27) needs both sides' HTML by explicit version, not just "current".
versionsRoutes.get("/:id/versions/:versionId/html", async (c) => {
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
versionsRoutes.get("/:id/srcmap", async (c) => {
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
