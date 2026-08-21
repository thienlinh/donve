import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { emailLogs } from "../schema/email.js";

/** Not org-scoped (no RLS, like `organizations`) — pre-org signup emails have `orgId: null`. */
export const emailLogsRepository = {
  async insert(db: Db, values: typeof emailLogs.$inferInsert) {
    const rows = await db.raw.insert(emailLogs).values(values).returning();
    return rows[0];
  },

  /** Cursor for periodic jobs (e.g. FR-I-03 lead digest) — latest send for one org+template. */
  async findLatestByOrgAndTemplate(db: Db, orgId: string, template: string) {
    const rows = await db.raw
      .select()
      .from(emailLogs)
      .where(and(eq(emailLogs.orgId, orgId), eq(emailLogs.template, template)))
      .orderBy(desc(emailLogs.createdAt))
      .limit(1);
    return rows[0];
  }
};
