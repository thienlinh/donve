import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

// Better Auth owns user/session/account; these tables add the org layer on top.
export const organizations = pgTable("organizations", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan", { enum: ["free", "starter", "pro"] })
    .notNull()
    .default("free"),
  aiCreditBalance: integer("ai_credit_balance").notNull().default(0),
  // FR-H-05 — free generations on the platform's Workers AI key before BYOK/credits kick in.
  trialUsesRemaining: integer("trial_uses_remaining").notNull().default(3),
  settings: jsonb("settings").notNull().default({}),
  /**
   * Set by `POST /platform/orgs/:id/disable` (platform-admin.md §11) — ToS violation or long
   * overdue payment. Data is kept untouched; `requireOrgSession` rejects every `/api/*` request
   * for the org while this is non-null, which is the one chokepoint all tenant access goes
   * through. The mandatory reason lives in `platform_audit_logs`, not here — the audit trail
   * keeps the full history of disable/enable cycles instead of just the latest reason.
   */
  disabledAt: timestamp("disabled_at"),
  ...timestamps
});

export const memberships = pgTable(
  "memberships",
  {
    id: id(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id),
    userId: uuid("user_id").notNull(),
    role: text("role", {
      enum: ["owner", "admin", "editor", "sales"]
    }).notNull(),
    salesConfig: jsonb("sales_config").default({}),
    // Better Auth's organization plugin (packages/auth/src/config.ts) writes
    // `createdAt` on every member it creates (crud-org.mjs/crud-invites.mjs) —
    // required for its own drizzleAdapter schema validation, not just audit trail.
    ...timestamps
  },
  (t) => [uniqueIndex("uq_membership").on(t.orgId, t.userId)]
);

// Owned entirely by Better Auth's organization plugin (packages/auth/src/config.ts,
// `modelName: "invites"`) — invite-member/accept-invitation/cancel-invitation etc.
// address rows by `id` and require `status`/`inviterId` on every row they write.
export const invites = pgTable("invites", {
  id: id(),
  orgId: uuid("org_id").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ["owner", "admin", "editor", "sales"] }).notNull(),
  status: text("status", {
    enum: ["pending", "accepted", "rejected", "canceled"]
  })
    .notNull()
    .default("pending"),
  inviterId: uuid("inviter_id"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    actorId: uuid("actor_id"),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: uuid("target_id"),
    meta: jsonb("meta").default({}),
    createdAt: timestamps.createdAt
  },
  (t) => [index("ix_audit_org_time").on(t.orgId, t.createdAt)]
);
