import { and, eq, inArray, ne } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withPlatformScope } from "../platform-scope.js";
import { customDomains } from "../schema/publishing.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(customDomains);

export const customDomainsRepository = {
  ...base,

  /**
   * Cross-org read for FR-G-04's hostname-takeover check — a custom domain claim has to be
   * checked against every org, not just the claiming one, same reasoning as
   * `deploymentsRepository.findActiveByHostname`. Goes through `withPlatformScope` since
   * `customDomains` carries `platformReadPolicy()`.
   */
  async findByHostnameAcrossOrgs(
    db: Db,
    hostname: string,
    excludeOrgId?: string
  ) {
    const rows = await withPlatformScope<(typeof customDomains.$inferSelect)[]>(
      db,
      (qb) =>
        qb
          .select()
          .from(customDomains)
          .where(
            excludeOrgId
              ? and(
                  eq(customDomains.hostname, hostname),
                  ne(customDomains.orgId, excludeOrgId)
                )
              : eq(customDomains.hostname, hostname)
          )
          .limit(1)
    );
    return rows[0];
  },

  /**
   * Cross-org read for reconciliation (lib/publish.ts) — every active custom domain's
   * pointer-store entry has to stay in sync with its landing page's live deployment, same
   * `withPlatformScope` reasoning as `deploymentsRepository.listLiveAcrossOrgs`.
   */
  async listActiveAcrossOrgs(db: Db) {
    return withPlatformScope<(typeof customDomains.$inferSelect)[]>(db, (qb) =>
      qb
        .select()
        .from(customDomains)
        .where(inArray(customDomains.status, ["active"]))
    );
  }
};
