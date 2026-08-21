import { eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { organizations } from "../schema/core.js";

/**
 * Organizations are the tenant boundary itself, so most of this repo's `orgId`
 * contract doesn't apply here: creation happens before any org exists, and reads
 * are scoped by the org's own id rather than a separate caller-supplied orgId.
 * RLS isn't enabled on `organizations` for the same reason (architecture.md §6
 * only lists tables that hold tenant *data*, not the tenant record itself).
 */
export const organizationsRepository = {
  async create(db: Db, values: typeof organizations.$inferInsert) {
    const rows = await db.raw.insert(organizations).values(values).returning();
    return rows[0];
  },

  /** Cross-tenant by definition — only for `/platform/*` routes (platform-admin.md §7). */
  async listAll(db: Db) {
    return db.raw.select().from(organizations);
  },

  async findById(db: Db, orgId: string) {
    const rows = await db.raw
      .select()
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);
    return rows[0];
  },

  async findBySlug(db: Db, slug: string) {
    const rows = await db.raw
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);
    return rows[0];
  },

  async update(
    db: Db,
    orgId: string,
    values: Partial<typeof organizations.$inferInsert>
  ) {
    const rows = await db.raw
      .update(organizations)
      .set(values)
      .where(eq(organizations.id, orgId))
      .returning();
    return rows[0];
  }
};
