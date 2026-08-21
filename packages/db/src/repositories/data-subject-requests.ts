import { and, asc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { dataSubjectRequests } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(dataSubjectRequests);

export const dataSubjectRequestsRepository = {
  ...base,

  /** Lead-detail-sheet view (NFR-10), newest first. */
  async listForLead(db: Db, orgId: string, leadId: string) {
    return withOrgScope<(typeof dataSubjectRequests.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(dataSubjectRequests)
          .where(
            and(
              eq(dataSubjectRequests.orgId, orgId),
              eq(dataSubjectRequests.leadId, leadId)
            )
          )
          .orderBy(asc(dataSubjectRequests.dueAt))
    );
  },

  /** Org-wide summary (dashboard indicator + the org-level GET), soonest-due first. */
  async listByStatus(
    db: Db,
    orgId: string,
    status?: (typeof dataSubjectRequests.$inferSelect)["status"]
  ) {
    return withOrgScope<(typeof dataSubjectRequests.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(dataSubjectRequests)
          .where(
            status
              ? and(
                  eq(dataSubjectRequests.orgId, orgId),
                  eq(dataSubjectRequests.status, status)
                )
              : eq(dataSubjectRequests.orgId, orgId)
          )
          .orderBy(asc(dataSubjectRequests.dueAt))
    );
  },

  /** SLA alert job — all still-`pending` requests in this org, regardless of due date; the
   * job itself filters to overdue/due-within-24h so it stays a single per-org query. */
  async listPending(db: Db, orgId: string) {
    return withOrgScope<(typeof dataSubjectRequests.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(dataSubjectRequests)
          .where(
            and(
              eq(dataSubjectRequests.orgId, orgId),
              eq(dataSubjectRequests.status, "pending")
            )
          )
          .orderBy(asc(dataSubjectRequests.dueAt))
    );
  },

  async complete(db: Db, orgId: string, id: string) {
    return base.update(db, orgId, id, {
      status: "completed",
      resolvedAt: new Date()
    });
  }
};
