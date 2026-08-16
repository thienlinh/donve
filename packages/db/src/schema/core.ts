import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { id, timestamps } from "./columns.js"

// Better Auth owns user/session/account; these tables add the org layer on top.
export const organizations = pgTable("organizations", {
  id: id(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  plan: text("plan", { enum: ["free", "starter", "pro"] })
    .notNull()
    .default("free"),
  aiCreditBalance: integer("ai_credit_balance").notNull().default(0),
  settings: jsonb("settings").notNull().default({}),
  ...timestamps,
})

export const memberships = pgTable(
  "memberships",
  {
    id: id(),
    orgId: text("org_id")
      .notNull()
      .references(() => organizations.id),
    userId: text("user_id").notNull(),
    role: text("role", {
      enum: ["owner", "admin", "editor", "sales"],
    }).notNull(),
    salesConfig: jsonb("sales_config").default({}),
  },
  (t) => [uniqueIndex("uq_membership").on(t.orgId, t.userId)]
)

export const invites = pgTable("invites", {
  id: id(),
  orgId: text("org_id").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ["owner", "admin", "editor", "sales"] }).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    actorId: text("actor_id"),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    meta: jsonb("meta").default({}),
    createdAt: timestamps.createdAt,
  },
  (t) => [index("ix_audit_org_time").on(t.orgId, t.createdAt)]
)
