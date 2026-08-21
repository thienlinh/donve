import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withPlatformScope } from "../platform-scope.js";
import { paymentConnections } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(paymentConnections);

export const paymentConnectionsRepository = {
  ...base,

  /**
   * Cross-tenant read (via `withPlatformScope`) for webhook secret resolution — the SePay
   * webhook has no org context until the presented `Authorization` header is matched against
   * a decrypted `encryptedApiKey`, so the caller must scan every org's active connection.
   */
  async listActiveByProvider(db: Db, provider: string) {
    return withPlatformScope<(typeof paymentConnections.$inferSelect)[]>(
      db,
      (qb) =>
        qb
          .select()
          .from(paymentConnections)
          .where(
            and(
              eq(paymentConnections.provider, provider),
              eq(paymentConnections.status, "active")
            )
          )
    );
  }
};
