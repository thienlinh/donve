import { z } from "zod"

/** PK format used by every table: ULID, sortable by time (see database-schema.md). */
export const ulidSchema = z
  .string()
  .regex(/^[0-9A-HJKMNP-TV-Z]{26}$/i, "Invalid ULID")

/** Every business entity carries `orgId` for multi-tenant scoping. */
export const orgIdSchema = ulidSchema

export const timestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

/** Soft-delete marker used by leads/landingPages/campaigns/products. */
export const softDeleteSchema = z.object({
  deletedAt: z.coerce.date().nullable(),
})

/** Freeform JSONB bag — used where the doc doesn't pin down a concrete shape. */
export const jsonRecordSchema = z.record(z.string(), z.unknown())

export const utmSchema = z.record(z.string(), z.string())
