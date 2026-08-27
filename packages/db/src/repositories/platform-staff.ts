import { desc, eq, getTableColumns } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { user } from "../schema/auth.js";
import { platformAuditLogs, platformStaff } from "../schema/platform.js";

/**
 * No `withOrgScope`/`withPlatformScope` here on purpose — `platform_staff` has no `org_id`
 * and no RLS (schema/platform.ts), so it's queried directly like `organizations` is
 * (repositories/organizations.ts: the tenant-boundary tables are the exception to the
 * "every query goes through a scope helper" rule, not a violation of it).
 */
export const platformStaffRepository = {
  async findByUserId(db: Db, userId: string) {
    const rows = await db.raw
      .select()
      .from(platformStaff)
      .where(eq(platformStaff.userId, userId))
      .limit(1);
    return rows[0];
  },

  async grant(
    db: Db,
    userId: string,
    role: (typeof platformStaff.$inferInsert)["role"]
  ) {
    const rows = await db.raw
      .insert(platformStaff)
      .values({ userId, role })
      .returning();
    return rows[0];
  },

  /** Staff-management screen (platform-admin.md §6/§10) — email is what an operator adding a
   * teammate has on hand, joined the same way `organizations.listAll`'s owner email is. */
  listAll(db: Db) {
    return db.raw
      .select({ ...getTableColumns(platformStaff), email: user.email })
      .from(platformStaff)
      .innerJoin(user, eq(user.id, platformStaff.userId))
      .orderBy(platformStaff.createdAt);
  },

  /** Looks up the target user by email (operators know the person, not their ULID — same
   * lookup `grant-platform-staff.ts` does) and upserts their role. `null` return means no user
   * with that email exists yet. */
  async upsertByEmail(
    db: Db,
    email: string,
    role: (typeof platformStaff.$inferInsert)["role"]
  ) {
    const users = await db.raw
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    const found = users[0];
    if (!found) return null;

    const rows = await db.raw
      .insert(platformStaff)
      .values({ userId: found.id, role })
      .onConflictDoUpdate({
        target: platformStaff.userId,
        set: { role, updatedAt: new Date() }
      })
      .returning();
    return { ...rows[0], email: found.email };
  },

  async remove(db: Db, userId: string) {
    const rows = await db.raw
      .delete(platformStaff)
      .where(eq(platformStaff.userId, userId))
      .returning();
    return rows[0];
  }
};

/** Every `/platform/*` handler calls this before responding (platform-admin.md §4). */
export const platformAuditLogsRepository = {
  async record(
    db: Db,
    entry: Omit<typeof platformAuditLogs.$inferInsert, "id" | "createdAt">
  ) {
    const rows = await db.raw
      .insert(platformAuditLogs)
      .values(entry)
      .returning();
    return rows[0];
  },

  /** Audit tab of the platform org-detail screen (platform-admin.md §11) — newest first, capped
   * for the same reason `auditLogsRepository.listRecent` is: no pagination UI for it yet. */
  listForOrg(db: Db, targetOrgId: string, limit = 100) {
    return db.raw
      .select()
      .from(platformAuditLogs)
      .where(eq(platformAuditLogs.targetOrgId, targetOrgId))
      .orderBy(desc(platformAuditLogs.createdAt))
      .limit(limit);
  }
};
