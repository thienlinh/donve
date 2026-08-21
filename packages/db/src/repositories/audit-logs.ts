import { desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { auditLogs } from "../schema/core.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(auditLogs);

export const auditLogsRepository = {
  ...base,
  /** FR-A-05 audit log UI — most recent first, capped since this table has no UI pagination yet. */
  async listRecent(db: Db, orgId: string, limit = 200) {
    return withOrgScope<(typeof auditLogs.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.orgId, orgId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
    );
  }
};
