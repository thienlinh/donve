import type { Bindings } from "../types.js";
import { createRealtimeFromEnv } from "./cache.js";
import { log } from "./logger.js";

/**
 * Every caller of `publishOrderUpdate`/`publishNewLeads` sits on a critical path (webhook
 * payment confirmation, order status changes, lead creation/import) and already committed the
 * real database write before reaching this call — the realtime bell/SSE push is a nice-to-have
 * notification on top, not a condition of success. Found live: with the pub/sub store
 * unreachable or misconfigured, the driver throws and — since every call site does a bare
 * `await publish...(...)` with no try/catch — that took down the entire request with a 500,
 * discarding a write that had already succeeded. Swallowing (and logging) the error here once
 * fixes every call site at once, instead of wrapping each of the 6+ callers individually.
 */
async function publishBestEffort(
  channel: string,
  payload: unknown,
  env: Bindings
): Promise<void> {
  try {
    const driver = createRealtimeFromEnv(env);
    await driver.publish(channel, payload);
  } catch (err) {
    log("warn", {
      requestId: "realtime",
      orgId: null,
      message: "realtime publish failed, continuing without it",
      channel,
      error: err instanceof Error ? err.message : String(err)
    });
  }
}

/** architecture.md §5.3: dashboard SSE hub, fed by this channel per org. */
export function orderStreamChannel(orgId: string): string {
  return `org:${orgId}:orders`;
}

export function publishOrderUpdate(
  env: Bindings,
  orgId: string,
  order: { id: string; code: string; status: string; campaignId: string }
): Promise<void> {
  return publishBestEffort(orderStreamChannel(orgId), order, env);
}

/** module E finding #4: in-app realtime bell, fed by this channel per org. One event per
 * newly-created lead — a CSV import batches its rows into a single `count`-sized event
 * instead of one per row, so a 500-row import doesn't spam the bell. */
export function leadStreamChannel(orgId: string): string {
  return `org:${orgId}:leads`;
}

export function publishNewLeads(
  env: Bindings,
  orgId: string,
  count: number
): Promise<void> {
  return publishBestEffort(
    leadStreamChannel(orgId),
    { count, at: new Date().toISOString() },
    env
  );
}
