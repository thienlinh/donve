import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

export const deployments = pgTable(
  "deployments",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    landingPageId: text("landing_page_id").notNull(),
    pageVersionId: text("page_version_id").notNull(),
    hostname: text("hostname").notNull(),
    status: text("status", {
      enum: ["building", "live", "superseded", "failed", "unpublished"],
    }).notNull(),
    r2Prefix: text("r2_prefix").notNull(),
    meta: jsonb("meta").default({}),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index("ix_deploy_host").on(t.hostname, t.status),
    // only one "live" row per hostname
    uniqueIndex("uq_deploy_live_host")
      .on(t.hostname)
      .where(sql`status = 'live'`),
  ]
);

export const customDomains = pgTable("custom_domains", {
  id: id(),
  orgId: text("org_id").notNull(),
  hostname: text("hostname").notNull().unique(),
  status: text("status", { enum: ["pending", "active", "failed"] })
    .notNull()
    .default("pending"),
  cfHostnameId: text("cf_hostname_id"),
  createdAt: timestamps.createdAt,
});

export const publishOutbox = pgTable(
  "publish_outbox",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    deploymentId: text("deployment_id").notNull(),
    hostname: text("hostname").notNull(),
    // deployment this hostname should point to once applied (publish or rollback)
    targetDeployId: text("target_deploy_id").notNull(),
    status: text("status", { enum: ["pending", "applied", "failed"] })
      .notNull()
      .default("pending"),
    createdAt: timestamps.createdAt,
    appliedAt: timestamp("applied_at"),
  },
  (t) => [index("ix_outbox_status").on(t.status, t.createdAt)]
);
