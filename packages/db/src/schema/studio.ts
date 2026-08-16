import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { deletedAt, id, timestamps } from "./columns.js"
import { orgIsolationPolicy } from "./rls.js"

export const landingPages = pgTable(
  "landing_pages",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    campaignId: text("campaign_id"),
    name: text("name").notNull(),
    currentVersionId: text("current_version_id"),
    thumbnailKey: text("thumbnail_key"),
    chatSessionId: text("chat_session_id"),
    source: text("source", { enum: ["ai", "import"] })
      .notNull()
      .default("ai"),
    ...timestamps,
    deletedAt: deletedAt(),
  },
  (t) => [index("ix_lp_org").on(t.orgId, t.campaignId)]
)

export const pageVersions = pgTable(
  "page_versions",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    landingPageId: text("landing_page_id").notNull(),
    seq: integer("seq").notNull(),
    htmlKey: text("html_key").notNull(),
    srcmapKey: text("srcmap_key").notNull(),
    origin: text("origin", {
      enum: ["ai_patch", "ai_full", "manual", "import", "restore"],
    }).notNull(),
    patch: jsonb("patch"),
    chatMessageId: text("chat_message_id"),
    label: text("label"),
    createdBy: text("created_by"),
    createdAt: timestamps.createdAt,
    // set when the retention job prunes htmlKey/srcmapKey from R2 (infra-deployment-cost.md §2) — row stays for history/audit
    prunedAt: timestamp("pruned_at"),
  },
  (t) => [uniqueIndex("uq_pv").on(t.landingPageId, t.seq)]
)

export const pageAssets = pgTable("page_assets", {
  id: id(),
  orgId: text("org_id").notNull(),
  landingPageId: text("landing_page_id").notNull(),
  fileName: text("file_name").notNull(),
  r2Key: text("r2_key").notNull(),
  mime: text("mime").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  variants: jsonb("variants").default({}),
  source: text("source", {
    enum: ["user_upload", "stock_licensed", "ai_generated"],
  })
    .notNull()
    .default("user_upload"),
  // required when source=stock_licensed: { provider, attribution, sourceUrl }
  license: jsonb("license").default({}),
  // true when an imported HTML pulls in an external image URL of unknown provenance
  unverifiedSource: boolean("unverified_source").notNull().default(false),
  createdAt: timestamps.createdAt,
})

export const studioComments = pgTable("studio_comments", {
  id: id(),
  orgId: text("org_id").notNull(),
  landingPageId: text("landing_page_id").notNull(),
  srcmapId: text("srcmap_id").notNull(),
  body: text("body").notNull(),
  screenshotKey: text("screenshot_key"),
  status: text("status", { enum: ["queued", "sent", "resolved"] })
    .notNull()
    .default("queued"),
  createdBy: text("created_by"),
  createdAt: timestamps.createdAt,
})

export const chatSessions = pgTable("chat_sessions", {
  id: id(),
  orgId: text("org_id").notNull(),
  landingPageId: text("landing_page_id").notNull(),
  title: text("title"),
  createdAt: timestamps.createdAt,
})

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: id(),
    orgId: text("org_id").notNull(),
    sessionId: text("session_id").notNull(),
    role: text("role", { enum: ["user", "assistant", "tool"] }).notNull(),
    content: jsonb("content").notNull(),
    tokenUsage: jsonb("token_usage"),
    createdAt: timestamps.createdAt,
  },
  (t) => [
    index("ix_msg_session").on(t.sessionId, t.createdAt),
    orgIsolationPolicy(),
  ]
).enableRLS()
