import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { pageVersions } from "../schema/studio.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(pageVersions);

export const pageVersionsRepository = {
  ...base,

  /** Version history (FR-B-27), newest first. */
  async listByLandingPage(db: Db, orgId: string, landingPageId: string) {
    return withOrgScope<(typeof pageVersions.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(pageVersions)
        .where(
          and(
            eq(pageVersions.orgId, orgId),
            eq(pageVersions.landingPageId, landingPageId)
          )
        )
        .orderBy(desc(pageVersions.seq))
    );
  }
};
