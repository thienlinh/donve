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
import {
  orgIsolationPolicy,
  orgOrPlatformReadPolicy,
  platformReadPolicy
} from "./rls.js";

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
  () => [orgIsolationPolicy(), platformReadPolicy()]
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
  (t) => [
    uniqueIndex("uq_skill").on(t.orgId, t.slug),
    orgIsolationPolicy(),
    orgOrPlatformReadPolicy()
  ]
).enableRLS();

export const promptTemplates = pgTable(
  "prompt_templates",
  {
    id: id(),
    orgId: text("org_id"), // null = platform-wide template (read-only tenant)
    slug: text("slug").notNull(),
    sections: jsonb("sections").notNull().default([]),
    variables: jsonb("variables").default([]),
    version: integer("version").notNull().default(1),
    ...timestamps
  },
  (t) => [
    uniqueIndex("uq_prompt_template").on(t.orgId, t.slug),
    orgIsolationPolicy(),
    orgOrPlatformReadPolicy()
  ]
).enableRLS();

export const promptTestRuns = pgTable(
  "prompt_test_runs",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    promptTemplateId: text("prompt_template_id").notNull(),
    model: text("model").notNull(),
    compiledPrompt: text("compiled_prompt").notNull(),
    outputHtml: text("output_html").notNull(),
    // null when the runtime can't launch Chrome (CF Workers) — see lighthouse-sandbox.ts.
    lighthouse: jsonb("lighthouse"),
    usage: jsonb("usage").notNull(),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_prompt_test_runs_template").on(t.promptTemplateId, t.createdAt),
    orgIsolationPolicy()
  ]
).enableRLS();

export const landingSkills = pgTable(
  "landing_skills",
  {
    landingPageId: text("landing_page_id").notNull(),
    skillId: text("skill_id").notNull()
  },
  (t) => [uniqueIndex("uq_landing_skill").on(t.landingPageId, t.skillId)]
);
