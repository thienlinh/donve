import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { leads, orders, refundRequests } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(refundRequests);

type RefundRequestWithOrderRow = typeof refundRequests.$inferSelect & {
  orderCode: string;
  leadFullName: string;
  leadPhone: string;
};

const WITH_ORDER_COLUMNS = {
  id: refundRequests.id,
  orgId: refundRequests.orgId,
  orderId: refundRequests.orderId,
  paymentId: refundRequests.paymentId,
  reason: refundRequests.reason,
  amount: refundRequests.amount,
  remitterInfo: refundRequests.remitterInfo,
  status: refundRequests.status,
  evidenceKey: refundRequests.evidenceKey,
  createdBy: refundRequests.createdBy,
  createdAt: refundRequests.createdAt,
  completedAt: refundRequests.completedAt,
  orderCode: orders.code,
  leadFullName: leads.fullName,
  leadPhone: leads.phone
};

export const refundRequestsRepository = {
  ...base,

  /** FR-D-12 checklist screen + CRM duplicate-payment badge (FR-D-14), newest first. */
  async listForOrder(db: Db, orgId: string, orderId: string) {
    return withOrgScope<(typeof refundRequests.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(refundRequests)
          .where(
            and(
              eq(refundRequests.orgId, orgId),
              eq(refundRequests.orderId, orderId)
            )
          )
          .orderBy(desc(refundRequests.createdAt))
    );
  },

  /** Org-wide refund-requests screen, optionally filtered by status, joined with the order/lead
   * info the list needs (`orderCode`/`leadFullName`/`leadPhone`), newest first. */
  async listWithOrder(
    db: Db,
    orgId: string,
    status?: (typeof refundRequests.$inferSelect)["status"]
  ) {
    return withOrgScope<RefundRequestWithOrderRow[]>(db, orgId, (qb) =>
      qb
        .select(WITH_ORDER_COLUMNS)
        .from(refundRequests)
        .innerJoin(orders, eq(orders.id, refundRequests.orderId))
        .innerJoin(leads, eq(leads.id, orders.leadId))
        .where(
          status
            ? and(
                eq(refundRequests.orgId, orgId),
                eq(refundRequests.status, status)
              )
            : eq(refundRequests.orgId, orgId)
        )
        .orderBy(desc(refundRequests.createdAt))
    );
  },

  /** Single refund request + order/lead info for the detail screen. */
  async findByIdWithOrder(db: Db, orgId: string, id: string) {
    const rows = await withOrgScope<RefundRequestWithOrderRow[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select(WITH_ORDER_COLUMNS)
          .from(refundRequests)
          .innerJoin(orders, eq(orders.id, refundRequests.orderId))
          .innerJoin(leads, eq(leads.id, orders.leadId))
          .where(
            and(eq(refundRequests.orgId, orgId), eq(refundRequests.id, id))
          )
          .limit(1)
    );
    return rows[0];
  }
};
