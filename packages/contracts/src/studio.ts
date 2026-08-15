import { z } from "zod"

import {
  orgIdSchema,
  softDeleteSchema,
  timestampsSchema,
  ulidSchema,
} from "./common.js"

export const landingSourceValues = ["ai", "import"] as const
export const landingSourceSchema = z.enum(landingSourceValues)
export type LandingSource = z.infer<typeof landingSourceSchema>

export const landingPageSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  campaignId: ulidSchema.nullable(),
  name: z.string().min(1),
  currentVersionId: ulidSchema.nullable(),
  thumbnailKey: z.string().nullable(),
  chatSessionId: ulidSchema.nullable(),
  source: landingSourceSchema.default("ai"),
  ...timestampsSchema.shape,
  ...softDeleteSchema.shape,
})
export type LandingPage = z.infer<typeof landingPageSchema>

export const pageVersionOriginValues = [
  "ai_patch",
  "ai_full",
  "manual",
  "import",
  "restore",
] as const
export const pageVersionOriginSchema = z.enum(pageVersionOriginValues)
export type PageVersionOrigin = z.infer<typeof pageVersionOriginSchema>

export const pageVersionSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  landingPageId: ulidSchema,
  seq: z.number().int().positive(),
  htmlKey: z.string(),
  srcmapKey: z.string(),
  origin: pageVersionOriginSchema,
  /** ops applied to reach this version — shape owned by @dv/studio-core, not this package. */
  patch: z.unknown().nullable(),
  chatMessageId: ulidSchema.nullable(),
  label: z.string().nullable(),
  createdBy: ulidSchema.nullable(),
  createdAt: z.coerce.date(),
  /** set once the retention job prunes htmlKey/srcmapKey from R2 (row kept for audit history). */
  prunedAt: z.coerce.date().nullable(),
})
export type PageVersion = z.infer<typeof pageVersionSchema>

export const pageAssetSourceValues = [
  "user_upload",
  "stock_licensed",
  "ai_generated",
] as const
export const pageAssetSourceSchema = z.enum(pageAssetSourceValues)
export type PageAssetSource = z.infer<typeof pageAssetSourceSchema>

/** pageAssets.license — required when source=stock_licensed. */
export const pageAssetLicenseSchema = z
  .object({
    provider: z.string().optional(),
    attribution: z.string().optional(),
    sourceUrl: z.string().optional(),
  })
  .default({})
export type PageAssetLicense = z.infer<typeof pageAssetLicenseSchema>

export const pageAssetSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  landingPageId: ulidSchema,
  fileName: z.string(),
  r2Key: z.string(),
  mime: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  /** webp/avif/resized variant keys, keyed by variant name. */
  variants: z.record(z.string(), z.string()).default({}),
  source: pageAssetSourceSchema.default("user_upload"),
  license: pageAssetLicenseSchema,
  /** true when imported HTML pulled an external image URL of unknown provenance. */
  unverifiedSource: z.boolean().default(false),
  createdAt: z.coerce.date(),
})
export type PageAsset = z.infer<typeof pageAssetSchema>

export const studioCommentStatusValues = ["queued", "sent", "resolved"] as const
export const studioCommentStatusSchema = z.enum(studioCommentStatusValues)
export type StudioCommentStatus = z.infer<typeof studioCommentStatusSchema>

export const studioCommentSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  landingPageId: ulidSchema,
  srcmapId: z.string(),
  body: z.string().min(1),
  screenshotKey: z.string().nullable(),
  status: studioCommentStatusSchema.default("queued"),
  createdBy: ulidSchema.nullable(),
  createdAt: z.coerce.date(),
})
export type StudioComment = z.infer<typeof studioCommentSchema>

export const chatSessionSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  landingPageId: ulidSchema,
  title: z.string().nullable(),
  ...timestampsSchema.shape,
})
export type ChatSession = z.infer<typeof chatSessionSchema>

export const chatRoleValues = ["user", "assistant", "tool"] as const
export const chatRoleSchema = z.enum(chatRoleValues)
export type ChatRole = z.infer<typeof chatRoleSchema>

const chatContentPartSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), text: z.string() }),
  z.object({ type: z.literal("image"), url: z.string() }),
  z.object({
    type: z.literal("comment-context"),
    commentId: ulidSchema,
    srcmapId: z.string(),
  }),
  z.object({
    type: z.literal("patch-summary"),
    pageVersionId: ulidSchema,
    summary: z.string(),
  }),
])
export type ChatContentPart = z.infer<typeof chatContentPartSchema>

export const chatMessageTokenUsageSchema = z
  .object({
    inputTokens: z.number().int().nonnegative().optional(),
    outputTokens: z.number().int().nonnegative().optional(),
  })
  .nullable()

export const chatMessageSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  sessionId: ulidSchema,
  role: chatRoleSchema,
  content: z.array(chatContentPartSchema),
  tokenUsage: chatMessageTokenUsageSchema,
  createdAt: z.coerce.date(),
})
export type ChatMessage = z.infer<typeof chatMessageSchema>
