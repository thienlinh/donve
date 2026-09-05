import { z } from "zod";

import { idSchema, orgIdSchema } from "./common.js";

export const fulfillmentTypeValues = [
  "link",
  "zalo",
  "schedule",
  "manual"
] as const;
export const fulfillmentTypeSchema = z.enum(fulfillmentTypeValues);
export type FulfillmentType = z.infer<typeof fulfillmentTypeSchema>;

export const fulfillmentStatusValues = [
  "pending",
  "processing",
  "completed",
  "failed"
] as const;
export const fulfillmentStatusSchema = z.enum(fulfillmentStatusValues);
export type FulfillmentStatus = z.infer<typeof fulfillmentStatusSchema>;

export const fulfillmentConfigSchema = z.object({
  resourceUrl: z.url().optional(),
  zaloGroupUrl: z.url().optional(),
  instructions: z.string().max(4000).optional(),
  scheduledAt: z.coerce.date().optional()
});
export type FulfillmentConfig = z.infer<typeof fulfillmentConfigSchema>;

export const fulfillmentTaskSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  orderId: idSchema,
  type: fulfillmentTypeSchema,
  status: fulfillmentStatusSchema,
  config: fulfillmentConfigSchema,
  attempts: z.number().int().nonnegative(),
  lastError: z.string().nullable(),
  completedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type FulfillmentTask = z.infer<typeof fulfillmentTaskSchema>;

export const executeFulfillmentSchema = z.object({
  confirmationNote: z.string().trim().max(1000).optional()
});
export type ExecuteFulfillmentInput = z.infer<typeof executeFulfillmentSchema>;

export const fulfillmentTaskResponseSchema = z.object({
  task: fulfillmentTaskSchema
});
