import { and, eq, isNull } from "drizzle-orm"

import type { Db } from "../client/types.js"
import { withOrgScope } from "../org-scope.js"
import { campaigns } from "../schema/catalog.js"
import { createOrgScopedRepository } from "./scoped-repository.js"

const base = createOrgScopedRepository(campaigns)

export const campaignsRepository = {
  ...base,

  async findByPublicId(db: Db, orgId: string, publicId: string) {
    const rows = await withOrgScope<(typeof campaigns.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(campaigns)
          .where(
            and(
              eq(campaigns.orgId, orgId),
              eq(campaigns.publicId, publicId),
              isNull(campaigns.deletedAt)
            )
          )
          .limit(1)
    )
    return rows[0]
  },
}
