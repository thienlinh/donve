import { and, asc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { sourceLinks } from "../schema/analytics.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(sourceLinks);

export const sourceLinksRepository = {
  ...base,

  async listForCampaign(db: Db, orgId: string, campaignId: string) {
    return withOrgScope<(typeof sourceLinks.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(sourceLinks)
        .where(
          and(
            eq(sourceLinks.orgId, orgId),
            eq(sourceLinks.campaignId, campaignId)
          )
        )
        .orderBy(asc(sourceLinks.createdAt))
    );
  },

  async findByCampaignAndKey(
    db: Db,
    orgId: string,
    campaignId: string,
    key: string
  ) {
    const rows = await withOrgScope<(typeof sourceLinks.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(sourceLinks)
          .where(
            and(
              eq(sourceLinks.orgId, orgId),
              eq(sourceLinks.campaignId, campaignId),
              eq(sourceLinks.key, key)
            )
          )
          .limit(1)
    );
    return rows[0];
  },

  /** Resolves a lead's raw `utm` object (snake_case `utm_source`/`utm_medium`/`utm_campaign`/
   * `utm_content` query params, see `utmFromLocation`) to the source link it was generated for,
   * if any — a lead's UTM not matching any created link (direct traffic, hand-typed campaign)
   * is a normal case, not an error, and the caller treats a missing row as `sourceLinkId: null`. */
  async findByCampaignAndUtm(
    db: Db,
    orgId: string,
    campaignId: string,
    utm: Record<string, string>
  ) {
    if (
      !utm.utm_source ||
      !utm.utm_medium ||
      !utm.utm_campaign ||
      !utm.utm_content
    ) {
      return undefined;
    }
    const rows = await withOrgScope<(typeof sourceLinks.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(sourceLinks)
          .where(
            and(
              eq(sourceLinks.orgId, orgId),
              eq(sourceLinks.campaignId, campaignId),
              eq(sourceLinks.utmSource, utm.utm_source!),
              eq(sourceLinks.utmMedium, utm.utm_medium!),
              eq(sourceLinks.utmCampaign, utm.utm_campaign!),
              eq(sourceLinks.utmContent, utm.utm_content!)
            )
          )
          .limit(1)
    );
    return rows[0];
  }
};
