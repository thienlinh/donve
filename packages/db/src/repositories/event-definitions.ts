import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { eventDefinitions } from "../schema/tracking.js";

export const eventDefinitionsRepository = {
  async listByLandingPage(db: Db, orgId: string, landingPageId: string) {
    return withOrgScope<(typeof eventDefinitions.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(eventDefinitions)
          .where(
            and(
              eq(eventDefinitions.orgId, orgId),
              eq(eventDefinitions.landingPageId, landingPageId)
            )
          )
    );
  },

  /** Whole-registry replace for 1 landing page — `tracking-and-attribution.md` §Event registry:
   * only the current version's `trackingEvents` matter, so old rows for this page are dropped
   * first rather than accumulating across every architecture/auto-fix round. 2 independent
   * statements (delete has no read-dependency on the insert), same `db.kind` branch as
   * `publishOutboxRepository.markApplied` — `withOrgScope` only ever issues 1 query, and this
   * table carries no RLS policy (like `auditRuns`/`auditFindings`), so there's nothing to
   * `set_config` for; org scoping here is just the explicit `orgId` in each statement. */
  async replaceForLandingPage(
    db: Db,
    orgId: string,
    landingPageId: string,
    rows: Omit<
      typeof eventDefinitions.$inferInsert,
      "orgId" | "id" | "landingPageId"
    >[]
  ) {
    const deleteStatement = db.raw
      .delete(eventDefinitions)
      .where(
        and(
          eq(eventDefinitions.orgId, orgId),
          eq(eventDefinitions.landingPageId, landingPageId)
        )
      );
    if (rows.length === 0) {
      await deleteStatement;
      return;
    }
    const insertStatement = db.raw
      .insert(eventDefinitions)
      .values(rows.map((row) => ({ ...row, orgId, landingPageId })));

    if (db.kind === "postgres-js") {
      await db.raw.transaction(async (tx) => {
        await tx
          .delete(eventDefinitions)
          .where(
            and(
              eq(eventDefinitions.orgId, orgId),
              eq(eventDefinitions.landingPageId, landingPageId)
            )
          );
        await tx
          .insert(eventDefinitions)
          .values(rows.map((row) => ({ ...row, orgId, landingPageId })));
      });
      return;
    }
    // oxlint-disable-next-line no-unsafe-type-assertion -- batch() wants a concrete tuple;
    // each statement above is independently typed, this just re-asserts that shape.
    await db.raw.batch([deleteStatement, insertStatement] as Parameters<
      typeof db.raw.batch
    >[0]);
  }
};
