import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { payments } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(payments);

export const paymentsRepository = {
  ...base,

  async findByProviderTx(
    db: Db,
    orgId: string,
    provider: string,
    providerTxId: string
  ) {
    const rows = await withOrgScope<(typeof payments.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(payments)
          .where(
            and(
              eq(payments.orgId, orgId),
              eq(payments.provider, provider),
              eq(payments.providerTxId, providerTxId)
            )
          )
          .limit(1)
    );
    return rows[0];
  },

  /** Latest recorded payment for an order — FR-D-11 seeds `refundRequests.paymentId`/`remitterInfo` from it. */
  async findLatestForOrder(db: Db, orgId: string, orderId: string) {
    const rows = await withOrgScope<(typeof payments.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(payments)
          .where(and(eq(payments.orgId, orgId), eq(payments.orderId, orderId)))
          .orderBy(desc(payments.createdAt))
          .limit(1)
    );
    return rows[0];
  }
};
