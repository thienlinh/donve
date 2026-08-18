import { desc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { aiUsage } from "../schema/ai.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(aiUsage);

/** Debited/billed rows are written via `debitAiCreditsAndRecordUsage`/`debitTrialUseAndRecordUsage` (ai-credits.ts) — `.insert()` here is only for the unbilled BYOK path. */
export const aiUsageRepository = {
  ...base,

  /** Newest first, capped — usage can grow unbounded; FR-H-02's display only needs recent history. */
  listRecent(db: Db, orgId: string, limit = 50) {
    return withOrgScope<(typeof aiUsage.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(aiUsage)
        .where(eq(aiUsage.orgId, orgId))
        .orderBy(desc(aiUsage.createdAt))
        .limit(limit)
    );
  }
};
