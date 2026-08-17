import { z } from "zod";

import {
  jsonRecordSchema,
  orgIdSchema,
  softDeleteSchema,
  timestampsSchema,
  ulidSchema,
  utmSchema
} from "./common.js";

export const productTypeValues = [
  "course",
  "product",
  "service",
  "other"
] as const;
export const productTypeSchema = z.enum(productTypeValues);
export type ProductType = z.infer<typeof productTypeSchema>;

export const productSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  type: productTypeSchema,
  name: z.string().min(1),
  price: z.coerce.number().int().nonnegative().default(0),
  description: z.string().nullable(),
  images: z.array(z.string()).default([]),
  attributes: jsonRecordSchema.default({}),
  isActive: z.boolean().default(true),
  ...timestampsSchema.shape,
  ...softDeleteSchema.shape
});
export type Product = z.infer<typeof productSchema>;

export const campaignStatusValues = [
  "draft",
  "active",
  "paused",
  "ended"
] as const;
export const campaignStatusSchema = z.enum(campaignStatusValues);
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;

const campaignFormFieldSchema = z
  .object({
    key: z.string(),
    label: z.string().optional(),
    type: z.string().optional(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional()
  })
  .catchall(z.unknown());

const campaignPopupSchema = z.object({
  title: z.string(),
  body: z.string()
});

/** campaigns.formConfig — lead-capture form fields + post-submit popup copy. */
export const campaignFormConfigSchema = z
  .object({
    fields: z.array(campaignFormFieldSchema).default([]),
    popups: z
      .object({
        registered: campaignPopupSchema.optional(),
        paid: campaignPopupSchema.optional(),
        manualPending: campaignPopupSchema.optional()
      })
      .default({})
  })
  .default({ fields: [], popups: {} });
export type CampaignFormConfig = z.infer<typeof campaignFormConfigSchema>;

/** campaigns.paymentConfig — per-campaign SePay/BYOK payment settings. */
export const campaignPaymentConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    bankBin: z.string().optional(),
    accountNumber: z.string().optional(),
    accountName: z.string().optional(),
    amountSource: z.enum(["product", "fixed"]).optional(),
    fixedAmount: z.coerce.number().int().nonnegative().optional(),
    transferPrefix: z.string().optional(),
    sepayAuto: z.boolean().optional(),
    zaloGroupUrl: z.string().optional(),
    expireMinutes: z.number().int().positive().optional()
  })
  .default({});
export type CampaignPaymentConfig = z.infer<typeof campaignPaymentConfigSchema>;

export const campaignSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  publicId: z.string(),
  name: z.string().min(1),
  status: campaignStatusSchema.default("draft"),
  startsAt: z.coerce.date().nullable(),
  endsAt: z.coerce.date().nullable(),
  formConfig: campaignFormConfigSchema,
  paymentConfig: campaignPaymentConfigSchema,
  utmDefaults: utmSchema.default({}),
  ...timestampsSchema.shape,
  ...softDeleteSchema.shape
});
export type Campaign = z.infer<typeof campaignSchema>;

export const campaignProductSchema = z.object({
  campaignId: ulidSchema,
  productId: ulidSchema,
  orgId: orgIdSchema
});
export type CampaignProduct = z.infer<typeof campaignProductSchema>;
