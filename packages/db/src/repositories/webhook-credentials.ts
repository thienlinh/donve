import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { webhookCredentials } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

type WebhookCredentialProvider =
  typeof webhookCredentials.$inferSelect.provider;

const base = createOrgScopedRepository(webhookCredentials);

export const webhookCredentialsRepository = {
  ...base,

  /** Public webhook routes look this up by `(orgId, provider)` before verifying a signature —
   * no session there, so this is the only lookup shape that matters outside the settings CRUD. */
  async findByOrgAndProvider(
    db: Db,
    orgId: string,
    provider: WebhookCredentialProvider
  ) {
    const rows = await withOrgScope<(typeof webhookCredentials.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(webhookCredentials)
          .where(
            and(
              eq(webhookCredentials.orgId, orgId),
              eq(webhookCredentials.provider, provider)
            )
          )
          .limit(1)
    );
    return rows[0];
  },

  /** Settings UI upsert — one row per `(orgId, provider)`. `encryptedPageAccessToken` is
   * Facebook-only (Graph API lead-detail fetch, lead-integrations.md §1) — omitted entirely
   * (not set to null) on an update leaves whatever token was there before untouched, so
   * rotating just the App Secret doesn't force re-entering the Page Access Token too. */
  async upsert(
    db: Db,
    orgId: string,
    provider: WebhookCredentialProvider,
    values: {
      encryptedSecret: string;
      verifyToken: string | null;
      encryptedPageAccessToken?: string;
    }
  ) {
    return withOrgScope(db, orgId, (qb) =>
      qb
        .insert(webhookCredentials)
        .values({ orgId, provider, ...values })
        .onConflictDoUpdate({
          target: [webhookCredentials.orgId, webhookCredentials.provider],
          set: { ...values, updatedAt: new Date() }
        })
        .returning()
    );
  },

  /** Called by `webhooks.ts` right after a credential successfully authenticates a request —
   * best-effort usage tracking, not part of the auth decision itself. */
  async touchLastUsed(
    db: Db,
    orgId: string,
    provider: WebhookCredentialProvider
  ) {
    await withOrgScope(db, orgId, (qb) =>
      qb
        .update(webhookCredentials)
        .set({ lastUsedAt: new Date() })
        .where(
          and(
            eq(webhookCredentials.orgId, orgId),
            eq(webhookCredentials.provider, provider)
          )
        )
    );
  },

  async remove(db: Db, orgId: string, provider: WebhookCredentialProvider) {
    return withOrgScope(db, orgId, (qb) =>
      qb
        .delete(webhookCredentials)
        .where(
          and(
            eq(webhookCredentials.orgId, orgId),
            eq(webhookCredentials.provider, provider)
          )
        )
    );
  }
};
