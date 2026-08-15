import { z } from "zod"

import { orgIdSchema, ulidSchema } from "./common.js"

export const eventTypeValues = [
  "view",
  "submit",
  "order_created",
  "paid_popup",
  "zalo_click",
] as const
export const eventTypeSchema = z.enum(eventTypeValues)
export type EventType = z.infer<typeof eventTypeSchema>

/** events.meta — e.g. utm, referrer; open-ended since the edge beacon can add fields freely. */
export const eventMetaSchema = z
  .object({
    utm: z.record(z.string(), z.string()).optional(),
    referrer: z.string().optional(),
  })
  .catchall(z.unknown())
  .default({})
export type EventMeta = z.infer<typeof eventMetaSchema>

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
  createdAt: z.coerce.date(),
})
export type Event = z.infer<typeof eventSchema>
