import { z } from "zod";

import {
  orgIdSchema,
  softDeleteSchema,
  timestampsSchema,
  idSchema
} from "./common.js";

export const landingSourceValues = [
  "ai",
  "manual",
  "import",
  "custom_import"
] as const;
export const landingSourceSchema = z.enum(landingSourceValues);
export type LandingSource = z.infer<typeof landingSourceSchema>;

export const landingPageSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  campaignId: idSchema.nullable(),
  name: z.string().min(1),
  currentVersionId: idSchema.nullable(),
  thumbnailKey: z.string().nullable(),
  chatSessionId: idSchema.nullable(),
  source: landingSourceSchema.default("ai"),
  ...timestampsSchema.shape,
  ...softDeleteSchema.shape
});
export type LandingPage = z.infer<typeof landingPageSchema>;

/** List view row — adds fields derived at query time, not stored on `landingPages`. */
export const landingPageListItemSchema = landingPageSchema.extend({
  /** true iff a `deployments` row with status="live" exists for this page — not a stored column. */
  isPublished: z.boolean(),
  /** hostname of the live deployment, if any — lets the UI link to the published site. */
  liveHostname: z.string().nullable(),
  campaignName: z.string().nullable(),
  /** true iff the current version's `spec` is set — the real signal for "this page uses the
   * native/PageSpec editor," independent of `source` (a native-AI page keeps `source: "ai"`
   * forever; only `manual`-created pages are unambiguous from `source` alone). Drives which
   * editor route a gallery card opens into. */
  isNative: z.boolean()
});
export type LandingPageListItem = z.infer<typeof landingPageListItemSchema>;

export const pageVersionOriginValues = [
  "ai_patch",
  "ai_full",
  "manual",
  "import",
  "restore"
] as const;
export const pageVersionOriginSchema = z.enum(pageVersionOriginValues);
export type PageVersionOrigin = z.infer<typeof pageVersionOriginSchema>;

export const pageVersionSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  seq: z.number().int().positive(),
  /** Null for a native (`spec`-only) version — legacy srcmap flow always sets both. */
  htmlKey: z.string().nullable(),
  srcmapKey: z.string().nullable(),
  /** Native PageSpec source of truth (`docs/features/landing-pages/page-system/page-schema.md`)
   * — shape owned by @dv/studio-render, not this package. Null for the legacy srcmap flow. */
  spec: z.unknown().nullable(),
  origin: pageVersionOriginSchema,
  /** ops applied to reach this version — shape owned by @dv/studio-core, not this package. */
  patch: z.unknown().nullable(),
  chatMessageId: idSchema.nullable(),
  label: z.string().nullable(),
  createdBy: idSchema.nullable(),
  createdAt: z.coerce.date(),
  /** set once the retention job prunes htmlKey/srcmapKey from R2 (row kept for audit history). */
  prunedAt: z.coerce.date().nullable()
});
export type PageVersion = z.infer<typeof pageVersionSchema>;

/** Bootstrap payload for the studio editor — landing page plus its current version, if any. */
export const landingPageDetailSchema = landingPageSchema.extend({
  currentVersion: pageVersionSchema.nullable()
});
export type LandingPageDetail = z.infer<typeof landingPageDetailSchema>;

/** FR-B-31: computed once at import time from the imported HTML — never persisted. */
export const funnelGapsSchema = z.object({
  missingLeadForm: z.boolean(),
  missingSeoMeta: z.boolean()
});
export type FunnelGaps = z.infer<typeof funnelGapsSchema>;

export const pageAssetSourceValues = [
  "user_upload",
  "stock_licensed",
  "ai_generated",
  "import"
] as const;
export const pageAssetSourceSchema = z.enum(pageAssetSourceValues);
export type PageAssetSource = z.infer<typeof pageAssetSourceSchema>;

/** pageAssets.license — required when source=stock_licensed. */
export const pageAssetLicenseSchema = z
  .object({
    provider: z.string().optional(),
    attribution: z.string().optional(),
    sourceUrl: z.string().optional()
  })
  .default({});
export type PageAssetLicense = z.infer<typeof pageAssetLicenseSchema>;

export const pageAssetSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  fileName: z.string(),
  r2Key: z.string(),
  mime: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  /** FR-B-29: video assets only — R2 storage key of the extracted first-frame JPEG poster;
   * null for images and for a video whose poster upload was skipped. */
  posterKey: z.string().nullable().default(null),
  /** webp/avif/resized variant keys, keyed by variant name. */
  variants: z.record(z.string(), z.string()).default({}),
  source: pageAssetSourceSchema.default("user_upload"),
  license: pageAssetLicenseSchema,
  /** true when imported HTML pulled an external image URL of unknown provenance. */
  unverifiedSource: z.boolean().default(false),
  /** FR-B-35: tenant ticked "Tôi có quyền sử dụng ảnh này" — required before publish when unverifiedSource=true. */
  usageConfirmed: z.boolean().default(false),
  createdAt: z.coerce.date()
});
export type PageAsset = z.infer<typeof pageAssetSchema>;

/** POST /api/landings/import body (FR-B-30) — exactly one of html/url/file is provided; the
 * file itself travels as multipart form data, so this only types the JSON-shaped fields. */
export const importLandingPageModeSchema = z.enum(["html", "url", "file"]);
export type ImportLandingPageMode = z.infer<typeof importLandingPageModeSchema>;

/** POST /api/landings/:id/generate body (FR-B-21). */
export const generateLandingPageInputSchema = z.object({
  prompt: z.string().trim().min(1).max(4000)
});
export type GenerateLandingPageInput = z.infer<
  typeof generateLandingPageInputSchema
>;

/** One stock-photo search result (FR-B-32/33) — Unsplash or Pexels, commercial-license only. */
export const stockImageCandidateSchema = z.object({
  provider: z.enum(["unsplash", "pexels"]),
  url: z.string(),
  thumbUrl: z.string(),
  attribution: z.string(),
  sourceUrl: z.string()
});
export type StockImageCandidate = z.infer<typeof stockImageCandidateSchema>;

export const studioCommentStatusValues = [
  "queued",
  "sent",
  "resolved"
] as const;
export const studioCommentStatusSchema = z.enum(studioCommentStatusValues);
export type StudioCommentStatus = z.infer<typeof studioCommentStatusSchema>;

export const studioCommentSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  srcmapId: z.string(),
  body: z.string().min(1),
  screenshotKey: z.string().nullable(),
  status: studioCommentStatusSchema.default("queued"),
  createdBy: idSchema.nullable(),
  createdAt: z.coerce.date()
});
export type StudioComment = z.infer<typeof studioCommentSchema>;

export const chatSessionSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  title: z.string().nullable(),
  ...timestampsSchema.shape
});
export type ChatSession = z.infer<typeof chatSessionSchema>;

export const chatRoleValues = ["user", "assistant", "tool"] as const;
export const chatRoleSchema = z.enum(chatRoleValues);
export type ChatRole = z.infer<typeof chatRoleSchema>;

const chatContentPartSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({ type: z.literal("image"), url: z.string() }),
  z.object({
    type: z.literal("comment-context"),
    commentId: idSchema,
    srcmapId: z.string()
  }),
  z.object({
    type: z.literal("patch-summary"),
    pageVersionId: idSchema,
    summary: z.string()
  })
]);
export type ChatContentPart = z.infer<typeof chatContentPartSchema>;

export const chatMessageTokenUsageSchema = z
  .object({
    inputTokens: z.number().int().nonnegative().optional(),
    outputTokens: z.number().int().nonnegative().optional()
  })
  .nullable();

export const chatMessageSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  sessionId: idSchema,
  role: chatRoleSchema,
  content: z.array(chatContentPartSchema),
  tokenUsage: chatMessageTokenUsageSchema,
  createdAt: z.coerce.date()
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * Per-tenant brand tokens for a published native landing page — deliberately separate from
 * the dashboard's own theme (`packages/ui`). Canonical definition lives here (not
 * `@dv/studio-catalog`, which depends on this package, not the other way around) since both
 * the dashboard (Inspector/canvas) and the API (`pageVersions.spec` validation) need it.
 */
export const designTokensSchema = z.object({
  colorPrimary: z.string(),
  colorPrimaryForeground: z.string(),
  colorSurface: z.string(),
  colorForeground: z.string(),
  colorMuted: z.string(),
  colorBorder: z.string(),
  fontHeading: z.string(),
  fontBody: z.string(),
  radius: z.string()
});
export type DesignTokens = z.infer<typeof designTokensSchema>;

/** One `PageSpec` element (page-system/page-schema.md) — envelope-only validation; each
 * element's `props` against its own component Zod schema is a later, tier-1 quality check. */
export const pageSpecElementSchema = z.object({
  type: z.string(),
  props: z.record(z.string(), z.unknown()),
  children: z.array(z.string()).optional(),
  visible: z.unknown().optional()
});
export type PageSpecElement = z.infer<typeof pageSpecElementSchema>;

export const pageSpecSchema = z.object({
  root: z.string(),
  elements: z.record(z.string(), pageSpecElementSchema)
});
export type PageSpec = z.infer<typeof pageSpecSchema>;

/** `elementId -> {purpose, reason}` the Page Architect Agent recorded when it chose that
 * element (`ai/agent-pipeline.md` §Prompt pack §Page Architect) — shown on the Architecture
 * wizard step's cards. Not part of `PageSpec` itself (json-render's own `Spec` shape), so it
 * rides alongside it in the document envelope instead. */
export const architectureNoteSchema = z.object({
  purpose: z.enum([
    "understanding",
    "desire",
    "proof",
    "risk_reduction",
    "action"
  ]),
  reason: z.string()
});
export type ArchitectureNote = z.infer<typeof architectureNoteSchema>;

/** Editable SEO block of a native page document (`architecture-and-data-model.md` §Publish ·
 * Domain · SEO) — surfaced by the Studio's SEO tab. `title` overrides the rendered `<title>`/
 * `og:title` (falls back to the landing page's name), `ogImage.src` points at one of this
 * page's own `pageAssets` (the publish pipeline resolves it back to bytes), `noindex` emits
 * `<meta name="robots" content="noindex">` and takes the page out of its sitemap. */
export const pageSeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.object({ src: z.string(), alt: z.string().optional() }).optional(),
  noindex: z.boolean().optional()
});
export type PageSeo = z.infer<typeof pageSeoSchema>;

/** `pageVersions.spec`'s JSON shape for a native (non-`custom_import`) page — the row's only
 * source of truth (page-system/page-schema.md). */
export const nativePageDocumentSchema = z.object({
  pageSpec: pageSpecSchema,
  tokens: designTokensSchema,
  seo: pageSeoSchema.optional(),
  architectureNotes: z.record(z.string(), architectureNoteSchema).optional()
});
export type NativePageDocument = z.infer<typeof nativePageDocumentSchema>;

/** `PATCH /api/landings/:id/spec` body. */
export const updateLandingPageSpecInputSchema = nativePageDocumentSchema;
export type UpdateLandingPageSpecInput = z.infer<
  typeof updateLandingPageSpecInputSchema
>;

/** Pre-built starting point offered in the "create landing page" flow — shared across every
 * org (`packages/db/src/schema/templates.ts`), not tenant content. */
export const templateSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  industry: z.string().min(1),
  thumbnailKey: z.string().nullable(),
  pageSpec: pageSpecSchema,
  tokens: designTokensSchema,
  seo: pageSeoSchema.optional().nullable(),
  architectureNotes: z
    .record(z.string(), architectureNoteSchema)
    .optional()
    .nullable(),
  createdAt: timestampsSchema.shape.createdAt
});
export type Template = z.infer<typeof templateSchema>;
