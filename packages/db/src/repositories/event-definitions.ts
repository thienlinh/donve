import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope, withOrgScopeMulti } from "../org-scope.js";
import { eventDefinitions } from "../schema/tracking.js";

export const eventDefinitionsRepository = {
  async listByLandingPage(db: Db, orgId: string, landingPageId: string) {
    return withOrgScope<(typeof eventDefinitions.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(eventDefinitions)
          .where(
            and(
              eq(eventDefinitions.orgId, orgId),
              eq(eventDefinitions.landingPageId, landingPageId)
            )
          )
    );
  },

  /** Whole-registry replace for 1 landing page — only the current version's tracking events
   * matter, so old rows for this page are dropped first rather than accumulating across every
   * architecture/auto-fix round. 2 independent statements (delete has no read-dependency on
   * the insert), run under the same org scope via `withOrgScopeMulti` (plain `withOrgScope`
   * only ever issues 1 query). */
  async replaceForLandingPage(
    db: Db,
    orgId: string,
    landingPageId: string,
    rows: Omit<
      typeof eventDefinitions.$inferInsert,
      "orgId" | "id" | "landingPageId"
    >[]
  ) {
    await withOrgScopeMulti(db, orgId, (qb) => {
      const statements: unknown[] = [
        qb
          .delete(eventDefinitions)
          .where(
            and(
              eq(eventDefinitions.orgId, orgId),
              eq(eventDefinitions.landingPageId, landingPageId)
            )
          )
      ];
      if (rows.length > 0) {
        statements.push(
          qb
            .insert(eventDefinitions)
            .values(rows.map((row) => ({ ...row, orgId, landingPageId })))
        );
      }
      return statements;
    });
  }
};
