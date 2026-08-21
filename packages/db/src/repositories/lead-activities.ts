import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { leadActivities } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(leadActivities);

export const leadActivitiesRepository = {
  ...base,

  /** Timeline for one lead, newest first (FR-E-03).
   * ponytail: capped at the 200 most recent entries — same reasoning as the other
   * unbounded-list caps in this package; a lead with a longer history wants a
   * "load more"/dedicated timeline page, not this detail-sheet call growing unbounded. */
  async listForLead(db: Db, orgId: string, leadId: string) {
    return withOrgScope<(typeof leadActivities.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(leadActivities)
          .where(
            and(
              eq(leadActivities.orgId, orgId),
              eq(leadActivities.leadId, leadId)
            )
          )
          .orderBy(desc(leadActivities.createdAt))
          .limit(200)
    );
  }
};
