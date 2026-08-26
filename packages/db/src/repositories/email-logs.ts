import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { emailLogs } from "../schema/email.js";

/**
 * `emailLogs.orgId` is nullable by design — pre-org signup/verification emails have
 * `orgId: null`. The table carries `orgIsolationOrNullPolicy()` (schema/rls.ts), which lets a
 * NULL-org row through with no scope set, but still enforces the normal org match once `orgId`
 * is set — so an org-scoped write/read here must still go through `withOrgScope`.
 */
export const emailLogsRepository = {
  async insert(db: Db, values: typeof emailLogs.$inferInsert) {
    if (values.orgId) {
      const rows = await withOrgScope<(typeof emailLogs.$inferSelect)[]>(
        db,
        values.orgId,
        (qb) => qb.insert(emailLogs).values(values).returning()
      );
      return rows[0];
    }
    const rows = await db.raw.insert(emailLogs).values(values).returning();
    return rows[0];
  },

  /** Cursor for periodic jobs (e.g. FR-I-03 lead digest) — latest send for one org+template. */
  async findLatestByOrgAndTemplate(db: Db, orgId: string, template: string) {
    const rows = await withOrgScope<(typeof emailLogs.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(emailLogs)
          .where(
            and(eq(emailLogs.orgId, orgId), eq(emailLogs.template, template))
          )
          .orderBy(desc(emailLogs.createdAt))
          .limit(1)
    );
    return rows[0];
  }
};
