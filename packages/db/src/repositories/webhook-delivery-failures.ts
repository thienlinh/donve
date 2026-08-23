import { eq, inArray } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { webhookDeliveryFailures } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(webhookDeliveryFailures);

export const webhookDeliveryFailuresRepository = {
  ...base,

  /**
   * Cross-org read for `runWebhookDeliverySweep` (apps/api/src/lib/webhook-delivery-sweep.ts) —
   * that job runs outside any tenant session, same reasoning as
   * `publishOutboxRepository.listPendingAcrossOrgs`.
   */
  async listPendingAcrossOrgs(db: Db) {
    return db.raw
      .select()
      .from(webhookDeliveryFailures)
      .where(inArray(webhookDeliveryFailures.status, ["pending"]));
  },

  async markResolved(db: Db, id: string) {
    await db.raw
      .update(webhookDeliveryFailures)
      .set({ status: "resolved", resolvedAt: new Date() })
      .where(eq(webhookDeliveryFailures.id, id));
  },

  /** Attempt failed but hasn't hit the retry ceiling yet — bump the counter and keep retrying. */
  async recordAttemptFailure(
    db: Db,
    id: string,
    error: string,
    attempts: number
  ) {
    await db.raw
      .update(webhookDeliveryFailures)
      .set({ attempts, lastError: error, lastAttemptAt: new Date() })
      .where(eq(webhookDeliveryFailures.id, id));
  },

  async markDeadLetter(db: Db, id: string, error: string, attempts: number) {
    await db.raw
      .update(webhookDeliveryFailures)
      .set({
        status: "dead_letter",
        attempts,
        lastError: error,
        lastAttemptAt: new Date()
      })
      .where(eq(webhookDeliveryFailures.id, id));
  }
};
