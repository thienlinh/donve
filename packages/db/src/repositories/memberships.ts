import { and, eq } from "drizzle-orm"

import type { Db } from "../client/types.js"
import { withOrgScope } from "../org-scope.js"
import { memberships } from "../schema/core.js"
import { createOrgScopedRepository } from "./scoped-repository.js"

const base = createOrgScopedRepository(memberships)

export const membershipsRepository = {
  ...base,

  async findByUserId(db: Db, orgId: string, userId: string) {
    const rows = await withOrgScope<(typeof memberships.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(memberships)
          .where(
            and(eq(memberships.orgId, orgId), eq(memberships.userId, userId))
          )
          .limit(1)
    )
    return rows[0]
  },
}
