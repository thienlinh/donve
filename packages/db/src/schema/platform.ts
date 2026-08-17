import { pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

/**
 * Cross-tenant staff, deliberately separate from `memberships` (docs/architecture/platform-admin.md
 * §1) — memberships always belongs to exactly one org, this doesn't belong to any.
 * No RLS: this table has no `org_id` and is never queried through `withOrgScope`/`withPlatformScope`.
 */
export const platformStaff = pgTable("platform_staff", {
  id: id(),
  userId: text("user_id").notNull().unique(),
  role: text("role", { enum: ["platform_admin"] }).notNull(),
  ...timestamps
});

/**
 * Separate from the tenant-scoped `audit_logs` (schema/core.ts) — that table's `org_id` is
 * `notNull` and its meaning is "this org's own history"; platform staff actions aren't that.
 * Every `/platform/*` handler must write one row here before responding (platform-admin.md §4) —
 * not optional, since cross-tenant read access is a bigger compliance surface (NFR-13) than any
 * single tenant's own audit trail.
 */
export const platformAuditLogs = pgTable("platform_audit_logs", {
  id: id(),
  staffUserId: text("staff_user_id").notNull(),
  action: text("action").notNull(),
  // null for actions not tied to one org (e.g. "listed all orgs")
  targetOrgId: text("target_org_id"),
  targetType: text("target_type"),
  targetId: text("target_id"),
  meta: text("meta"),
  createdAt: timestamps.createdAt
});
