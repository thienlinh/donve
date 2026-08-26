import { landingPageSchema, pageAssetSchema } from "@dv/contracts";
import { landingPagesRepository, pageAssetsRepository } from "@dv/db";
import { Hono } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import {
  ALLOWED_IMAGE_MIME,
  ALLOWED_VIDEO_MIME,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  sanitizeFileName
} from "@/lib/image-upload.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import type { AppEnv } from "@/types.js";

import {
  requireLandingPage,
  requireLandingPageContext,
  requireOrgId
} from "../shared.js";

export const assetsRoutes = new Hono<AppEnv>();

// Design Files "IMAGES" group — the project's `.thumbnail.jpg`, auto-captured client-side
// after every save (studio-builder-spec.md, FR-B-26) and re-uploaded here.
assetsRoutes.get("/:id/thumbnail", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);
  if (!landingPage.thumbnailKey) throw new ApiError(404, "thumbnail_not_found");

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(landingPage.thumbnailKey);
  if (!object) throw new ApiError(404, "thumbnail_not_found");

  return new Response(object.body, {
    headers: {
      "content-type": object.contentType ?? "image/jpeg",
      "x-content-type-options": "nosniff"
    }
  });
});

const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;

assetsRoutes.post("/:id/thumbnail", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);

  const form = await c.req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "file_required");
  if (!ALLOWED_IMAGE_MIME.has(file.type))
    throw new ApiError(400, "unsupported_file_type");
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
assetsRoutes.get("/:id/assets", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const assets = await pageAssetsRepository.listByLandingPage(db, orgId, id);
  return c.json({ assets: z.array(pageAssetSchema).parse(assets) });
});

// FR-B-28 ZIP export — streams the stored asset bytes so the dashboard can bundle them
// under `assets/` without any R2 presign infra (same authenticated-stream pattern as
// `/srcmap` and `/thumbnail` above).
assetsRoutes.get("/:id/assets/:assetId/file", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

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
    headers: {
      "content-type": object.contentType ?? asset.mime,
      "x-content-type-options": "nosniff"
    }
  });
});

// FR-B-29: poster/thumbnail for a video asset — same authenticated-stream shape as the
// `/file` route above, just reading `posterKey` instead of `r2Key`.
assetsRoutes.get("/:id/assets/:assetId/poster", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

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
    headers: {
      "content-type": object.contentType ?? "image/jpeg",
      "x-content-type-options": "nosniff"
    }
  });
});

/** Uploads one file's bytes to R2 under `landing-pages/:id/assets/...` and returns its key —
 * shared by the main asset upload and its optional poster field below. */
async function putAssetBytes(
  storage: ReturnType<typeof createStorageFromEnv>,
  landingPageId: string,
  file: File
): Promise<string> {
  const key = `landing-pages/${landingPageId}/assets/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
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
assetsRoutes.post("/:id/assets", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

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

  let asset: Awaited<ReturnType<typeof pageAssetsRepository.insert>>;
  try {
    asset = await pageAssetsRepository.insert(db, orgId, {
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
  } catch (error) {
    // Don't leave the bytes we already wrote orphaned in storage if the DB row never lands.
    await storage.delete(r2Key);
    if (posterKey) await storage.delete(posterKey);
    throw error;
  }

  return c.json(pageAssetSchema.parse(asset), 201);
});

const confirmAssetUsageSchema = z.object({ usageConfirmed: z.literal(true) });

// FR-B-35: the only way `pageAssets.usageConfirmed` ever flips true — tenant ticks "Tôi có
// quyền sử dụng ảnh này" for one flagged (unverifiedSource) asset. Publish (lib/publish.ts)
// blocks while any unverifiedSource asset on the page still has this false; copyright
// responsibility shifts to the tenant once they confirm, the platform only warns.
assetsRoutes.patch("/:id/assets/:assetId", async (c) => {
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
