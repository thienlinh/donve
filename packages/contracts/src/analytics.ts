import { z } from "zod";

import { orgIdSchema, idSchema } from "./common.js";

export const eventTypeValues = [
  // Legacy beacon types (existing campaign-analytics buckets depend on these — kept, not
  // renamed, so already-published pages/cached runtime bundles keep working).
  "view",
  "submit",
  "order_created",
  "paid_popup",
  "zalo_click",
  // `tracking-and-attribution.md` §Event naming — the conversion-hierarchy vocabulary emitted
  // by the native-page runtime (`apps/landing-runtime`) and each catalog component's declared
  // `trackingEvents`.
  "page_viewed",
  "section_viewed",
  "cta_clicked",
  "form_started",
  "form_submitted",
  "lead_created",
  "pricing_viewed",
  "faq_opened",
  "outbound_link_clicked",
  "lead_stage_changed",
  "share_link_created",
  "offer_published",
  "test_lead_submitted",
  "source_compared"
] as const;
export const eventTypeSchema = z.enum(eventTypeValues);
export type EventType = z.infer<typeof eventTypeSchema>;

/** `tracking-and-attribution.md` §UTM governance — the beacon rejects a `utm` object with any
 * other shape before it ever reaches `events`. `strict()` so an unknown `utm_*` key is a
 * rejection too, not silently dropped or passed through. */
export const utmSourceValues = [
  "google",
  "meta",
  "linkedin",
  "newsletter",
  "tiktok",
  "facebook",
  "zalo",
  "direct"
] as const;
export const utmMediumValues = [
  "cpc",
  "paid_social",
  "email",
  "organic",
  "referral"
] as const;

export const landingUtmSchema = z.strictObject({
  utm_source: z.enum(utmSourceValues).optional(),
  utm_medium: z.enum(utmMediumValues).optional(),
  utm_campaign: z.string().min(1).max(120).optional(),
  utm_content: z.string().min(1).max(120).optional(),
  utm_term: z.string().min(1).max(120).optional()
});
export type LandingUtm = z.infer<typeof landingUtmSchema>;

/** events.meta — e.g. utm, referrer; open-ended since the edge beacon can add fields freely. */
export const eventMetaSchema = z
  .object({
    utm: z.record(z.string(), z.string()).optional(),
    referrer: z.string().optional()
  })
  .catchall(z.unknown())
  .default({});
export type EventMeta = z.infer<typeof eventMetaSchema>;

/** append-only, written from the edge beacon — no updatedAt. */
export const eventSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  campaignId: idSchema.nullable(),
  deploymentId: idSchema.nullable(),
  type: z.union([eventTypeSchema, z.string()]),
  /** hash(ip+ua+day) — no PII. */
  sessionHash: z.string().nullable(),
  /** `tracking-and-attribution.md` §Identity — first-party id, set client-side by
   * `apps/landing-runtime` (`localStorage`), null on events with no client (offline conversion). */
  anonymousId: z.string().nullable(),
  landingPageId: idSchema.nullable(),
  pageVersionId: idSchema.nullable(),
  meta: eventMetaSchema,
  createdAt: z.coerce.date()
});
export type Event = z.infer<typeof eventSchema>;

/** `tracking-and-attribution.md` §Event registry — one row per `(elementId, eventName)` a
 * chosen component actually declares, snapshotted at Page Architect / Auto Fixer time. */
export const eventDefinitionSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  pageVersionId: idSchema,
  eventName: z.string(),
  elementId: z.string().nullable(),
  componentId: z.string(),
  requiredProperties: z.array(z.string()).default([]),
  createdAt: z.coerce.date()
});
export type EventDefinition = z.infer<typeof eventDefinitionSchema>;

/** GET /api/campaigns/:id/analytics response (FR-C-05) — one row per day in the requested range. */
export const campaignAnalyticsDaySchema = z.object({
  date: z.string(),
  views: z.number().int().nonnegative(),
  submits: z.number().int().nonnegative(),
  orders: z.number().int().nonnegative(),
  revenue: z.number().int().nonnegative()
});
export type CampaignAnalyticsDay = z.infer<typeof campaignAnalyticsDaySchema>;

/** One row of the traffic-source breakdown — `source` is a `utmSourceValues` entry or
 * `"direct"` for traffic with no `utm_source` (untagged links, direct visits). */
export const campaignAnalyticsSourceSchema = z.object({
  source: z.string(),
  views: z.number().int().nonnegative(),
  submits: z.number().int().nonnegative(),
  orders: z.number().int().nonnegative(),
  revenue: z.number().int().nonnegative(),
  conversionRate: z.number().min(0).max(1)
});
export type CampaignAnalyticsSource = z.infer<
  typeof campaignAnalyticsSourceSchema
>;

export const campaignAnalyticsSchema = z.object({
  days: z.array(campaignAnalyticsDaySchema),
  totals: z.object({
    views: z.number().int().nonnegative(),
    submits: z.number().int().nonnegative(),
    orders: z.number().int().nonnegative(),
    /** reconciled revenue only — orders with status `paid`/`fulfilled`. */
    revenue: z.number().int().nonnegative(),
    conversionRate: z.number().min(0).max(1)
  }),
  /** Traffic-source breakdown, same 30-day window as `days` — sorted by `views` descending. */
  bySource: z.array(campaignAnalyticsSourceSchema)
});
export type CampaignAnalytics = z.infer<typeof campaignAnalyticsSchema>;

export const sourceLinkSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  campaignId: idSchema,
  landingPageId: idSchema.nullable(),
  name: z.string().min(1).max(80),
  key: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*$/)
    .max(60),
  utmSource: z.enum(utmSourceValues),
  utmMedium: z.enum(utmMediumValues),
  utmCampaign: z.string().min(1).max(120),
  utmContent: z.string().min(1).max(120),
  utmTerm: z.string().max(120).nullable(),
  targetUrl: z.url(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type SourceLink = z.infer<typeof sourceLinkSchema>;

export const createSourceLinkSchema = z.object({
  name: z.string().trim().min(1).max(80),
  key: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9][a-z0-9-]*$/),
  landingPageId: idSchema.optional(),
  utmSource: z.enum(utmSourceValues),
  utmMedium: z.enum(utmMediumValues),
  utmCampaign: z.string().trim().min(1).max(120),
  utmContent: z.string().trim().min(1).max(120),
  utmTerm: z.string().trim().max(120).optional()
});
export type CreateSourceLinkInput = z.infer<typeof createSourceLinkSchema>;

export const sourceLinkListResponseSchema = z.object({
  links: z.array(sourceLinkSchema)
});
