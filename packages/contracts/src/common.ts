import { z } from "zod";

/** PK format used by every table: Postgres 18 native uuidv7(), sortable by time. */
export const idSchema = z.uuid();

/** Every business entity carries `orgId` for multi-tenant scoping. */
export const orgIdSchema = idSchema;

export const timestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});

/** Soft-delete marker used by leads/landingPages/campaigns/products. */
export const softDeleteSchema = z.object({
  deletedAt: z.coerce.date().nullable()
});

/** Freeform JSONB bag — used where the doc doesn't pin down a concrete shape. */
export const jsonRecordSchema = z.record(z.string(), z.unknown());

export const utmSchema = z.record(z.string(), z.string());
