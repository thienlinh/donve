import { eq, sql } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { aiConnections } from "../schema/ai.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(aiConnections);

export const aiConnectionsRepository = {
  ...base,

  /** Sets one connection as the org's default and unsets every other in the same statement — no read-then-write race. */
  setDefault(db: Db, orgId: string, id: string) {
    return withOrgScope(db, orgId, (qb) =>
      qb
        .update(aiConnections)
        .set({ isDefault: sql`${aiConnections.id} = ${id}` })
        .where(eq(aiConnections.orgId, orgId))
    );
  }
};
