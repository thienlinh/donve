import { index, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

/**
 * `tracking/tracking-and-attribution.md` §Event registry — "Sinh tự động ngay khi Page
 * Architect chốt PageSpec — mỗi componentId đã chọn ghi thẳng trackingEvents cố định vào
 * eventDefinitions." Replaced wholesale (delete+insert) on every structural change to a
 * landing page's spec (`apps/api/src/modules/landings/routes.ts`'s `syncEventDefinitions`) —
 * only the current version's registry matters, so old rows aren't kept around.
 */
export const eventDefinitions = pgTable(
  "event_definitions",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    landingPageId: uuid("landing_page_id").notNull(),
    pageVersionId: uuid("page_version_id").notNull(),
    eventName: text("event_name").notNull(),
    /** `PageSpec.elements` key this event is emitted from — null for a page-wide event. */
    elementId: text("element_id"),
    componentId: text("component_id").notNull(),
    requiredProperties: jsonb("required_properties")
      .$type<string[]>()
      .default([]),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_event_definitions_landing_page").on(t.orgId, t.landingPageId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

/**
 * In-app product-usage telemetry — distinct from `analytics.ts`'s `events` (anonymous visitor
 * traffic on a *published* landing page, written by the edge beacon) and from `auditLogsRepository`
 * (a compliance trail of mutating actions). This is authenticated-dashboard-only ("which screens/
 * actions does the tenant actually use"), fired by `apps/donve/src/lib/telemetry.ts`'s
 * `trackEvent()` — pageview-on-navigate is automatic (`_authenticated/route.tsx`), anything else
 * is opt-in per call site. Low value with only one real tenant (the founder, still dogfooding —
 * nothing to compare against yet) but built anyway on the founder's explicit request (2026-09-04).
 */
export const appUsageEvents = pgTable(
  "app_usage_events",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    userId: uuid("user_id").notNull(),
    eventName: text("event_name").notNull(),
    properties: jsonb("properties").default({}),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_app_usage_events_org_time").on(t.orgId, t.createdAt),
    index("ix_app_usage_events_org_event_time").on(
      t.orgId,
      t.eventName,
      t.createdAt
    ),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();
