import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { tiktokConnections } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(tiktokConnections);

export const tiktokConnectionsRepository = {
  ...base,

  /** `/webhooks/tiktok-leads` looks this up by `(orgId, campaignId)` before verifying the
   * signature — no session there, same shape as `webhookCredentialsRepository.findByOrgAndProvider`. */
  async findByOrgAndCampaign(db: Db, orgId: string, campaignId: string) {
    const rows = await withOrgScope<(typeof tiktokConnections.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(tiktokConnections)
          .where(
            and(
              eq(tiktokConnections.orgId, orgId),
              eq(tiktokConnections.campaignId, campaignId)
            )
          )
          .limit(1)
    );
    return rows[0];
  },

  /** OAuth callback upsert — one connection per `(orgId, campaignId)`, reconnecting replaces the
   * old access token/subscription outright (mirrors `webhookCredentialsRepository.upsert`'s
   * no-overlap rotation model). */
  async upsert(
    db: Db,
    orgId: string,
    campaignId: string,
    values: {
      advertiserId: string;
      pageId: string | null;
      encryptedAccessToken: string;
      subscriptionId: string;
    }
  ) {
    return withOrgScope(db, orgId, (qb) =>
      qb
        .insert(tiktokConnections)
        .values({ orgId, campaignId, ...values })
        .onConflictDoUpdate({
          target: [tiktokConnections.orgId, tiktokConnections.campaignId],
          set: { ...values, updatedAt: new Date() }
        })
        .returning()
    );
  },

  async remove(db: Db, orgId: string, campaignId: string) {
    return withOrgScope(db, orgId, (qb) =>
      qb
        .delete(tiktokConnections)
        .where(
          and(
            eq(tiktokConnections.orgId, orgId),
            eq(tiktokConnections.campaignId, campaignId)
          )
        )
        .returning()
    );
  }
};
