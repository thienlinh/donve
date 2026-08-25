import { and, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import {
  featureFlags,
  orgFeatureOverrides,
  planFeatures
} from "../schema/billing.js";

/** Global catalog (no `org_id`, no RLS) — read directly, same as `organizations`. */
export const featureFlagsRepository = {
  listAll(db: Db) {
    return db.raw.select().from(featureFlags);
  }
};

export const planFeaturesRepository = {
  async has(
    db: Db,
    planId: (typeof planFeatures.$inferSelect)["planId"],
    featureKey: string
  ) {
    const rows = await db.raw
      .select({ id: planFeatures.id })
      .from(planFeatures)
      .where(
        and(
          eq(planFeatures.planId, planId),
          eq(planFeatures.featureKey, featureKey)
        )
      )
      .limit(1);
    return rows.length > 0;
  },

  listForPlan(
    db: Db,
    planId: (typeof planFeatures.$inferSelect)["planId"]
  ): Promise<(typeof planFeatures.$inferSelect)[]> {
    return db.raw
      .select()
      .from(planFeatures)
      .where(eq(planFeatures.planId, planId));
  }
};

/** Org-scoped like any other tenant table — reads and writes both go through `withOrgScope`. */
export const orgFeatureOverridesRepository = {
  async find(db: Db, orgId: string, featureKey: string) {
    const rows = await withOrgScope<
      (typeof orgFeatureOverrides.$inferSelect)[]
    >(db, orgId, (qb) =>
      qb
        .select()
        .from(orgFeatureOverrides)
        .where(
          and(
            eq(orgFeatureOverrides.orgId, orgId),
            eq(orgFeatureOverrides.featureKey, featureKey)
          )
        )
        .limit(1)
    );
    return rows[0];
  },

  list(db: Db, orgId: string) {
    return withOrgScope<(typeof orgFeatureOverrides.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(orgFeatureOverrides)
          .where(eq(orgFeatureOverrides.orgId, orgId))
          .orderBy(orgFeatureOverrides.featureKey)
    );
  },

  /** One override per (org, feature) — `ux_org_feature` makes the upsert the only sane write. */
  async upsert(
    db: Db,
    orgId: string,
    values: Omit<typeof orgFeatureOverrides.$inferInsert, "orgId">
  ) {
    const rows = await withOrgScope<
      (typeof orgFeatureOverrides.$inferSelect)[]
    >(db, orgId, (qb) =>
      qb
        .insert(orgFeatureOverrides)
        .values({ ...values, orgId })
        .onConflictDoUpdate({
          target: [orgFeatureOverrides.orgId, orgFeatureOverrides.featureKey],
          set: {
            enabled: values.enabled,
            reason: values.reason,
            updatedAt: new Date()
          }
        })
        .returning()
    );
    return rows[0];
  },

  async remove(db: Db, orgId: string, featureKey: string) {
    const rows = await withOrgScope<
      (typeof orgFeatureOverrides.$inferSelect)[]
    >(db, orgId, (qb) =>
      qb
        .delete(orgFeatureOverrides)
        .where(
          and(
            eq(orgFeatureOverrides.orgId, orgId),
            eq(orgFeatureOverrides.featureKey, featureKey)
          )
        )
        .returning()
    );
    return rows[0];
  }
};
