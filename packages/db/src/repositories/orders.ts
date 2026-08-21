import { and, desc, eq, gte, ilike, inArray, or } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { leads, orders } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(orders);

export const ordersRepository = {
  ...base,

  async findByCode(db: Db, orgId: string, code: string) {
    const rows = await withOrgScope<(typeof orders.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(orders)
          .where(and(eq(orders.orgId, orgId), eq(orders.code, code)))
          .limit(1)
    );
    return rows[0];
  },

  /** Orders for one lead, newest first (FR-E-03 lead detail). */
  async listForLead(db: Db, orgId: string, leadId: string) {
    return withOrgScope<(typeof orders.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(orders)
        .where(and(eq(orders.orgId, orgId), eq(orders.leadId, leadId)))
        .orderBy(desc(orders.createdAt))
    );
  },

  /** Orders + lead info for a set of ids, for FR-D-09's ranked candidate picker. Order is not
   * guaranteed to match `ids` — the caller re-sorts by its own ranking (`candidateOrderIds`). */
  async findCandidatesByIds(db: Db, orgId: string, ids: string[]) {
    if (ids.length === 0) return [];
    return withOrgScope<
      {
        orderId: string;
        code: string;
        amount: string;
        leadFullName: string;
        leadPhone: string;
      }[]
    >(db, orgId, (qb) =>
      qb
        .select({
          orderId: orders.id,
          code: orders.code,
          amount: orders.amount,
          leadFullName: leads.fullName,
          leadPhone: leads.phone
        })
        .from(orders)
        .innerJoin(leads, eq(leads.id, orders.leadId))
        .where(and(eq(orders.orgId, orgId), inArray(orders.id, ids)))
    );
  },

  /** Manual order-attach picker for `no_candidate` unmatched transactions (FR-D-09) — matched by
   * order code or lead phone, capped since it's a type-ahead search, not a listing. */
  async search(db: Db, orgId: string, query: string) {
    const term = `%${query}%`;
    return withOrgScope<
      {
        orderId: string;
        code: string;
        amount: string;
        leadFullName: string;
        leadPhone: string;
      }[]
    >(db, orgId, (qb) =>
      qb
        .select({
          orderId: orders.id,
          code: orders.code,
          amount: orders.amount,
          leadFullName: leads.fullName,
          leadPhone: leads.phone
        })
        .from(orders)
        .innerJoin(leads, eq(leads.id, orders.leadId))
        .where(
          and(
            eq(orders.orgId, orgId),
            // oxlint-disable-next-line no-non-null-assertion -- `or()` with 2 args always returns a SQL node
            or(ilike(orders.code, term), ilike(leads.phone, term))
          )
        )
        .limit(20)
    );
  },

  /** Orders for one campaign since a cutoff — bucketed into days at the call site (FR-C-05). */
  async listForCampaignSince(
    db: Db,
    orgId: string,
    campaignId: string,
    since: Date
  ) {
    return withOrgScope<(typeof orders.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.orgId, orgId),
            eq(orders.campaignId, campaignId),
            gte(orders.createdAt, since)
          )
        )
    );
  }
};
