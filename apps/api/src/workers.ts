import { eventsRepository, type QueuedEventInput } from "@dv/db";

import { createApp } from "./app.js";
import { runDataSubjectRequestSlaCheck } from "./lib/data-subject-request-sla.js";
import { createDbFromEnv } from "./lib/db.js";
import { runLeadDigest } from "./lib/lead-digest.js";
import { runLeadRetention } from "./lib/lead-retention.js";
import { log } from "./lib/logger.js";
import { reconcilePublishState } from "./lib/publish.js";
import { runTrafficSpikeCheck } from "./lib/traffic-spike.js";
import type { Bindings } from "./types.js";

/** One CF Queues message batch — shape produced by apps/edge-router/src/index.ts's beacon
 * handler (`QueuedEvent`), consumed here so FR-G-06's analytics actually reach Postgres
 * instead of being enqueued and never read (the gap this consumer closes). */
interface QueueMessage<T> {
  body: T;
  ack(): void;
  retry(): void;
}
interface MessageBatch<T> {
  messages: QueueMessage<T>[];
}

// Cloudflare Workers entrypoint — `Bindings` (apps/api/src/types.ts) is read
// from wrangler vars/secrets at request time via `c.env`, set up alongside
// the deploy config (docs/runbooks/prompt-playbook.md Phase 0 CI/CD step).
const app = createApp();

export default {
  fetch: app.fetch,
  /**
   * FR-G-06 — consumes the `EVENTS_QUEUE` batches apps/edge-router's beacon handler produces
   * (`queues.consumers` in wrangler.jsonc). Bun/VPS needs no equivalent: it never runs
   * edge-router in front of it (lib/publish.ts), so no events ever get queued there.
   * Per-message ack/retry (not batch-wide) so one bad message doesn't replay the whole batch.
   */
  async queue(batch: MessageBatch<QueuedEventInput>, env: Bindings) {
    const db = createDbFromEnv(env);
    try {
      await eventsRepository.insertBatch(
        db,
        batch.messages.map((message) => message.body)
      );
      for (const message of batch.messages) message.ack();
    } catch (err) {
      log("error", {
        requestId: "events-queue",
        orgId: null,
        message: "events batch insert failed, retrying",
        error: err instanceof Error ? err.message : String(err)
      });
      for (const message of batch.messages) message.retry();
    }
  },
  // Fired by `triggers.crons` in wrangler.jsonc — one Worker, three schedules
  // distinguished by `event.cron`.
  async scheduled(event: { cron: string }, env: Bindings) {
    if (event.cron === "0 * * * *") {
      // FR-I-03 lead digest.
      const result = await runLeadDigest(env);
      log("info", {
        requestId: "lead-digest",
        orgId: null,
        message: "lead digest run complete",
        ...result
      });
      return;
    }
    if (event.cron === "0 3 * * *") {
      // NFR-11 lead retention anonymize.
      const result = await runLeadRetention(env);
      log("info", {
        requestId: "lead-retention",
        orgId: null,
        message: "lead retention run complete",
        ...result
      });
      return;
    }
    if (event.cron === "0 8 * * *") {
      // NFR-10 data-subject-request SLA check.
      const result = await runDataSubjectRequestSlaCheck(env);
      log("info", {
        requestId: "data-subject-request-sla",
        orgId: null,
        message: "data subject request SLA check complete",
        ...result
      });
      return;
    }
    if (event.cron === "50 23 * * *") {
      // NFR-14 traffic-spike monitoring, late in the UTC day so "today" is nearly complete.
      const result = await runTrafficSpikeCheck(env);
      log("info", {
        requestId: "traffic-spike",
        orgId: null,
        message: "traffic spike check complete",
        ...result
      });
      return;
    }
    // Publish outbox reconciliation (architecture.md §5.2 "job reconciliation định kỳ").
    const result = await reconcilePublishState(env);
    log("info", {
      requestId: "reconcile",
      orgId: null,
      message: "reconciliation run complete",
      ...result
    });
  }
};
