import { and, eq, isNull } from "drizzle-orm"

import type { Db } from "../client/types.js"
import { withOrgScope } from "../org-scope.js"
import { leads } from "../schema/crm.js"
import { createOrgScopedRepository } from "./scoped-repository.js"

const base = createOrgScopedRepository(leads)

export const leadsRepository = {
  ...base,

  /** dedupe check for FR-E-06 — active (non-deleted) lead with this phone in this org */
  async findByPhone(db: Db, orgId: string, phone: string) {
    const rows = await withOrgScope<(typeof leads.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(leads)
          .where(
            and(
              eq(leads.orgId, orgId),
              eq(leads.phone, phone),
              isNull(leads.deletedAt)
            )
          )
          .limit(1)
    )
    return rows[0]
  },
}
