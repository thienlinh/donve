import { z } from "zod";

import { orderSchema, orderStatusSchema } from "./crm.js";

export const operatingSummarySourceSchema = z.object({
  source: z.string().min(1),
  leads: z.number().int().nonnegative(),
  paidOrders: z.number().int().nonnegative()
});
export type OperatingSummarySource = z.infer<
  typeof operatingSummarySourceSchema
>;

export const operatingSummaryActionSchema = z.object({
  kind: z.enum(["lead", "payment", "fulfillment"]),
  label: z.string().min(1),
  count: z.number().int().nonnegative(),
  href: z.string().min(1)
});
export type OperatingSummaryAction = z.infer<
  typeof operatingSummaryActionSchema
>;

/** Daily operating queue. This is intentionally action-oriented, not a BI report. */
export const operatingSummarySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  leads: z.number().int().nonnegative(),
  orders: z.number().int().nonnegative(),
  paid: z.number().int().nonnegative(),
  revenue: z.number().int().nonnegative(),
  pendingFulfillment: z.number().int().nonnegative(),
  unresolvedPayments: z.number().int().nonnegative(),
  sources: z.array(operatingSummarySourceSchema),
  nextActions: z.array(operatingSummaryActionSchema)
});
export type OperatingSummary = z.infer<typeof operatingSummarySchema>;

export const orderDeskItemSchema = orderSchema.extend({
  leadFullName: z.string().min(1),
  leadPhone: z.string().min(1),
  leadEmail: z.email().nullable(),
  source: z.string().nullable()
});
export type OrderDeskItem = z.infer<typeof orderDeskItemSchema>;

export const orderDeskResponseSchema = z.object({
  orders: z.array(orderDeskItemSchema)
});
export type OrderDeskResponse = z.infer<typeof orderDeskResponseSchema>;

export const orderDeskStatusSchema = orderStatusSchema.or(z.literal("all"));
