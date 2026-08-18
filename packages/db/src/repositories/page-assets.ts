import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { pageAssets } from "../schema/studio.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(pageAssets);

export const pageAssetsRepository = {
  ...base,

  /** FR-B-26/29 — assets/ folder contents, newest upload first. */
  async listByLandingPage(db: Db, orgId: string, landingPageId: string) {
    return withOrgScope<(typeof pageAssets.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(pageAssets)
        .where(
          and(
            eq(pageAssets.orgId, orgId),
            eq(pageAssets.landingPageId, landingPageId)
          )
        )
        .orderBy(desc(pageAssets.createdAt))
    );
  }
};
