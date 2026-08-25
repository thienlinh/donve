import { eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { templates } from "../schema/templates.js";

/**
 * No `withOrgScope` on purpose — `templates` has no `org_id` and no RLS (schema/templates.ts),
 * same as `platformStaffRepository`: queried directly since there's no tenant boundary here.
 */
export const templatesRepository = {
  async list(db: Db) {
    return db.raw.select().from(templates).orderBy(templates.industry);
  },

  async findById(db: Db, templateId: string) {
    const rows = await db.raw
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);
    return rows[0];
  },

  async insert(
    db: Db,
    entry: Omit<typeof templates.$inferInsert, "id" | "createdAt">
  ) {
    const rows = await db.raw.insert(templates).values(entry).returning();
    return rows[0];
  }
};
