import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationPolicy } from "./rls.js";

export const aiConnections = pgTable(
  "ai_connections",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    provider: text("provider", {
      enum: ["anthropic", "openai", "openrouter", "platform"]
    }).notNull(),
    // null when provider=platform
    encryptedKey: text("encrypted_key"),
    keyLast4: text("key_last4"),
    defaultModel: text("default_model").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    status: text("status", { enum: ["active", "invalid"] })
      .notNull()
      .default("active"),
    createdAt: timestamps.createdAt
  },
  () => [orgIsolationPolicy()]
).enableRLS();

export const aiUsage = pgTable(
  "ai_usage",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    connectionId: text("connection_id").notNull(),
    model: text("model").notNull(),
    inputTokens: integer("input_tokens").notNull(),
    outputTokens: integer("output_tokens").notNull(),
    creditCost: integer("credit_cost").notNull().default(0),
    context: jsonb("context").default({}),
    createdAt: timestamps.createdAt
  },
  (t) => [index("ix_usage_org_time").on(t.orgId, t.createdAt)]
);

export const skills = pgTable(
  "skills",
  {
    id: id(),
    orgId: text("org_id"), // null = platform skill (read-only tenant)
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    content: text("content").notNull(),
    version: integer("version").notNull().default(1),
    isActiveDefault: boolean("is_active_default").notNull().default(false),
    ...timestamps
  },
  (t) => [uniqueIndex("uq_skill").on(t.orgId, t.slug)]
);

export const promptTemplates = pgTable("prompt_templates", {
  id: id(),
  orgId: text("org_id"),
  slug: text("slug").notNull(),
  sections: jsonb("sections").notNull().default({}),
  variables: jsonb("variables").default({}),
  version: integer("version").notNull().default(1),
  createdAt: timestamps.createdAt
});

export const landingSkills = pgTable(
  "landing_skills",
  {
    landingPageId: text("landing_page_id").notNull(),
    skillId: text("skill_id").notNull()
  },
  (t) => [uniqueIndex("uq_landing_skill").on(t.landingPageId, t.skillId)]
);
