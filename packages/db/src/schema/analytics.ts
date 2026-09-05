import {
  index,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

// append-only, written from the edge beacon
export const events = pgTable(
  "events",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    campaignId: uuid("campaign_id"),
    deploymentId: uuid("deployment_id"),
    type: text("type").notNull(),
    sessionHash: text("session_hash"), // hash(ip+ua+day) — no PII
    /** first-party id landing-runtime generates and persists client-side (`localStorage`), sent
     * on every beacon call — not one of ours, so it stays a free-form string, not a uuid. Null
     * for events that predate this column or come from a context with no client (e.g. offline
     * conversion). */
    anonymousId: text("anonymous_id"),
    landingPageId: uuid("landing_page_id"),
    pageVersionId: uuid("page_version_id"),
    meta: jsonb("meta").default({}),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_events").on(t.orgId, t.campaignId, t.type, t.createdAt),
    orgIsolationPolicy(),
    // traffic-spike monitoring reads cross-org via withPlatformScope
    // (eventsRepository.countByHostnameInRange)
    platformReadPolicy()
  ]
).enableRLS();

export const sourceLinks = pgTable(
  "source_links",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    campaignId: uuid("campaign_id").notNull(),
    landingPageId: uuid("landing_page_id"),
    name: text("name").notNull(),
    key: text("key").notNull(),
    utmSource: text("utm_source").notNull(),
    utmMedium: text("utm_medium").notNull(),
    utmCampaign: text("utm_campaign").notNull(),
    utmContent: text("utm_content").notNull(),
    utmTerm: text("utm_term"),
    targetUrl: text("target_url").notNull(),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_source_link_campaign_key").on(t.campaignId, t.key),
    index("ix_source_links_campaign").on(t.orgId, t.campaignId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();
