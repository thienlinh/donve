import { and, asc, eq, isNull } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { assignmentRules } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(assignmentRules);

export const assignmentRulesRepository = {
  ...base,

  /** `routeLead` + the rules-list screen — active-only, evaluated top-to-bottom by priority. */
  async listActive(db: Db, orgId: string) {
    return withOrgScope<(typeof assignmentRules.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(assignmentRules)
          .where(
            and(
              eq(assignmentRules.orgId, orgId),
              isNull(assignmentRules.deletedAt)
            )
          )
          .orderBy(asc(assignmentRules.priority))
    );
  }
};
