import { and, eq, or } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { savedViews } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(savedViews);

export const savedViewsRepository = {
  ...base,

  /** GET /saved-views — this user's own views plus every org-wide shared one. */
  async listVisible(db: Db, orgId: string, userId: string) {
    // oxlint-disable-next-line no-non-null-assertion -- `or()` with 2 args always returns a SQL node
    const visibility = or(
      eq(savedViews.userId, userId),
      eq(savedViews.shared, true)
    )!;
    return withOrgScope<(typeof savedViews.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(savedViews)
        .where(and(eq(savedViews.orgId, orgId), visibility))
    );
  }
};
