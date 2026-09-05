import { trackEventsRequestSchema, usageSummarySchema } from "@dv/contracts";
import { appUsageEventsRepository } from "@dv/db";
import { Hono, type Context } from "hono";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import type { AppEnv } from "@/types.js";

export const telemetryRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

/** Fire-and-forget from `apps/donve/src/lib/telemetry.ts`'s `trackEvent()` — the client never
 * awaits or reacts to this response, so failures here must never surface as a user-visible
 * error anywhere else in the app. */
telemetryRoutes.post("/events", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const userId = c.get("userId");

  const body = trackEventsRequestSchema.parse(await c.req.json());
  const inserted = await appUsageEventsRepository.insertBatch(
    db,
    orgId,
    body.events.map((event) => ({
      userId,
      eventName: event.eventName,
      properties: event.properties
    }))
  );
  return c.json({ inserted });
});

const SUMMARY_WINDOW_DAYS = 30;

/** Last 30 days, bucketed in application code (same style as `campaigns/routes.ts`'s analytics
 * handler) — a single tenant's usage-event volume over 30 days is small enough that a SQL
 * `GROUP BY` would be premature. */
telemetryRoutes.get("/summary", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (SUMMARY_WINDOW_DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const rows = await appUsageEventsRepository.listSince(db, orgId, since);

  const byDate = new Map<string, number>();
  for (let i = 0; i < SUMMARY_WINDOW_DAYS; i++) {
    const day = new Date(since);
    day.setUTCDate(day.getUTCDate() + i);
    byDate.set(day.toISOString().slice(0, 10), 0);
  }
  const byEvent = new Map<string, number>();

  for (const row of rows) {
    const dateKey = row.createdAt.toISOString().slice(0, 10);
    if (byDate.has(dateKey))
      byDate.set(dateKey, (byDate.get(dateKey) ?? 0) + 1);
    byEvent.set(row.eventName, (byEvent.get(row.eventName) ?? 0) + 1);
  }

  const days = Array.from(byDate.entries()).map(([date, count]) => ({
    date,
    count
  }));
  const eventList = Array.from(byEvent.entries())
    .map(([eventName, count]) => ({ eventName, count }))
    .toSorted((a, b) => b.count - a.count);

  return c.json(
    usageSummarySchema.parse({
      days,
      totalEvents: rows.length,
      byEvent: eventList
    })
  );
});
