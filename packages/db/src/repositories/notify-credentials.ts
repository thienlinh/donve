import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { notifyCredentials } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

type NotifyCredentialProvider = typeof notifyCredentials.$inferSelect.provider;

const base = createOrgScopedRepository(notifyCredentials);

export const notifyCredentialsRepository = {
  ...base,

  /** `lead-sla-sweep.ts` looks this up by `(orgId, provider)` to build the org's active
   * notify channel — same shape as `webhookCredentialsRepository.findByOrgAndProvider`. */
  async findByOrgAndProvider(
    db: Db,
    orgId: string,
    provider: NotifyCredentialProvider
  ) {
    const rows = await withOrgScope<(typeof notifyCredentials.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(notifyCredentials)
          .where(
            and(
              eq(notifyCredentials.orgId, orgId),
              eq(notifyCredentials.provider, provider)
            )
          )
          .limit(1)
    );
    return rows[0];
  },

  /** Settings UI upsert — one row per `(orgId, provider)`. */
  async upsert(
    db: Db,
    orgId: string,
    provider: NotifyCredentialProvider,
    values: { encryptedSecret: string; config: Record<string, string> }
  ) {
    return withOrgScope(db, orgId, (qb) =>
      qb
        .insert(notifyCredentials)
        .values({ orgId, provider, ...values })
        .onConflictDoUpdate({
          target: [notifyCredentials.orgId, notifyCredentials.provider],
          set: { ...values, updatedAt: new Date() }
        })
        .returning()
    );
  },

  async remove(db: Db, orgId: string, provider: NotifyCredentialProvider) {
    return withOrgScope(db, orgId, (qb) =>
      qb
        .delete(notifyCredentials)
        .where(
          and(
            eq(notifyCredentials.orgId, orgId),
            eq(notifyCredentials.provider, provider)
          )
        )
    );
  }
};
