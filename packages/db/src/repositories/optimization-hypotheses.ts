import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { optimizationHypotheses } from "../schema/optimization.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(optimizationHypotheses);

export const optimizationHypothesesRepository = {
  ...base,

  /** Newest first. */
  async listByLandingPage(db: Db, orgId: string, landingPageId: string) {
    return withOrgScope<(typeof optimizationHypotheses.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(optimizationHypotheses)
          .where(
            and(
              eq(optimizationHypotheses.orgId, orgId),
              eq(optimizationHypotheses.landingPageId, landingPageId)
            )
          )
          .orderBy(desc(optimizationHypotheses.createdAt))
    );
  }
};
