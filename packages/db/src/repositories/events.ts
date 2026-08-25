import { and, count, eq, gte, lt } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { events } from "../schema/analytics.js";
import { deployments } from "../schema/publishing.js";

export interface QueuedEventInput {
  orgId: string;
  campaignId: string | null;
  deploymentId: string | null;
  type: string;
  sessionHash: string | null;
  anonymousId: string | null;
  landingPageId: string | null;
  pageVersionId: string | null;
  meta: Record<string, unknown>;
}

export const eventsRepository = {
  /** Raw events for one campaign since a cutoff — bucketed into days at the call site (FR-C-05). */
  async listForCampaignSince(
    db: Db,
    orgId: string,
    campaignId: string,
    since: Date
  ) {
    return withOrgScope<(typeof events.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(events)
        .where(
          and(
            eq(events.orgId, orgId),
            eq(events.campaignId, campaignId),
            gte(events.createdAt, since)
          )
        )
    );
  },

  /** Raw events for one landing page since a cutoff — Optimization Agent's own analytics input
   * (`landingPageId` only lands on events fired since the tracking-and-attribution step, so a
   * page published before that has none here even with real `campaignId`-scoped traffic). */
  async listByLandingPageSince(
    db: Db,
    orgId: string,
    landingPageId: string,
    since: Date
  ) {
    return withOrgScope<(typeof events.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(events)
        .where(
          and(
            eq(events.orgId, orgId),
            eq(events.landingPageId, landingPageId),
            gte(events.createdAt, since)
          )
        )
    );
  },

  /**
   * FR-G-06 — bulk-inserts a CF Queue batch of beacon events. A batch can span multiple
   * orgs, so unlike `createOrgScopedRepository`'s single-row/single-org `insert`, this groups
   * rows by `orgId` first and does one multi-row insert per org (one `withOrgScope` call per
   * group, not per row) — see `apps/api/src/workers.ts`'s `queue()` consumer for the caller.
   */
  async insertBatch(db: Db, batch: QueuedEventInput[]): Promise<number> {
    const byOrg = new Map<string, QueuedEventInput[]>();
    for (const event of batch) {
      const group = byOrg.get(event.orgId);
      if (group) group.push(event);
      else byOrg.set(event.orgId, [event]);
    }

    const results = await Promise.all(
      Array.from(byOrg.entries()).map(([orgId, group]) =>
        withOrgScope<(typeof events.$inferSelect)[]>(db, orgId, (qb) =>
          qb
            .insert(events)
            .values(
              group.map((event) => ({
                orgId: event.orgId,
                campaignId: event.campaignId,
                deploymentId: event.deploymentId,
                type: event.type,
                sessionHash: event.sessionHash,
                anonymousId: event.anonymousId,
                landingPageId: event.landingPageId,
                pageVersionId: event.pageVersionId,
                meta: event.meta
              }))
            )
            .returning()
        )
      )
    );
    return results.reduce((sum, rows) => sum + rows.length, 0);
  },

  /** Server-side single-row write — no beacon/queue involved (`lead_created`,
   * `lead_stage_changed`: the offline conversion loop, `tracking-and-attribution.md`
   * §Conversion hierarchy). */
  async insert(db: Db, orgId: string, event: Omit<QueuedEventInput, "orgId">) {
    const rows = await withOrgScope<(typeof events.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .insert(events)
          .values({ ...event, orgId })
          .returning()
    );
    return rows[0];
  },

  /**
   * NFR-14 traffic-spike monitoring — per-hostname event counts (all beacon types) in
   * `[since, until)`, joined through `deployments` since `events.deploymentId` is the only
   * link back to a hostname. Cross-org by design, same reasoning as
   * `deploymentsRepository.listLiveAcrossOrgs` (no RLS to bypass, and a spike check has to
   * span every tenant, not one org at a time).
   */
  async countByHostnameInRange(
    db: Db,
    since: Date,
    until: Date
  ): Promise<{ hostname: string; count: number }[]> {
    const rows = await db.raw
      .select({ hostname: deployments.hostname, count: count() })
      .from(events)
      .innerJoin(deployments, eq(events.deploymentId, deployments.id))
      .where(and(gte(events.createdAt, since), lt(events.createdAt, until)))
      .groupBy(deployments.hostname);
    return rows;
  }
};
