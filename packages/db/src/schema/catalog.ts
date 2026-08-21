import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { deletedAt, id, timestamps } from "./columns.js";

export const products = pgTable(
  "products",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    type: text("type", {
      enum: ["course", "product", "service", "other"]
    }).notNull(),
    name: text("name").notNull(),
    price: numeric("price", { precision: 12, scale: 0 }).notNull().default("0"),
    description: text("description"),
    images: jsonb("images").default([]),
    attributes: jsonb("attributes").default({}),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
    deletedAt: deletedAt()
  },
  (t) => [index("ix_products_org").on(t.orgId, t.type)]
);

export const campaigns = pgTable(
  "campaigns",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    publicId: text("public_id").notNull(),
    name: text("name").notNull(),
    status: text("status", { enum: ["draft", "active", "paused", "ended"] })
      .notNull()
      .default("draft"),
    goal: text("goal"),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    formConfig: jsonb("form_config").notNull().default({}),
    paymentConfig: jsonb("payment_config").notNull().default({}),
    utmDefaults: jsonb("utm_defaults").default({}),
    // FR-E-04: "manual" leaves assigneeId as set by PATCH /leads/:id/assignee; "round_robin"
    // rotates new leads across the org's sales members, tracked by roundRobinCursor.
    assignmentMode: text("assignment_mode", { enum: ["manual", "round_robin"] })
      .notNull()
      .default("manual"),
    /** last user id assigned via round-robin — next lead goes to the sales member after this one. */
    roundRobinCursor: text("round_robin_cursor"),
    ...timestamps,
    deletedAt: deletedAt()
  },
  (t) => [
    uniqueIndex("uq_campaign_public_id")
      .on(t.publicId)
      .where(sql`deleted_at IS NULL`)
  ]
);

export const campaignProducts = pgTable(
  "campaign_products",
  {
    campaignId: text("campaign_id").notNull(),
    productId: text("product_id").notNull(),
    orgId: text("org_id").notNull()
  },
  (t) => [uniqueIndex("uq_cp").on(t.campaignId, t.productId)]
);
