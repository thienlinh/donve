import { and, eq, gte } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { appUsageEvents } from "../schema/tracking.js";

export interface AppUsageEventInput {
  userId: string;
  eventName: string;
  properties?: Record<string, unknown>;
}

export const appUsageEventsRepository = {
  /** One row per event in the batch — `trackEvent()` on the client sends one call per event
   * (fire-and-forget, `fetch(..., { keepalive: true })`), but the endpoint itself accepts a
   * batch so a future caller that already has several events queued isn't forced into N
   * round-trips. */
  async insertBatch(
    db: Db,
    orgId: string,
    events: AppUsageEventInput[]
  ): Promise<number> {
    if (events.length === 0) return 0;
    const rows = await withOrgScope<(typeof appUsageEvents.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .insert(appUsageEvents)
          .values(
            events.map((event) => ({
              orgId,
              userId: event.userId,
              eventName: event.eventName,
              properties: event.properties ?? {}
            }))
          )
          .returning()
    );
    return rows.length;
  },

  /** Raw rows since a cutoff — bucketed into days/event names at the call site, same style as
   * `campaigns/routes.ts`'s analytics handler (in-app-code bucketing over a small, time-bounded
   * row set rather than a SQL `GROUP BY`). */
  async listSince(db: Db, orgId: string, since: Date) {
    return withOrgScope<(typeof appUsageEvents.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(appUsageEvents)
          .where(
            and(
              eq(appUsageEvents.orgId, orgId),
              gte(appUsageEvents.createdAt, since)
            )
          )
    );
  }
};
