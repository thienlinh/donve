import { z } from "zod";

/** Client → `POST /api/telemetry/events`. One `trackEvent()` call = one entry; the endpoint
 * accepts a batch so a future caller with several queued events isn't forced into N round-trips
 * (see `apps/donve/src/lib/telemetry.ts`). */
export const trackEventInputSchema = z.object({
  eventName: z.string().min(1).max(80),
  properties: z.record(z.string(), z.unknown()).optional()
});
export const trackEventsRequestSchema = z.object({
  events: z.array(trackEventInputSchema).min(1).max(50)
});
export type TrackEventInput = z.infer<typeof trackEventInputSchema>;

const usageSummaryDaySchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative()
});
const usageSummaryEventSchema = z.object({
  eventName: z.string(),
  count: z.number().int().nonnegative()
});

/** `GET /api/telemetry/summary` — last 30 days, in-app usage only (see `appUsageEvents` in
 * `packages/db/src/schema/tracking.ts` for how this differs from the visitor-facing landing-page
 * analytics in `analytics.ts`). */
export const usageSummarySchema = z.object({
  days: z.array(usageSummaryDaySchema),
  totalEvents: z.number().int().nonnegative(),
  byEvent: z.array(usageSummaryEventSchema)
});
export type UsageSummary = z.infer<typeof usageSummarySchema>;
