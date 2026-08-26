import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import { deletedAt, id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

export const landingPages = pgTable(
  "landing_pages",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    campaignId: uuid("campaign_id"),
    name: text("name").notNull(),
    currentVersionId: uuid("current_version_id"),
    thumbnailKey: text("thumbnail_key"),
    chatSessionId: uuid("chat_session_id"),
    // "manual" = native PageSpec/json-render page created by hand in Studio, no AI involved
    // (docs/features/landing-pages/page-system/custom-import.md's `native_manual`) — "ai" covers
    // both the legacy srcmap AI flow and the new native-AI PageSpec flow, distinguished instead
    // by whether `pageVersions.spec` is set. "import" is the legacy srcmap-editable import (still
    // gets `htmlKey`+`srcmapKey`, edited via the old comment-mode/patch editor); "custom_import"
    // (`page-system/custom-import.md`) is the new raw-HTML mode — `htmlKey` set, `srcmapKey`
    // always null, no patch-based editing, tracked in `customPageBundles`.
    source: text("source", {
      enum: ["ai", "manual", "import", "custom_import"]
    })
      .notNull()
      .default("ai"),
    ...timestamps,
    deletedAt: deletedAt()
  },
  (t) => [
    index("ix_lp_org").on(t.orgId, t.campaignId),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

export const pageVersions = pgTable(
  "page_versions",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    landingPageId: uuid("landing_page_id").notNull(),
    seq: integer("seq").notNull(),
    // Null for a native (PageSpec) version — `spec` is its source of truth instead; the
    // legacy srcmap flow (source="ai/import") still always sets both.
    htmlKey: text("html_key"),
    srcmapKey: text("srcmap_key"),
    // Native PageSpec source of truth (page-system/page-schema.md) — `{ pageSpec, tokens, seo }`.
    // HTML is a derived artifact, rebuilt at publish time by `@dv/studio-render`, never stored
    // here. Null for the legacy srcmap flow.
    spec: jsonb("spec"),
    origin: text("origin", {
      enum: ["ai_patch", "ai_full", "manual", "import", "restore"]
    }).notNull(),
    patch: jsonb("patch"),
    chatMessageId: uuid("chat_message_id"),
    label: text("label"),
    createdBy: uuid("created_by"),
    createdAt: timestamps.createdAt,
    // set when the retention job prunes htmlKey/srcmapKey from R2 (infra-deployment-cost.md §2) — row stays for history/audit
    prunedAt: timestamp("pruned_at")
  },
  (t) => [
    uniqueIndex("uq_pv").on(t.landingPageId, t.seq),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();

export const pageAssets = pgTable("page_assets", {
  id: id(),
  orgId: uuid("org_id").notNull(),
  landingPageId: uuid("landing_page_id").notNull(),
  fileName: text("file_name").notNull(),
  r2Key: text("r2_key").notNull(),
  mime: text("mime").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  // FR-B-29: video assets only — R2 storage key of the first-frame JPEG extracted client-side
  // (same "raw storage key, not a row reference" convention as pageVersions.htmlKey/srcmapKey).
  // Null for images and for any video whose poster upload failed/was skipped.
  posterKey: text("poster_key"),
  variants: jsonb("variants").default({}),
  source: text("source", {
    enum: ["user_upload", "stock_licensed", "ai_generated", "import"]
  })
    .notNull()
    .default("user_upload"),
  // required when source=stock_licensed: { provider, attribution, sourceUrl }
  license: jsonb("license").default({}),
  // true when an imported HTML pulls in an external image URL of unknown provenance
  unverifiedSource: boolean("unverified_source").notNull().default(false),
  // FR-B-35: tenant ticked "Tôi có quyền sử dụng ảnh này" — gates publish when unverifiedSource=true
  usageConfirmed: boolean("usage_confirmed").notNull().default(false),
  createdAt: timestamps.createdAt
});

/**
 * One image per (entity, kind) for entities that aren't landing pages — org logo, campaign OG
 * image (`architecture-and-data-model.md` §Media/Asset). Deliberately one shared table rather
 * than a column on `organizations`/`campaigns`: there were already 2 owner types at design time.
 * `pageAssets` can't host these — its `landingPageId` is NOT NULL.
 */
export const entityImages = pgTable(
  "entity_images",
  {
    id: id(),
    // RLS org-scope — always set, even when the owner is a campaign.
    orgId: uuid("org_id").notNull(),
    ownerType: text("owner_type", {
      enum: ["organization", "campaign"]
    }).notNull(),
    ownerId: uuid("owner_id").notNull(),
    // "favicon" etc. can be added here later without changing the table shape.
    kind: text("kind", { enum: ["logo", "og_image"] }).notNull(),
    r2Key: text("r2_key").notNull(),
    mime: text("mime").notNull(),
    ...timestamps
  },
  (t) => [
    uniqueIndex("ux_entity_image").on(t.ownerType, t.ownerId, t.kind),
    orgIsolationPolicy()
  ]
).enableRLS();

export const studioComments = pgTable("studio_comments", {
  id: id(),
  orgId: uuid("org_id").notNull(),
  landingPageId: uuid("landing_page_id").notNull(),
  // DOM element id from the srcmap engine (packages/studio-core), not a DB row id — stays text.
  srcmapId: text("srcmap_id").notNull(),
  body: text("body").notNull(),
  screenshotKey: text("screenshot_key"),
  status: text("status", { enum: ["queued", "sent", "resolved"] })
    .notNull()
    .default("queued"),
  createdBy: uuid("created_by"),
  createdAt: timestamps.createdAt
});

export const chatSessions = pgTable("chat_sessions", {
  id: id(),
  orgId: uuid("org_id").notNull(),
  landingPageId: uuid("landing_page_id").notNull(),
  title: text("title"),
  createdAt: timestamps.createdAt
});

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    sessionId: uuid("session_id").notNull(),
    role: text("role", { enum: ["user", "assistant", "tool"] }).notNull(),
    content: jsonb("content").notNull(),
    tokenUsage: jsonb("token_usage"),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_msg_session").on(t.sessionId, t.createdAt),
    orgIsolationPolicy(),
    platformReadPolicy()
  ]
).enableRLS();
