import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { auditRuns } from "../schema/quality.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(auditRuns);

export const auditRunsRepository = {
  ...base,

  /** Newest first — `[0]` is "the latest audit" everywhere this is called. */
  async listByLandingPage(db: Db, orgId: string, landingPageId: string) {
    return withOrgScope<(typeof auditRuns.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(auditRuns)
        .where(
          and(
            eq(auditRuns.orgId, orgId),
            eq(auditRuns.landingPageId, landingPageId)
          )
        )
        .orderBy(desc(auditRuns.createdAt))
    );
  }
};
