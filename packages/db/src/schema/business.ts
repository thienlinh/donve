import {
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

/**
 * Business Knowledge Graph (`strategy/strategy-brief.md` §Business Knowledge Graph) —
 * persistent per landing page, not rebuilt from scratch on every Research/Strategy call.
 * `product`/`customer`/`market` are each a `KnowledgeItem[]` (contracts/business.ts):
 * `{ label, value, status: "fact"|"inference"|"unknown", sourceRef? }` — flat, not the doc's
 * nested illustrative shape, so the Research Agent can emit an arbitrary number of labeled
 * findings per category without a rigid per-field schema fighting real extraction output.
 */
export const businessProfiles = pgTable(
  "business_profiles",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    landingPageId: uuid("landing_page_id").notNull(),
    product: jsonb("product").notNull().default([]),
    customer: jsonb("customer").notNull().default([]),
    market: jsonb("market").notNull().default([]),
    /** Raw inputs the Research Agent extracted from — brief text, source URLs, etc. */
    sources: jsonb("sources").notNull().default([]),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_business_profile_landing_page").on(t.landingPageId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/**
 * `strategy/strategy-brief.md` §Strategy Brief — each section stored as one JSONB object
 * (shape documented in `@dv/contracts`'s `strategyBriefSchema`), not a wall of columns.
 */
export const strategyBriefs = pgTable(
  "strategy_briefs",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    landingPageId: uuid("landing_page_id").notNull(),
    business: jsonb("business").notNull().default({}),
    customer: jsonb("customer").notNull().default({}),
    market: jsonb("market").notNull().default({}),
    funnel: jsonb("funnel").notNull().default({}),
    offer: jsonb("offer").notNull().default({}),
    message: jsonb("message").notNull().default({}),
    // §Xác nhận: Page Architect (roadmap.md's next step) may only run once both are set.
    confirmedAt: timestamp("confirmed_at"),
    confirmedBy: uuid("confirmed_by"),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_strategy_brief_landing_page").on(t.landingPageId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();
