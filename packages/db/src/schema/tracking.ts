import { index, jsonb, pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

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
    orgId: text("org_id").notNull(),
    landingPageId: text("landing_page_id").notNull(),
    pageVersionId: text("page_version_id").notNull(),
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
    index("ix_event_definitions_landing_page").on(t.orgId, t.landingPageId)
  ]
);
