import { campaignsRepository, entityImagesRepository } from "@dv/db";
import type { Db } from "@dv/db";
import { Hono, type Context } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { ALLOWED_IMAGE_MIME, MAX_IMAGE_BYTES } from "@/lib/image-upload.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import type { AppEnv } from "@/types.js";

/**
 * Org logo + campaign OG image (`architecture-and-data-model.md` §Media/Asset) — one shared
 * code path over `entityImages`, not two features. Landing-page assets keep their own endpoint
 * under `/api/landings/:id/assets` (they're versioned/published with the page; these aren't).
 */
export const entityImagesRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

const refSchema = z.object({
  ownerType: z.enum(["organization", "campaign"]),
  ownerId: z.string().min(1),
  kind: z.enum(["logo", "og_image"])
});
type ImageRef = z.infer<typeof refSchema>;

/**
 * The path's `ownerId` is attacker-controlled, and `entityImages` has no FK to the owner table
 * — so a caller could otherwise attach an image to another org's campaign id (the RLS org scope
 * only guards the `entityImages` row itself, not what it points at). Every route resolves the
 * ref through here first.
 */
async function requireOwnedRef(
  c: Context<AppEnv>,
  db: Db,
  orgId: string
): Promise<ImageRef> {
  const ref = refSchema.parse(c.req.param());
  if (ref.ownerType === "organization") {
    if (ref.ownerId !== orgId) throw new ApiError(404, "owner_not_found");
    return ref;
  }
  const campaign = await campaignsRepository.findById(db, orgId, ref.ownerId);
  if (!campaign) throw new ApiError(404, "owner_not_found");
  return ref;
}

/** Authenticated byte stream — same pattern as `/api/landings/:id/assets/:assetId/file`
 * (no R2 presign infra); the app renders it directly as an `<img src>`. */
entityImagesRoutes.get("/:ownerType/:ownerId/:kind", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const ref = await requireOwnedRef(c, db, orgId);

  const row = await entityImagesRepository.findByRef(db, orgId, ref);
  if (!row) throw new ApiError(404, "entity_image_not_found");

  const storage = createStorageFromEnv(c.env);
  const object = await storage.get(row.r2Key);
  if (!object) throw new ApiError(404, "entity_image_not_found");

  return new Response(object.body, {
    headers: {
      "content-type": object.contentType ?? row.mime,
      "x-content-type-options": "nosniff"
    }
  });
});

entityImagesRoutes.put("/:ownerType/:ownerId/:kind", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const ref = await requireOwnedRef(c, db, orgId);

  const file = (await c.req.formData()).get("file");
  if (!(file instanceof File)) throw new ApiError(400, "file_required");
  if (!ALLOWED_IMAGE_MIME.has(file.type)) {
    throw new ApiError(400, "unsupported_file_type");
  }
  if (file.size > MAX_IMAGE_BYTES) throw new ApiError(413, "file_too_large");

  // Deterministic key: re-uploading overwrites the bytes in place, so a replaced image can
  // never leave an orphaned R2 object behind (the row is upserted, there's only ever one).
  const r2Key = `entity-images/${orgId}/${ref.ownerType}/${ref.ownerId}/${ref.kind}`;
  await createStorageFromEnv(c.env).put({
    key: r2Key,
    body: await file.arrayBuffer(),
    contentType: file.type
  });
  await entityImagesRepository.upsert(db, orgId, {
    ...ref,
    r2Key,
    mime: file.type
  });

  return c.body(null, 204);
});

entityImagesRoutes.delete("/:ownerType/:ownerId/:kind", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const ref = await requireOwnedRef(c, db, orgId);

  const removed = await entityImagesRepository.removeByRef(db, orgId, ref);
  if (removed) await createStorageFromEnv(c.env).delete(removed.r2Key);

  return c.body(null, 204);
});
