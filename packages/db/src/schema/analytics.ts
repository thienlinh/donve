import { index, jsonb, pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

// append-only, written from the edge beacon
export const events = pgTable(
  "events",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id"),
    deploymentId: text("deployment_id"),
    type: text("type").notNull(),
    sessionHash: text("session_hash"), // hash(ip+ua+day) — no PII
    /** `tracking-and-attribution.md` §Identity — first-party id landing-runtime generates and
     * persists client-side (`localStorage`), sent on every beacon call. Null for events that
     * predate this column or come from a context with no client (e.g. offline conversion). */
    anonymousId: text("anonymous_id"),
    landingPageId: text("landing_page_id"),
    pageVersionId: text("page_version_id"),
    meta: jsonb("meta").default({}),
    createdAt: timestamps.createdAt
  },
  (t) => [index("ix_events").on(t.orgId, t.campaignId, t.type, t.createdAt)]
);
