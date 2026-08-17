import { z } from "zod";

import {
  jsonRecordSchema,
  orgIdSchema,
  softDeleteSchema,
  timestampsSchema,
  ulidSchema,
  utmSchema
} from "./common.js";

export const leadSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  campaignId: ulidSchema,
  fullName: z.string().min(1),
  /** normalized to +84 format. */
  phone: z.string(),
  email: z.email().nullable(),
  persona: z.string().nullable(),
  customFields: jsonRecordSchema.default({}),
  utm: utmSchema.default({}),
  /** value validated against organizations.settings.pipeline at the app layer. */
  stage: z.string().default("new"),
  assigneeId: ulidSchema.nullable(),
  ...timestampsSchema.shape,
  ...softDeleteSchema.shape
});
export type Lead = z.infer<typeof leadSchema>;

export const leadActivityTypeValues = [
  "note",
  "call",
  "stage_change",
  "order_created",
  "payment",
  "resubmit",
  "system"
] as const;
export const leadActivityTypeSchema = z.enum(leadActivityTypeValues);
export type LeadActivityType = z.infer<typeof leadActivityTypeSchema>;

export const leadActivitySchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  leadId: ulidSchema,
  type: leadActivityTypeSchema,
  body: z.string().nullable(),
  meta: jsonRecordSchema.default({}),
  actorId: ulidSchema.nullable(),
  createdAt: z.coerce.date()
});
export type LeadActivity = z.infer<typeof leadActivitySchema>;

/** consent trail required under Nghị định 13/2023/NĐ-CP on personal data protection. */
export const consentSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  leadId: ulidSchema,
  consentType: z.string().default("data_collection"),
  policyVersion: z.string(),
  ip: z.string().nullable(),
  createdAt: z.coerce.date()
});
export type Consent = z.infer<typeof consentSchema>;

export const orderStatusValues = [
  "pending",
  "awaiting_confirmation",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded"
] as const;
export const orderStatusSchema = z.enum(orderStatusValues);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  /** transfer-content code, e.g. "DV4F7K" — 6 base32 chars + 1 checksum char. */
  code: z.string(),
  leadId: ulidSchema,
  campaignId: ulidSchema,
  productId: ulidSchema.nullable(),
  amount: z.coerce.number().int().nonnegative(),
  status: orderStatusSchema.default("pending"),
  paidAt: z.coerce.date().nullable(),
  fulfilledAt: z.coerce.date().nullable(),
  expiresAt: z.coerce.date().nullable(),
  ...timestampsSchema.shape
});
export type Order = z.infer<typeof orderSchema>;

export const paymentMatchTypeValues = ["auto", "fuzzy", "manual"] as const;
export const paymentMatchTypeSchema = z.enum(paymentMatchTypeValues);
export type PaymentMatchType = z.infer<typeof paymentMatchTypeSchema>;

export const paymentSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  orderId: ulidSchema.nullable(),
  provider: z.string().default("sepay"),
  providerTxId: z.string(),
  amount: z.coerce.number().int().nonnegative(),
  /** raw webhook payload, shape is provider-specific and untyped here. */
  rawPayload: jsonRecordSchema,
  matchType: paymentMatchTypeSchema.nullable(),
  createdAt: z.coerce.date()
});
export type Payment = z.infer<typeof paymentSchema>;

export const paymentConnectionStatusValues = ["active", "invalid"] as const;
export const paymentConnectionStatusSchema = z.enum(
  paymentConnectionStatusValues
);
export type PaymentConnectionStatus = z.infer<
  typeof paymentConnectionStatusSchema
>;

/** non-custodial: each org connects its own payment provider account (BYOK-style). */
export const paymentConnectionSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  provider: z.string().default("sepay"),
  encryptedApiKey: z.string(),
  bankBin: z.string(),
  accountNumber: z.string(),
  accountName: z.string(),
  status: paymentConnectionStatusSchema.default("active"),
  createdAt: z.coerce.date()
});
export type PaymentConnection = z.infer<typeof paymentConnectionSchema>;

export const unmatchedTransactionReasonValues = [
  "no_candidate",
  "ambiguous",
  "already_paid"
] as const;
export const unmatchedTransactionReasonSchema = z.enum(
  unmatchedTransactionReasonValues
);
export type UnmatchedTransactionReason = z.infer<
  typeof unmatchedTransactionReasonSchema
>;

export const unmatchedTransactionStatusValues = [
  "pending",
  "resolved"
] as const;
export const unmatchedTransactionStatusSchema = z.enum(
  unmatchedTransactionStatusValues
);
export type UnmatchedTransactionStatus = z.infer<
  typeof unmatchedTransactionStatusSchema
>;

export const unmatchedTransactionSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  providerTxId: z.string(),
  rawPayload: jsonRecordSchema,
  reason: unmatchedTransactionReasonSchema,
  /** populated when reason=ambiguous; candidates are ranked at the app layer. */
  candidateOrderIds: z.array(ulidSchema).default([]),
  status: unmatchedTransactionStatusSchema.default("pending"),
  resolvedOrderId: ulidSchema.nullable(),
  resolvedBy: ulidSchema.nullable(),
  resolvedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date()
});
export type UnmatchedTransaction = z.infer<typeof unmatchedTransactionSchema>;

export const refundReasonValues = [
  "customer_request",
  "duplicate_payment",
  "wrong_match",
  "other"
] as const;
export const refundReasonSchema = z.enum(refundReasonValues);
export type RefundReason = z.infer<typeof refundReasonSchema>;

export const refundStatusValues = [
  "pending",
  "processing",
  "completed",
  "rejected"
] as const;
export const refundStatusSchema = z.enum(refundStatusValues);
export type RefundStatus = z.infer<typeof refundStatusSchema>;

/** refundRequests.remitterInfo — extracted from payments.rawPayload when the provider exposes it. */
export const remitterInfoSchema = z
  .object({
    name: z.string().optional(),
    accountNumber: z.string().optional()
  })
  .catchall(z.unknown())
  .default({});
export type RemitterInfo = z.infer<typeof remitterInfoSchema>;

/** manual refund flow — platform never holds funds, ops must transfer the refund themselves. */
export const refundRequestSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  orderId: ulidSchema,
  paymentId: ulidSchema.nullable(),
  reason: refundReasonSchema,
  amount: z.coerce.number().int().nonnegative(),
  remitterInfo: remitterInfoSchema,
  status: refundStatusSchema.default("pending"),
  evidenceKey: z.string().nullable(),
  createdBy: ulidSchema.nullable(),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable()
});
export type RefundRequest = z.infer<typeof refundRequestSchema>;
