import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

/**
 * Feature-flags-by-subscription (docs/architecture/platform-admin.md §12). There is no
 * `subscription_plans` table on this platform yet — a plan is the `organizations.plan` enum
 * column (`free` | `starter` | `pro`, schema/core.ts), so `planFeatures.planId` holds that enum
 * value rather than a FK to a plan row. Typed as the same enum so a typo fails to compile; if a
 * real plan table ever lands, this column becomes its FK and the values become ULIDs.
 */
export const featureFlags = pgTable("feature_flags", {
  id: id(),
  key: text("key").notNull().unique(),
  description: text("description").notNull(),
  ...timestamps
});

export const planFeatures = pgTable(
  "plan_features",
  {
    id: id(),
    planId: text("plan_id", { enum: ["free", "starter", "pro"] }).notNull(),
    featureKey: text("feature_key").notNull(),
    ...timestamps
  },
  (t) => [uniqueIndex("ux_plan_feature").on(t.planId, t.featureKey)]
);

/**
 * Per-org override, higher priority than `planFeatures` — "turn this on for one customer before
 * they upgrade" or "turn it off for this org for abuse" (platform-admin.md §11/§12). RLS like any
 * other org-scoped table: platform staff read it cross-tenant via `withPlatformScope`, but the
 * write from `PATCH /platform/orgs/:id/subscription` still goes through
 * `withOrgScope(targetOrgId, ...)` — there is no cross-tenant write path (platform-admin.md §0).
 */
export const orgFeatureOverrides = pgTable(
  "org_feature_overrides",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    featureKey: text("feature_key").notNull(),
    enabled: text("enabled", { enum: ["true", "false"] }).notNull(),
    reason: text("reason").notNull(),
    ...timestamps
  },
  (t) => [
    uniqueIndex("ux_org_feature").on(t.orgId, t.featureKey),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();
