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
    meta: jsonb("meta").default({}),
    createdAt: timestamps.createdAt
  },
  (t) => [index("ix_events").on(t.orgId, t.campaignId, t.type, t.createdAt)]
);
