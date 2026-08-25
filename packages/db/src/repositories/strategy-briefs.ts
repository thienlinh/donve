import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { strategyBriefs } from "../schema/business.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(strategyBriefs);

export const strategyBriefsRepository = {
  ...base,

  /** One `strategyBriefs` row per landing page (`uq_strategy_brief_landing_page`). */
  async findByLandingPage(db: Db, orgId: string, landingPageId: string) {
    const rows = await withOrgScope<(typeof strategyBriefs.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(strategyBriefs)
          .where(
            and(
              eq(strategyBriefs.orgId, orgId),
              eq(strategyBriefs.landingPageId, landingPageId)
            )
          )
          .limit(1)
    );
    return rows[0];
  }
};
