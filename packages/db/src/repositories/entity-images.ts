import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { entityImages } from "../schema/studio.js";

type EntityImage = typeof entityImages.$inferSelect;
type OwnerType = EntityImage["ownerType"];
type Kind = EntityImage["kind"];

interface EntityImageRef {
  ownerType: OwnerType;
  ownerId: string;
  kind: Kind;
}

function matches(ref: EntityImageRef) {
  return and(
    eq(entityImages.ownerType, ref.ownerType),
    eq(entityImages.ownerId, ref.ownerId),
    eq(entityImages.kind, ref.kind)
  );
}

/** No id-based CRUD (`createOrgScopedRepository`) — every access is by (owner, kind), never by id. */
export const entityImagesRepository = {
  async findByRef(db: Db, orgId: string, ref: EntityImageRef) {
    const rows = await withOrgScope<EntityImage[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(entityImages)
        .where(and(eq(entityImages.orgId, orgId), matches(ref)))
        .limit(1)
    );
    return rows[0];
  },

  /** One image per (entity, kind) — `ux_entity_image` makes the overwrite atomic. */
  async upsert(
    db: Db,
    orgId: string,
    values: EntityImageRef & { r2Key: string; mime: string }
  ) {
    const rows = await withOrgScope<EntityImage[]>(db, orgId, (qb) =>
      qb
        .insert(entityImages)
        .values({ ...values, orgId })
        .onConflictDoUpdate({
          target: [
            entityImages.ownerType,
            entityImages.ownerId,
            entityImages.kind
          ],
          set: {
            r2Key: values.r2Key,
            mime: values.mime,
            updatedAt: new Date()
          }
        })
        .returning()
    );
    return rows[0];
  },

  async removeByRef(db: Db, orgId: string, ref: EntityImageRef) {
    const rows = await withOrgScope<EntityImage[]>(db, orgId, (qb) =>
      qb
        .delete(entityImages)
        .where(and(eq(entityImages.orgId, orgId), matches(ref)))
        .returning()
    );
    return rows[0];
  }
};
