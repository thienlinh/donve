import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { customPageBundles } from "../schema/custom-import.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(customPageBundles);

export const customPageBundlesRepository = {
  ...base,

  async findByLandingPage(db: Db, orgId: string, landingPageId: string) {
    const rows = await withOrgScope<(typeof customPageBundles.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(customPageBundles)
          .where(
            and(
              eq(customPageBundles.orgId, orgId),
              eq(customPageBundles.landingPageId, landingPageId)
            )
          )
          .limit(1)
    );
    return rows[0];
  }
};
