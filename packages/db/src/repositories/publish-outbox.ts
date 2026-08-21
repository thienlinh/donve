import { and, eq, inArray, ne } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { deployments, publishOutbox } from "../schema/publishing.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(publishOutbox);

export const publishOutboxRepository = {
  ...base,

  /** Outbox rows this org still needs applied — publish just enqueued one, or a prior apply failed. */
  async listPending(db: Db, orgId: string) {
    return withOrgScope<(typeof publishOutbox.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(publishOutbox)
          .where(
            and(
              eq(publishOutbox.orgId, orgId),
              inArray(publishOutbox.status, ["pending", "failed"])
            )
          )
    );
  },

  /**
   * Cross-org read for the periodic reconciliation job (architecture.md §5.2) — that job
   * runs outside any tenant session, not on behalf of one org, so it can't go through
   * `withOrgScope`. Safe unscoped like `platformStaffRepository` because `publish_outbox`
   * has no RLS policy (schema/publishing.ts) — there is nothing to bypass.
   */
  async listPendingAcrossOrgs(db: Db) {
    return db.raw
      .select()
      .from(publishOutbox)
      .where(inArray(publishOutbox.status, ["pending", "failed"]));
  },

  /**
   * Marks one outbox row applied and flips its deployment to `live`, superseding whatever
   * else was `live` on that hostname — the two writes the outbox pattern exists to keep
   * atomic (architecture.md §5.2: "KV xác nhận thành công thì set deployments.status=live
   * VÀ publish_outbox.status=applied trong cùng bước"). Both statements are independent
   * (no read-then-write dependency), so a `.batch()` on neon-http is as atomic as a real
   * transaction on postgres-js — same reasoning as `withOrgScope`, just multi-statement.
   */
  async markApplied(db: Db, outboxRow: typeof publishOutbox.$inferSelect) {
    const appliedAt = new Date();
    const statements = [
      db.raw
        .update(publishOutbox)
        .set({ status: "applied", appliedAt })
        .where(eq(publishOutbox.id, outboxRow.id)),
      db.raw
        .update(deployments)
        .set({ status: "live" })
        .where(eq(deployments.id, outboxRow.targetDeployId)),
      db.raw
        .update(deployments)
        .set({ status: "superseded" })
        .where(
          and(
            eq(deployments.hostname, outboxRow.hostname),
            eq(deployments.status, "live"),
            ne(deployments.id, outboxRow.targetDeployId)
          )
        )
    ] as const;

    if (db.kind === "postgres-js") {
      await db.raw.transaction(async (tx) => {
        await tx
          .update(publishOutbox)
          .set({ status: "applied", appliedAt })
          .where(eq(publishOutbox.id, outboxRow.id));
        await tx
          .update(deployments)
          .set({ status: "live" })
          .where(eq(deployments.id, outboxRow.targetDeployId));
        await tx
          .update(deployments)
          .set({ status: "superseded" })
          .where(
            and(
              eq(deployments.hostname, outboxRow.hostname),
              eq(deployments.status, "live"),
              ne(deployments.id, outboxRow.targetDeployId)
            )
          );
      });
      return;
    }

    // oxlint-disable-next-line no-unsafe-type-assertion -- batch() wants a concrete tuple;
    // each statement above is independently typed, this just re-asserts that shape.
    await db.raw.batch(statements);
  },

  /** Marks an apply attempt failed (KV put threw) so reconciliation retries it. */
  async markFailed(db: Db, outboxId: string) {
    await db.raw
      .update(publishOutbox)
      .set({ status: "failed" })
      .where(eq(publishOutbox.id, outboxId));
  }
};
