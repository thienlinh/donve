import { and, eq, inArray } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { campaignProducts } from "../schema/catalog.js";

export const campaignProductsRepository = {
  async listForCampaign(db: Db, orgId: string, campaignId: string) {
    return withOrgScope<(typeof campaignProducts.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(campaignProducts)
          .where(
            and(
              eq(campaignProducts.orgId, orgId),
              eq(campaignProducts.campaignId, campaignId)
            )
          )
    );
  },

  /** Same as `listForCampaign` but for many campaigns in one query — used by the campaign list
   * route to avoid one `listForCampaign` round trip per row (N+1). */
  async listForCampaigns(db: Db, orgId: string, campaignIds: string[]) {
    if (campaignIds.length === 0) return [];
    return withOrgScope<(typeof campaignProducts.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(campaignProducts)
          .where(
            and(
              eq(campaignProducts.orgId, orgId),
              inArray(campaignProducts.campaignId, campaignIds)
            )
          )
    );
  },

  /**
   * Replaces the full product set for a campaign. Two sequential statements, not one atomic
   * CTE like ai-credits.ts — this join table isn't a financial path, so a delete that
   * succeeds and an insert that fails (recoverable by re-saving the form) is an acceptable
   * trade for staying simple.
   */
  async setForCampaign(
    db: Db,
    orgId: string,
    campaignId: string,
    productIds: string[]
  ) {
    await withOrgScope(db, orgId, (qb) =>
      qb
        .delete(campaignProducts)
        .where(
          and(
            eq(campaignProducts.orgId, orgId),
            eq(campaignProducts.campaignId, campaignId)
          )
        )
    );
    if (productIds.length === 0) return;
    await withOrgScope(db, orgId, (qb) =>
      qb
        .insert(campaignProducts)
        .values(
          productIds.map((productId) => ({ campaignId, productId, orgId }))
        )
    );
  }
};
