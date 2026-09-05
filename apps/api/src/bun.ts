import { createApp } from "./app.js";
import { runDataSubjectRequestSlaCheck } from "./lib/data-subject-request-sla.js";
import { runLeadDigest } from "./lib/lead-digest.js";
import { runLeadRetention } from "./lib/lead-retention.js";
import { runLeadSlaSweep } from "./lib/lead-sla-sweep.js";
import { log } from "./lib/logger.js";
import { reconcilePublishState } from "./lib/publish.js";
import { runTrafficSpikeCheck } from "./lib/traffic-spike.js";
import { runWebhookDeliverySweep } from "./lib/webhook-delivery-sweep.js";
import { requiredBindingsSchema, type Bindings } from "./types.js";

const bindings: Bindings = {
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL ?? "",
  UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
  BETTER_AUTH_URL:
    process.env.BETTER_AUTH_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`,
  APP_URL: process.env.APP_URL ?? "http://localhost:5173",
  RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
  RUNTIME: "bun",
  LOCAL_STORAGE_DIR: process.env.LOCAL_STORAGE_DIR,
  LOCAL_REDIS_URL: process.env.LOCAL_REDIS_URL,
  AI_KEY_MASTER_SECRET: process.env.AI_KEY_MASTER_SECRET ?? "",
  PAYMENTS_KEY_MASTER_SECRET: process.env.PAYMENTS_KEY_MASTER_SECRET ?? "",
  WEBHOOK_KEY_MASTER_SECRET: process.env.WEBHOOK_KEY_MASTER_SECRET ?? "",
  NOTIFY_KEY_MASTER_SECRET: process.env.NOTIFY_KEY_MASTER_SECRET,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ?? "",
  TURNSTILE_SITE_KEY:
    process.env.TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",
  PLATFORM_OPENROUTER_API_KEY: process.env.PLATFORM_OPENROUTER_API_KEY ?? "",
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
  PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  PUBLISH_BASE_DOMAIN: process.env.PUBLISH_BASE_DOMAIN ?? "donve.vn",
  LOCAL_DEPLOYMENTS_DIR: process.env.LOCAL_DEPLOYMENTS_DIR,
  CF_API_TOKEN: process.env.CF_API_TOKEN,
  CF_ZONE_ID: process.env.CF_ZONE_ID,
  CF_CUSTOM_DOMAIN_TARGET: process.env.CF_CUSTOM_DOMAIN_TARGET,
  FOUNDER_ALERT_EMAIL: process.env.FOUNDER_ALERT_EMAIL,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  ZALO_OA_SECRET: process.env.ZALO_OA_SECRET
};

const requiredCheck = requiredBindingsSchema.safeParse(bindings);
if (!requiredCheck.success) {
  console.error(
    "Missing required env var(s):",
    requiredCheck.error.issues.map((issue) => issue.path.join(".")).join(", ")
  );
  process.exit(1);
}

const app = createApp();

// CF Workers gets `wrangler.jsonc`'s `triggers.crons` (workers.ts's `scheduled` export);
// Bun/VPS has no such trigger source, so it self-schedules the same reconciliation job here
// (architecture.md §5.2 "job reconciliation định kỳ", mỗi 5 phút).
setInterval(
  () => {
    reconcilePublishState(bindings).catch((err: unknown) => {
      log("error", {
        requestId: "reconcile",
        orgId: null,
        message: "reconciliation run failed",
        error: err instanceof Error ? err.message : String(err)
      });
    });
  },
  5 * 60 * 1000
);

// CF Workers gets the "0 * * * *" entry in wrangler.jsonc's `triggers.crons`
// (workers.ts's `scheduled` export); Bun/VPS self-schedules the same FR-I-03 lead digest
// here, hourly.
setInterval(
  () => {
    runLeadDigest(bindings)
      .then((result) => {
        log("info", {
          requestId: "lead-digest",
          orgId: null,
          message: "lead digest run complete",
          ...result
        });
      })
      .catch((err: unknown) => {
        log("error", {
          requestId: "lead-digest",
          orgId: null,
          message: "lead digest run failed",
          error: err instanceof Error ? err.message : String(err)
        });
      });
  },
  60 * 60 * 1000
);

// CF Workers gets the "*/30 * * * *" entry in wrangler.jsonc's `triggers.crons`
// (workers.ts's `scheduled` export); Bun/VPS self-schedules the same assignment-rules
// SLA-breach sweep here, every 30 minutes (SLA is measured in hours, so this cadence is
// plenty — not a near-realtime alert path).
setInterval(
  () => {
    runLeadSlaSweep(bindings)
      .then((result) => {
        log("info", {
          requestId: "lead-sla-sweep",
          orgId: null,
          message: "lead SLA sweep run complete",
          ...result
        });
      })
      .catch((err: unknown) => {
        log("error", {
          requestId: "lead-sla-sweep",
          orgId: null,
          message: "lead SLA sweep run failed",
          error: err instanceof Error ? err.message : String(err)
        });
      });
  },
  30 * 60 * 1000
);

// CF Workers gets the "0 3 * * *" entry in wrangler.jsonc's `triggers.crons`
// (workers.ts's `scheduled` export); Bun/VPS self-schedules the same NFR-11 lead
// retention anonymize job here, daily.
setInterval(
  () => {
    runLeadRetention(bindings)
      .then((result) => {
        log("info", {
          requestId: "lead-retention",
          orgId: null,
          message: "lead retention run complete",
          ...result
        });
      })
      .catch((err: unknown) => {
        log("error", {
          requestId: "lead-retention",
          orgId: null,
          message: "lead retention run failed",
          error: err instanceof Error ? err.message : String(err)
        });
      });
  },
  24 * 60 * 60 * 1000
);

// CF Workers gets the "0 8 * * *" entry in wrangler.jsonc's `triggers.crons` (workers.ts's
// `scheduled` export); Bun/VPS self-schedules the same NFR-10 data-subject-request SLA
// check here, daily.
setInterval(
  () => {
    runDataSubjectRequestSlaCheck(bindings)
      .then((result) => {
        log("info", {
          requestId: "data-subject-request-sla",
          orgId: null,
          message: "data subject request SLA check complete",
          ...result
        });
      })
      .catch((err: unknown) => {
        log("error", {
          requestId: "data-subject-request-sla",
          orgId: null,
          message: "data subject request SLA check failed",
          error: err instanceof Error ? err.message : String(err)
        });
      });
  },
  24 * 60 * 60 * 1000
);

// CF Workers gets the "50 23 * * *" entry in wrangler.jsonc's `triggers.crons` (workers.ts's
// `scheduled` export); Bun/VPS self-schedules the same NFR-14 traffic-spike check here, daily.
setInterval(
  () => {
    runTrafficSpikeCheck(bindings)
      .then((result) => {
        log("info", {
          requestId: "traffic-spike",
          orgId: null,
          message: "traffic spike check complete",
          ...result
        });
      })
      .catch((err: unknown) => {
        log("error", {
          requestId: "traffic-spike",
          orgId: null,
          message: "traffic spike check failed",
          error: err instanceof Error ? err.message : String(err)
        });
      });
  },
  24 * 60 * 60 * 1000
);

// CF Workers gets the "*/15 * * * *" entry in wrangler.jsonc's `triggers.crons`
// (workers.ts's `scheduled` export); Bun/VPS self-schedules the same webhook delivery
// retry/dead-letter sweep here, every 15 minutes.
setInterval(
  () => {
    runWebhookDeliverySweep(bindings)
      .then((result) => {
        log("info", {
          requestId: "webhook-delivery-sweep",
          orgId: null,
          message: "webhook delivery sweep run complete",
          ...result
        });
      })
      .catch((err: unknown) => {
        log("error", {
          requestId: "webhook-delivery-sweep",
          orgId: null,
          message: "webhook delivery sweep run failed",
          error: err instanceof Error ? err.message : String(err)
        });
      });
  },
  15 * 60 * 1000
);
const port = Number(process.env.PORT ?? 3000);

Bun.serve({
  port,
  // Default 10s idle timeout kills the SSE routes (leads/routes.ts `/stream`,
  // `/orders/stream`) that intentionally stay open with no traffic between events. 255 is
  // Bun's max (uint8) — past that the client's EventSource auto-reconnects, same as it
  // already does on any network blip.
  idleTimeout: 255,
  fetch: (request) => app.fetch(request, bindings)
});

log("info", {
  requestId: "startup",
  orgId: null,
  message: `api listening on :${port}`
});
