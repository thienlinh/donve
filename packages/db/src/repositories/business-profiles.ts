import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { businessProfiles } from "../schema/business.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(businessProfiles);

export const businessProfilesRepository = {
  ...base,

  /** One `businessProfiles` row per landing page (`uq_business_profile_landing_page`). */
  async findByLandingPage(db: Db, orgId: string, landingPageId: string) {
    const rows = await withOrgScope<(typeof businessProfiles.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(businessProfiles)
          .where(
            and(
              eq(businessProfiles.orgId, orgId),
              eq(businessProfiles.landingPageId, landingPageId)
            )
          )
          .limit(1)
    );
    return rows[0];
  }
};
