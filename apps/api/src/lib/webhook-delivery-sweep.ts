import { webhookDeliveryFailuresRepository } from "@dv/db";

import { ingestWebhookLead } from "../modules/leads/webhooks.js";
import type { Bindings } from "../types.js";
import { createDbFromEnv } from "./db.js";
import { log } from "./logger.js";

/** After this many failed retries a row moves to `dead_letter` — it stops being retried
 * automatically and needs a human to look at `lastError` (or the campaign/lead data has
 * genuinely gone stale, e.g. the campaign was deleted after the webhook fired). */
const MAX_ATTEMPTS = 5;

/**
 * Retry/dead-letter sweep for webhook lead ingestion (lead-integrations.md's documented gap).
 * Every 15 minutes, re-runs `ingestWebhookLead` for every org's `pending` capture — same
 * pending/resolve/dead-letter shape as `reconcilePublishState` (apps/api/src/lib/publish.ts)
 * and the same "sweep runs outside any tenant session" reasoning as `runLeadSlaSweep`.
 */
export async function runWebhookDeliverySweep(env: Bindings): Promise<{
  processed: number;
  resolved: number;
  deadLettered: number;
  stillPending: number;
}> {
  const db = createDbFromEnv(env);
  const pending =
    await webhookDeliveryFailuresRepository.listPendingAcrossOrgs(db);

  // Each row's retry only reads/writes its own lead + its own delivery-failure row — safe to
  // run concurrently across rows, same reasoning as `lead-sla-sweep.ts`'s per-lead `Promise.all`.
  const outcomes = await Promise.all(
    pending.map(
      async (row): Promise<"resolved" | "dead_letter" | "pending"> => {
        try {
          await ingestWebhookLead(
            env,
            row.orgId,
            row.campaignId,
            row.source,
            row.payload as {
              fullName: string;
              phone: string;
              email: string | null;
              customFields: Record<string, unknown>;
            }
          );
          await webhookDeliveryFailuresRepository.markResolved(db, row.id);
          return "resolved";
        } catch (err) {
          const attempts = row.attempts + 1;
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (attempts >= MAX_ATTEMPTS) {
            await webhookDeliveryFailuresRepository.markDeadLetter(
              db,
              row.id,
              errorMessage,
              attempts
            );
            log("error", {
              requestId: "webhook-delivery-sweep",
              orgId: row.orgId,
              message: "webhook delivery failure moved to dead letter",
              rowId: row.id,
              attempts,
              error: errorMessage
            });
            return "dead_letter";
          }
          await webhookDeliveryFailuresRepository.recordAttemptFailure(
            db,
            row.id,
            errorMessage,
            attempts
          );
          return "pending";
        }
      }
    )
  );

  return {
    processed: pending.length,
    resolved: outcomes.filter((o) => o === "resolved").length,
    deadLettered: outcomes.filter((o) => o === "dead_letter").length,
    stillPending: outcomes.filter((o) => o === "pending").length
  };
}
