import { and, eq, inArray } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { fulfillmentTasks } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(fulfillmentTasks);

type TaskInsert = typeof fulfillmentTasks.$inferInsert;

export const fulfillmentTasksRepository = {
  ...base,

  async findForOrder(db: Db, orgId: string, orderId: string) {
    return withOrgScope<(typeof fulfillmentTasks.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(fulfillmentTasks)
          .where(
            and(
              eq(fulfillmentTasks.orgId, orgId),
              eq(fulfillmentTasks.orderId, orderId)
            )
          )
          .limit(1)
    ).then((rows) => rows[0]);
  },

  /** Race-safe creation: a paid order can trigger this from webhook and UI concurrently. */
  async ensureForOrder(
    db: Db,
    orgId: string,
    values: Omit<TaskInsert, "orgId" | "id">
  ) {
    const rows = await withOrgScope<(typeof fulfillmentTasks.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .insert(fulfillmentTasks)
          .values({ ...values, orgId })
          .onConflictDoNothing({
            target: [fulfillmentTasks.orgId, fulfillmentTasks.orderId]
          })
          .returning()
    );
    return rows[0] ?? this.findForOrder(db, orgId, values.orderId);
  },

  async claimForExecution(db: Db, orgId: string, id: string, attempts: number) {
    const rows = await withOrgScope<(typeof fulfillmentTasks.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .update(fulfillmentTasks)
          .set({ status: "processing", attempts, lastError: null })
          .where(
            and(
              eq(fulfillmentTasks.orgId, orgId),
              eq(fulfillmentTasks.id, id),
              inArray(fulfillmentTasks.status, ["pending", "failed"])
            )
          )
          .returning()
    );
    return rows[0];
  },

  async markProcessing(db: Db, orgId: string, id: string, attempts: number) {
    return base.update(db, orgId, id, {
      status: "processing",
      attempts,
      lastError: null
    });
  },

  async markCompleted(db: Db, orgId: string, id: string) {
    return base.update(db, orgId, id, {
      status: "completed",
      completedAt: new Date(),
      lastError: null
    });
  },

  async markFailed(db: Db, orgId: string, id: string, lastError: string) {
    return base.update(db, orgId, id, {
      status: "failed",
      lastError
    });
  }
};
