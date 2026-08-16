import { and, eq, gt } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { invites } from "../schema/core.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(invites);

export const invitesRepository = {
  ...base,

  async findByToken(db: Db, orgId: string, token: string) {
    const rows = await withOrgScope<(typeof invites.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(invites)
          .where(
            and(
              eq(invites.orgId, orgId),
              eq(invites.token, token),
              gt(invites.expiresAt, new Date())
            )
          )
          .limit(1)
    );
    return rows[0];
  },
};
