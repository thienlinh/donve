import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

export const deployments = pgTable(
  "deployments",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    landingPageId: uuid("landing_page_id").notNull(),
    pageVersionId: uuid("page_version_id").notNull(),
    hostname: text("hostname").notNull(),
    status: text("status", {
      enum: ["building", "live", "superseded", "failed", "unpublished"]
    }).notNull(),
    r2Prefix: text("r2_prefix").notNull(),
    meta: jsonb("meta").default({}),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_deploy_host").on(t.hostname, t.status),
    // only one "live" row per hostname
    uniqueIndex("uq_deploy_live_host")
      .on(t.hostname)
      .where(sql`status = 'live'`),
    orgIsolationPolicy(),
    // reconciliation/subdomain-takeover checks read cross-org via withPlatformScope
    // (deploymentsRepository.listLiveAcrossOrgs/findActiveByHostname)
    platformReadPolicy()
  ]
).enableRLS();

export const customDomains = pgTable(
  "custom_domains",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    landingPageId: uuid("landing_page_id").notNull(),
    hostname: text("hostname").notNull().unique(),
    status: text("status", { enum: ["pending", "active", "failed"] })
      .notNull()
      .default("pending"),
    cfHostnameId: text("cf_hostname_id"),
    // FR-G-04 — CNAME target + ownership verification record from Cloudflare for SaaS, so the
    // dashboard can always render "what to set up" without re-hitting the CF API on every render.
    verification: jsonb("verification").default({}),
    createdAt: timestamps.createdAt
  },
  () => [
    orgIsolationPolicy(),
    // hostname-takeover checks read cross-org via withPlatformScope
    // (customDomainsRepository.findByHostnameAcrossOrgs/listActiveAcrossOrgs)
    platformReadPolicy()
  ]
).enableRLS();

export const publishOutbox = pgTable(
  "publish_outbox",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    deploymentId: uuid("deployment_id").notNull(),
    hostname: text("hostname").notNull(),
    // deployment this hostname should point to once applied (publish or rollback)
    targetDeployId: uuid("target_deploy_id").notNull(),
    status: text("status", { enum: ["pending", "applied", "failed"] })
      .notNull()
      .default("pending"),
    createdAt: timestamps.createdAt,
    appliedAt: timestamp("applied_at")
  },
  (t) => [index("ix_outbox_status").on(t.status, t.createdAt)]
);
