import { z } from "zod";

import { orgIdSchema, ulidSchema } from "./common.js";

export const eventTypeValues = [
  "view",
  "submit",
  "order_created",
  "paid_popup",
  "zalo_click"
] as const;
export const eventTypeSchema = z.enum(eventTypeValues);
export type EventType = z.infer<typeof eventTypeSchema>;

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
  id: ulidSchema,
  orgId: orgIdSchema,
  campaignId: ulidSchema.nullable(),
  deploymentId: ulidSchema.nullable(),
  type: z.union([eventTypeSchema, z.string()]),
  /** hash(ip+ua+day) — no PII. */
  sessionHash: z.string().nullable(),
  meta: eventMetaSchema,
  createdAt: z.coerce.date()
});
export type Event = z.infer<typeof eventSchema>;

/** GET /api/campaigns/:id/analytics response (FR-C-05) — one row per day in the requested range. */
export const campaignAnalyticsDaySchema = z.object({
  date: z.string(),
  views: z.number().int().nonnegative(),
  submits: z.number().int().nonnegative(),
  orders: z.number().int().nonnegative(),
  revenue: z.number().int().nonnegative()
});
export type CampaignAnalyticsDay = z.infer<typeof campaignAnalyticsDaySchema>;

export const campaignAnalyticsSchema = z.object({
  days: z.array(campaignAnalyticsDaySchema),
  totals: z.object({
    views: z.number().int().nonnegative(),
    submits: z.number().int().nonnegative(),
    orders: z.number().int().nonnegative(),
    /** reconciled revenue only — orders with status `paid`/`fulfilled`. */
    revenue: z.number().int().nonnegative(),
    conversionRate: z.number().min(0).max(1)
  })
});
export type CampaignAnalytics = z.infer<typeof campaignAnalyticsSchema>;
