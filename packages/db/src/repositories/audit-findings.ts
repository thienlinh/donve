import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { auditFindings } from "../schema/quality.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(auditFindings);

export const auditFindingsRepository = {
  ...base,

  async listByAuditRun(db: Db, orgId: string, auditRunId: string) {
    return withOrgScope<(typeof auditFindings.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(auditFindings)
          .where(
            and(
              eq(auditFindings.orgId, orgId),
              eq(auditFindings.auditRunId, auditRunId)
            )
          )
    );
  },

  /** One audit run typically produces several findings at once — a single multi-row insert
   * instead of N sequential `insert()` calls. */
  async insertMany(
    db: Db,
    orgId: string,
    rows: Omit<typeof auditFindings.$inferInsert, "orgId" | "id">[]
  ) {
    if (rows.length === 0) return [];
    return withOrgScope<(typeof auditFindings.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .insert(auditFindings)
          .values(rows.map((row) => ({ ...row, orgId })))
          .returning()
    );
  }
};
