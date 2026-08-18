import { and, desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { promptTestRuns } from "../schema/ai.js";

type PromptTestRunRow = typeof promptTestRuns.$inferSelect;
type PromptTestRunInsert = typeof promptTestRuns.$inferInsert;

export const promptTestRunsRepository = {
  /** Most recent runs first — the compare UI (FR-F-04) picks any two off this list. */
  async listByTemplate(db: Db, orgId: string, promptTemplateId: string) {
    return withOrgScope<PromptTestRunRow[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(promptTestRuns)
        .where(
          and(
            eq(promptTestRuns.orgId, orgId),
            eq(promptTestRuns.promptTemplateId, promptTemplateId)
          )
        )
        .orderBy(desc(promptTestRuns.createdAt))
    );
  },

  async insert(
    db: Db,
    orgId: string,
    values: Omit<PromptTestRunInsert, "orgId">
  ) {
    const rows = await withOrgScope<PromptTestRunRow[]>(db, orgId, (qb) =>
      qb
        .insert(promptTestRuns)
        .values({ ...values, orgId })
        .returning()
    );
    return rows[0];
  }
};
