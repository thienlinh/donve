import { and, eq, inArray } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { deployments } from "../schema/publishing.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(deployments);

export const deploymentsRepository = {
  ...base,

  /**
   * Cross-org read for the reconciliation job (architecture.md §5.2) — same "no RLS to
   * bypass, so an unscoped read is fine" reasoning as `publishOutboxRepository.listPendingAcrossOrgs`.
   * Used to diff every hostname's expected `live` deployment against the real KV/pointer value.
   */
  async listLiveAcrossOrgs(db: Db) {
    return db.raw
      .select()
      .from(deployments)
      .where(eq(deployments.status, "live"));
  },

  /**
   * Cross-org read used by FR-G-01's subdomain-takeover check — a hostname claim has to be
   * checked against every org, not just the publishing org, so this can't go through
   * `withOrgScope` (same reasoning as `listLiveAcrossOrgs`).
   */
  async findActiveByHostname(db: Db, hostname: string) {
    return db.raw
      .select()
      .from(deployments)
      .where(
        and(
          eq(deployments.hostname, hostname),
          inArray(deployments.status, ["live", "building"])
        )
      );
  }
};
