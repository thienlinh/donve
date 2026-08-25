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

/** POST /api/products body — `orgId` comes from the session, `type` picks course vs. plain product. */
export const createProductSchema = z.object({
  type: productTypeSchema,
  name: z.string().min(1),
  price: z.coerce.number().int().nonnegative().default(0),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  attributes: jsonRecordSchema.default({}),
  isActive: z.boolean().default(true)
});
export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  type: productTypeSchema.optional(),
  name: z.string().min(1).optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  attributes: jsonRecordSchema.optional(),
  isActive: z.boolean().optional()
});
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

/**
 * products.attributes shape when type="course" (FR-C-02) — a course is just a product with
 * these extra fields folded into the generic JSONB bag, not a separate table (FR-C-06: new
 * product types only ever need a new attribute shape, never a schema migration).
 */
export const courseAttributesSchema = z.object({
  zaloGroupUrl: z.string().optional(),
  activationInstructions: z.string().optional(),
  startsAt: z.coerce.date().optional(),
  /** FR-C-02 "lịch khai giảng" — free-text class schedule (dates/recurring days, cohort name, etc). */
  classSchedule: z.string().optional()
});
export type CourseAttributes = z.infer<typeof courseAttributesSchema>;

/** GET /api/products query params — page/pageSize only, no filters (org catalogs are small). */
export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const productListResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1)
});
export type ProductListResponse = z.infer<typeof productListResponseSchema>;

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
    expireMinutes: z.number().int().positive().optional(),
    /** FR-I-04: paid/fulfilled confirmation email to the lead, opt-in per campaign. */
    emailConfirmationEnabled: z.boolean().optional()
  })
  .default({});
export type CampaignPaymentConfig = z.infer<typeof campaignPaymentConfigSchema>;

/** campaigns.assignmentMode (FR-E-04) — "manual" vs. auto round-robin across org sales members. */
export const campaignAssignmentModeValues = ["manual", "round_robin"] as const;
export const campaignAssignmentModeSchema = z.enum(
  campaignAssignmentModeValues
);
export type CampaignAssignmentMode = z.infer<
  typeof campaignAssignmentModeSchema
>;

export const campaignSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  publicId: z.string(),
  name: z.string().min(1),
  status: campaignStatusSchema.default("draft"),
  goal: z.string().nullable(),
  startsAt: z.coerce.date().nullable(),
  endsAt: z.coerce.date().nullable(),
  formConfig: campaignFormConfigSchema,
  paymentConfig: campaignPaymentConfigSchema,
  utmDefaults: utmSchema.default({}),
  assignmentMode: campaignAssignmentModeSchema.default("manual"),
  roundRobinCursor: ulidSchema.nullable(),
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

/** GET/POST/PATCH /api/campaigns response — `campaigns` row plus its attached product ids (FR-C-03). */
export const campaignWithProductsSchema = campaignSchema.extend({
  productIds: z.array(ulidSchema).default([])
});
export type CampaignWithProducts = z.infer<typeof campaignWithProductsSchema>;

/** GET /api/campaigns query params — page/pageSize plus an optional name search (leads-page
 * parity, FR-C list). */
export const campaignListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional()
});
export type CampaignListQuery = z.infer<typeof campaignListQuerySchema>;

/** PATCH/DELETE /api/campaigns/bulk — table multi-select bulk actions, same
 * row-cap discipline as `bulkUpdateLeadsSchema`/`bulkDeleteLeadsSchema`. */
export const bulkUpdateCampaignsSchema = z.object({
  campaignIds: z.array(ulidSchema).min(1),
  status: campaignStatusSchema
});
export type BulkUpdateCampaignsInput = z.infer<
  typeof bulkUpdateCampaignsSchema
>;

export const bulkDeleteCampaignsSchema = z.object({
  campaignIds: z.array(ulidSchema).min(1)
});
export type BulkDeleteCampaignsInput = z.infer<
  typeof bulkDeleteCampaignsSchema
>;

export const campaignListResponseSchema = z.object({
  campaigns: z.array(campaignWithProductsSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1)
});
export type CampaignListResponse = z.infer<typeof campaignListResponseSchema>;

/** POST /api/campaigns body — `publicId` is generated server-side from `name`. */
export const createCampaignSchema = z.object({
  name: z.string().min(1),
  status: campaignStatusSchema.default("draft"),
  goal: z.string().nullable().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
  formConfig: campaignFormConfigSchema.optional(),
  paymentConfig: campaignPaymentConfigSchema.optional(),
  utmDefaults: utmSchema.optional(),
  assignmentMode: campaignAssignmentModeSchema.default("manual"),
  productIds: z.array(ulidSchema).default([])
});
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  status: campaignStatusSchema.optional(),
  goal: z.string().nullable().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  endsAt: z.coerce.date().nullable().optional(),
  formConfig: campaignFormConfigSchema.optional(),
  paymentConfig: campaignPaymentConfigSchema.optional(),
  utmDefaults: utmSchema.optional(),
  assignmentMode: campaignAssignmentModeSchema.optional(),
  productIds: z.array(ulidSchema).optional()
});
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
