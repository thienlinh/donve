import { z } from "zod";

import {
  jsonRecordSchema,
  orgIdSchema,
  softDeleteSchema,
  timestampsSchema,
  idSchema,
  utmSchema
} from "./common.js";

export const leadSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  campaignId: idSchema,
  fullName: z.string().min(1),
  /** normalized to +84 format. */
  phone: z.string(),
  email: z.email().nullable(),
  persona: z.string().nullable(),
  customFields: jsonRecordSchema.default({}),
  utm: utmSchema.default({}),
  /** value validated against organizations.settings.pipeline at the app layer. */
  stage: z.string().default("new"),
  assigneeId: idSchema.nullable(),
  ...timestampsSchema.shape,
  ...softDeleteSchema.shape,
  /** NFR-10/NFR-11 — set once phone/email/customFields have been scrubbed. */
  anonymizedAt: z.coerce.date().nullable(),
  /** Auto-assignment + inbox UX (bulk workflows) — optional while the backend rollout is in
   * flight, so older rows/clients don't break the parse. */
  source: z
    .enum([
      "landing_page",
      "facebook",
      "zalo_oa",
      "manual",
      "csv_import",
      "generic",
      "google_ads",
      "tiktok"
    ])
    .optional(),
  lastViewedAt: z.coerce.date().nullable().optional(),
  hoursSinceActivity: z.number().nonnegative().optional(),
  /** lifetime order count/spend across every campaign this lead ever ordered from — only
   * present on list-row responses (`GET /leads`), same as `hoursSinceActivity`. */
  orderCount: z.number().int().nonnegative().optional(),
  totalPaidAmount: z.number().int().nonnegative().optional()
});
export type Lead = z.infer<typeof leadSchema>;
export type LeadSource = NonNullable<Lead["source"]>;

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
  id: idSchema,
  orgId: orgIdSchema,
  leadId: idSchema,
  type: leadActivityTypeSchema,
  body: z.string().nullable(),
  meta: jsonRecordSchema.default({}),
  actorId: idSchema.nullable(),
  createdAt: z.coerce.date()
});
export type LeadActivity = z.infer<typeof leadActivitySchema>;

/** consent trail required under Nghị định 13/2023/NĐ-CP on personal data protection. */
export const consentSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  leadId: idSchema,
  consentType: z.string().default("data_collection"),
  policyVersion: z.string(),
  ip: z.string().nullable(),
  createdAt: z.coerce.date()
});
export type Consent = z.infer<typeof consentSchema>;

export const dataSubjectRequestTypeValues = ["delete", "export"] as const;
export const dataSubjectRequestTypeSchema = z.enum(
  dataSubjectRequestTypeValues
);
export type DataSubjectRequestType = z.infer<
  typeof dataSubjectRequestTypeSchema
>;

export const dataSubjectRequestStatusValues = ["pending", "completed"] as const;
export const dataSubjectRequestStatusSchema = z.enum(
  dataSubjectRequestStatusValues
);
export type DataSubjectRequestStatus = z.infer<
  typeof dataSubjectRequestStatusSchema
>;

/** NFR-10 (Nghị định 13/2023/NĐ-CP) — a lead's delete/export request, tracked against the
 * org's own 72h response SLA (NFR-12: the org is the data controller, not the platform). */
export const dataSubjectRequestSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  leadId: idSchema,
  requestType: dataSubjectRequestTypeSchema,
  receivedAt: z.coerce.date(),
  /** `receivedAt` + 72h, computed and stored at write time. */
  dueAt: z.coerce.date(),
  status: dataSubjectRequestStatusSchema.default("pending"),
  resolvedAt: z.coerce.date().nullable(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date()
});
export type DataSubjectRequest = z.infer<typeof dataSubjectRequestSchema>;

/** POST /api/leads/:leadId/data-subject-requests body — `receivedAt` defaults to now server-side
 * when omitted (staff may log a request a bit after it actually came in). */
export const createDataSubjectRequestSchema = z.object({
  requestType: dataSubjectRequestTypeSchema,
  receivedAt: z.coerce.date().optional(),
  notes: z.string().nullable().optional()
});
export type CreateDataSubjectRequestInput = z.infer<
  typeof createDataSubjectRequestSchema
>;

export const dataSubjectRequestListSchema = z.object({
  dataSubjectRequests: z.array(dataSubjectRequestSchema)
});
export type DataSubjectRequestList = z.infer<
  typeof dataSubjectRequestListSchema
>;

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
  id: idSchema,
  orgId: orgIdSchema,
  /** transfer-content code, e.g. "DV4F7K" — 6 base32 chars + 1 checksum char. */
  code: z.string(),
  leadId: idSchema,
  campaignId: idSchema,
  productId: idSchema.nullable(),
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
  id: idSchema,
  orgId: orgIdSchema,
  orderId: idSchema.nullable(),
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
  id: idSchema,
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

/** What API routes should actually serialize — never `encryptedApiKey` (same threat model as `publicAiConnectionSchema`). */
export const publicPaymentConnectionSchema = paymentConnectionSchema.omit({
  encryptedApiKey: true
});
export type PublicPaymentConnection = z.infer<
  typeof publicPaymentConnectionSchema
>;

/** POST /api/payments/connections body (FR-D-15). SePay is the only driver wired up so far — no `provider` field yet. */
export const connectPaymentConnectionSchema = z.object({
  bankBin: z.string().regex(/^\d{6}$/, "bankBin must be 6 digits"),
  accountNumber: z.string().min(1),
  accountName: z.string().min(1),
  apiKey: z.string().min(1)
});
export type ConnectPaymentConnectionInput = z.infer<
  typeof connectPaymentConnectionSchema
>;

/** GET /api/payments/connections/guide response — mirrors `@dv/drivers` payments.PaymentConnectionGuide. */
export const paymentConnectionGuideSchema = z.object({
  provider: z.string(),
  steps: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional()
    })
  )
});
export type PaymentConnectionGuide = z.infer<
  typeof paymentConnectionGuideSchema
>;

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
  id: idSchema,
  orgId: orgIdSchema,
  providerTxId: z.string(),
  rawPayload: jsonRecordSchema,
  reason: unmatchedTransactionReasonSchema,
  /** populated when reason=ambiguous; candidates are ranked at the app layer. */
  candidateOrderIds: z.array(idSchema).default([]),
  status: unmatchedTransactionStatusSchema.default("pending"),
  resolvedOrderId: idSchema.nullable(),
  resolvedBy: idSchema.nullable(),
  resolvedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date()
});
export type UnmatchedTransaction = z.infer<typeof unmatchedTransactionSchema>;

/** One `candidateOrderIds` entry hydrated with order/lead info for the FR-D-09 manual picker. */
export const unmatchedTransactionCandidateSchema = z.object({
  orderId: idSchema,
  code: z.string(),
  amount: z.coerce.number().int().nonnegative(),
  leadFullName: z.string(),
  leadPhone: z.string()
});
export type UnmatchedTransactionCandidate = z.infer<
  typeof unmatchedTransactionCandidateSchema
>;

/** GET /api/payments/unmatched response item (FR-D-09). */
export const unmatchedTransactionWithCandidatesSchema =
  unmatchedTransactionSchema.extend({
    /** transaction amount pulled from `rawPayload` — provider-specific, see `extractPaymentAmount`. */
    amount: z.coerce.number().int().nonnegative().nullable(),
    candidates: z.array(unmatchedTransactionCandidateSchema)
  });
export type UnmatchedTransactionWithCandidates = z.infer<
  typeof unmatchedTransactionWithCandidatesSchema
>;

/** POST /api/payments/unmatched/:id/resolve body — manual match, writes `matchType=manual`.
 * `dismissed` is the alternative for transactions with nothing to attach to (`already_paid`,
 * or a sales rep giving up on `no_candidate`) — resolves the row without recording a payment. */
export const resolveUnmatchedTransactionSchema = z
  .object({
    orderId: idSchema.optional(),
    dismissed: z.literal(true).optional()
  })
  .refine((body) => body.orderId !== undefined || body.dismissed === true, {
    message: "orderId or dismissed is required"
  });
export type ResolveUnmatchedTransactionInput = z.infer<
  typeof resolveUnmatchedTransactionSchema
>;

/** GET /api/payments/orders/search response item — manual order picker for `no_candidate`
 * unmatched transactions (FR-D-09). Same shape as the ranked-candidate picker. */
export const orderSearchResultSchema = unmatchedTransactionCandidateSchema;
export type OrderSearchResult = z.infer<typeof orderSearchResultSchema>;

export const orderSearchResponseSchema = z.object({
  orders: z.array(orderSearchResultSchema)
});
export type OrderSearchResponse = z.infer<typeof orderSearchResponseSchema>;

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
  id: idSchema,
  orgId: orgIdSchema,
  orderId: idSchema,
  paymentId: idSchema.nullable(),
  reason: refundReasonSchema,
  amount: z.coerce.number().int().nonnegative(),
  remitterInfo: remitterInfoSchema,
  status: refundStatusSchema.default("pending"),
  evidenceKey: z.string().nullable(),
  createdBy: idSchema.nullable(),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable()
});
export type RefundRequest = z.infer<typeof refundRequestSchema>;

/** POST /api/payments/orders/:orderId/refund-requests body (FR-D-11). `amount`/`remitterInfo`
 * are derived server-side from the order/latest payment, not client-supplied. */
export const createRefundRequestSchema = z.object({
  reason: refundReasonSchema
});
export type CreateRefundRequestInput = z.infer<
  typeof createRefundRequestSchema
>;

/** PATCH /api/payments/refund-requests/:id body (FR-D-12) — fills in the remitter info the
 * checklist screen needs when SePay's webhook payload didn't carry it. */
export const updateRefundRequestSchema = z.object({
  remitterInfo: remitterInfoSchema
});
export type UpdateRefundRequestInput = z.infer<
  typeof updateRefundRequestSchema
>;

export const refundRequestListSchema = z.object({
  refundRequests: z.array(refundRequestSchema)
});
export type RefundRequestList = z.infer<typeof refundRequestListSchema>;

/** GET /api/payments/refund-requests (list) and /:id (detail) — org-wide refund requests
 * screen needs the order code + lead info the per-order endpoint doesn't carry. */
export const refundRequestWithOrderSchema = refundRequestSchema.extend({
  orderCode: z.string(),
  leadFullName: z.string(),
  leadPhone: z.string()
});
export type RefundRequestWithOrder = z.infer<
  typeof refundRequestWithOrderSchema
>;

export const refundRequestWithOrderListSchema = z.object({
  refundRequests: z.array(refundRequestWithOrderSchema)
});
export type RefundRequestWithOrderList = z.infer<
  typeof refundRequestWithOrderListSchema
>;

/**
 * POST /public/leads body (FR-D-02/03). `phone` accepts any VN-typed format — the route
 * normalizes to +84 via libphonenumber-js before validating/deduping. `consent` must be an
 * explicit `true` (NFR-09, Nghị định 13/2023/NĐ-CP) — never defaulted, never inferred.
 */
export const publicLeadSubmitSchema = z.object({
  orgId: orgIdSchema,
  campaignId: idSchema,
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.email().nullable().optional(),
  persona: z.string().nullable().optional(),
  customFields: jsonRecordSchema.default({}),
  utm: utmSchema.default({}),
  consent: z.literal(true),
  /** Hidden form field bots fill in — non-empty means silently drop the submit. */
  honeypot: z.string().default(""),
  turnstileToken: z.string().min(1),
  /** `tracking-and-attribution.md` §Identity — from `window.__DV__`/`localStorage`, only present
   * on submits from a native (`PageSpec`) page's runtime; legacy pages never send these. */
  anonymousId: z.string().nullish(),
  landingPageId: idSchema.nullish(),
  pageVersionId: idSchema.nullish()
});
export type PublicLeadSubmitInput = z.infer<typeof publicLeadSubmitSchema>;

export const publicOrderResultSchema = z.object({
  orderCode: z.string(),
  qrUrl: z.string(),
  amount: z.coerce.number().int().nonnegative(),
  zaloLink: z.string().nullable()
});
export type PublicOrderResult = z.infer<typeof publicOrderResultSchema>;

export const publicLeadResultSchema = z.object({
  leadId: idSchema,
  status: z.enum(["created", "merged"]),
  order: publicOrderResultSchema.nullable()
});
export type PublicLeadResult = z.infer<typeof publicLeadResultSchema>;

/** GET /api/leads query params (FR-E-01). All filters optional; `page` is 1-indexed. */
export const leadListQuerySchema = z.object({
  campaignId: idSchema.optional(),
  productId: idSchema.optional(),
  stage: z.string().optional(),
  utmSource: z.string().optional(),
  assigneeId: z.union([idSchema, z.literal("unassigned")]).optional(),
  /** filters against `orders.status` — `true` means any paid/fulfilled order exists. */
  paid: z.coerce.boolean().optional(),
  /** `true` means 2+ orders exist for this lead — a returning customer. */
  repeatCustomer: z.coerce.boolean().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  /** matched against fullName/phone/email. */
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;

export const leadListResponseSchema = z.object({
  leads: z.array(leadSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1)
});
export type LeadListResponse = z.infer<typeof leadListResponseSchema>;

/** POST /api/leads/import (module E finding #3) — one parsed+mapped CSV row. */
export const leadImportRowSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.email().nullable().optional(),
  persona: z.string().nullable().optional(),
  customFields: jsonRecordSchema.default({})
});
export type LeadImportRow = z.infer<typeof leadImportRowSchema>;

/** ponytail: capped at 500 rows/request, same cap as the retention job's per-run batch —
 * a bigger CSV wants a background job, not this endpoint. */
export const leadImportRequestSchema = z.object({
  campaignId: idSchema,
  rows: z.array(leadImportRowSchema).min(1).max(500)
});
export type LeadImportRequest = z.infer<typeof leadImportRequestSchema>;

export const leadImportResultSchema = z.object({
  created: z.number().int().nonnegative(),
  merged: z.number().int().nonnegative(),
  failed: z.array(z.object({ row: z.number().int(), reason: z.string() }))
});
export type LeadImportResult = z.infer<typeof leadImportResultSchema>;

/** PATCH /api/leads/:id/stage (FR-E-02) — value validated against `organizations.settings.pipeline` at the app layer. */
export const updateLeadStageSchema = z.object({ stage: z.string().min(1) });
export type UpdateLeadStageInput = z.infer<typeof updateLeadStageSchema>;

/** PATCH /api/leads/:id/assignee (FR-E-04, manual assignment). */
export const assignLeadSchema = z.object({ assigneeId: idSchema.nullable() });
export type AssignLeadInput = z.infer<typeof assignLeadSchema>;

/** POST /api/leads/:id/activities — manual timeline entries only (system entries are app-generated). */
export const createLeadActivitySchema = z.object({
  type: z.enum(["note", "call"]),
  body: z.string().min(1)
});
export type CreateLeadActivityInput = z.infer<typeof createLeadActivitySchema>;

/** GET /api/leads/:id response (FR-E-03) — lead + its timeline + its orders + source campaign. */
export const leadDetailSchema = z.object({
  lead: leadSchema,
  activities: z.array(leadActivitySchema),
  orders: z.array(orderSchema),
  campaign: z.object({ id: idSchema, name: z.string() }).nullable()
});
export type LeadDetail = z.infer<typeof leadDetailSchema>;

/** PATCH /api/leads/members/:membershipId/sales-config (FR-E-04) — owner/admin only. */
export const updateSalesConfigSchema = z.object({
  seeAllLeads: z.boolean()
});
export type UpdateSalesConfigInput = z.infer<typeof updateSalesConfigSchema>;

/** GET /api/leads/members/sales-config (FR-E-04) — one row per `sales`-role membership. */
export const salesConfigListSchema = z.object({
  members: z.array(
    z.object({
      membershipId: idSchema,
      userId: idSchema,
      seeAllLeads: z.boolean()
    })
  )
});
export type SalesConfigList = z.infer<typeof salesConfigListSchema>;

/** PATCH /api/leads/:id/orders/:orderId — order status transitions driven from the lead detail
 * view (FR-E-05 "xác nhận thanh toán"/"kích hoạt"). Terminal statuses (`refunded`) are out of
 * scope here — those only change through the refund flow (FR-D-11..14).
 * `reason` is required (FR-D-08: "Sales đổi trạng thái có ghi log + lý do"). */
export const updateLeadOrderStatusSchema = z.object({
  status: z.enum(["awaiting_confirmation", "paid", "fulfilled", "cancelled"]),
  reason: z.string().min(1)
});
export type UpdateLeadOrderStatusInput = z.infer<
  typeof updateLeadOrderStatusSchema
>;

/** POST /public/orders/:code/confirm-transfer response (FR-D-06 "Tôi đã chuyển khoản"). */
export const confirmOrderTransferResultSchema = z.object({
  status: orderStatusSchema,
  zaloLink: z.string().nullable()
});
export type ConfirmOrderTransferResult = z.infer<
  typeof confirmOrderTransferResultSchema
>;

/** GET /public/orders/:code/status response (FR-D-07 landing poll). */
export const publicOrderStatusSchema = z.object({
  status: orderStatusSchema,
  expiresAt: z.coerce.date().nullable()
});
export type PublicOrderStatus = z.infer<typeof publicOrderStatusSchema>;

/** PATCH/DELETE /api/leads/bulk — table/kanban multi-select actions. */
export const bulkUpdateLeadsSchema = z.object({
  leadIds: z.array(idSchema).min(1),
  stage: z.string().min(1).optional(),
  assigneeId: idSchema.nullable().optional()
});
export type BulkUpdateLeadsInput = z.infer<typeof bulkUpdateLeadsSchema>;

export const bulkDeleteLeadsSchema = z.object({
  leadIds: z.array(idSchema).min(1)
});
export type BulkDeleteLeadsInput = z.infer<typeof bulkDeleteLeadsSchema>;

/** GET/POST/PATCH /api/leads/assignment-rules — round-robin/least-active/fixed auto-assignment,
 * evaluated in `priority` order (lower first) against new leads. */
export const assignmentRuleStrategySchema = z.enum([
  "round_robin",
  "least_active_leads",
  "fixed_assignee"
]);
export type AssignmentRuleStrategy = z.infer<
  typeof assignmentRuleStrategySchema
>;

export const assignmentRuleSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  priority: z.number().int().nonnegative(),
  matchCampaignId: idSchema.nullable(),
  matchPersona: z.string().nullable(),
  strategy: assignmentRuleStrategySchema,
  assigneePoolIds: z.array(idSchema),
  fixedAssigneeId: idSchema.nullable(),
  slaHours: z.number().positive().nullable(),
  onSlaBreach: z.string().nullable()
});
export type AssignmentRule = z.infer<typeof assignmentRuleSchema>;

export const upsertAssignmentRuleSchema = assignmentRuleSchema.omit({
  id: true,
  orgId: true
});
export type UpsertAssignmentRuleInput = z.infer<
  typeof upsertAssignmentRuleSchema
>;

/** GET /api/leads/saved-views — a filter-bar snapshot, optionally shared org-wide. */
export const savedViewSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  ownerId: idSchema,
  name: z.string().min(1),
  filterJson: jsonRecordSchema,
  shared: z.boolean()
});
export type SavedView = z.infer<typeof savedViewSchema>;

export const createSavedViewSchema = z.object({
  name: z.string().min(1),
  filterJson: jsonRecordSchema,
  shared: z.boolean()
});
export type CreateSavedViewInput = z.infer<typeof createSavedViewSchema>;

export const webhookProviderSchema = z.enum([
  "facebook",
  "zalo_oa",
  "generic",
  "google_ads"
]);
export type WebhookProvider = z.infer<typeof webhookProviderSchema>;

/** GET /api/leads/webhook-credentials — per-org override status for the Facebook/Zalo OA
 * webhook secret (lead-integrations.md §4). The secret itself is never returned, only whether
 * one is configured — `configured: false` means the org falls back to the shared env secret. */
export const webhookCredentialSchema = z.object({
  provider: webhookProviderSchema,
  configured: z.boolean(),
  verifyToken: z.string().nullable(),
  /** Facebook only — whether a Page Access Token is stored for the Graph API `field_data`
   * fetch (lead-integrations.md §1). Always `false` for `zalo_oa`. */
  pageAccessTokenConfigured: z.boolean(),
  updatedAt: z.coerce.date().nullable(),
  /** Only ever set for `generic` today — see `webhookCredentials.lastUsedAt` doc comment. */
  lastUsedAt: z.coerce.date().nullable()
});
export type WebhookCredential = z.infer<typeof webhookCredentialSchema>;

export const upsertWebhookCredentialSchema = z.object({
  secret: z.string().min(1),
  verifyToken: z.string().min(1).optional(),
  /** Facebook only — omit to leave an existing token untouched (e.g. when only rotating the
   * App Secret); Zalo ignores this field entirely. */
  pageAccessToken: z.string().min(1).optional()
});
export type UpsertWebhookCredentialInput = z.infer<
  typeof upsertWebhookCredentialSchema
>;

/** GET /api/leads/tiktok-connections — one row per campaign that has connected a TikTok Ads
 * account via OAuth (lead-integrations.md §D). No secret/token field here — unlike
 * `webhookCredentialSchema`, TikTok never involves the org pasting or seeing any credential at
 * all, the whole point of the shared-app OAuth model. */
export const tiktokConnectionSchema = z.object({
  campaignId: idSchema,
  advertiserId: z.string(),
  connectedAt: z.coerce.date()
});
export type TiktokConnection = z.infer<typeof tiktokConnectionSchema>;

export const notifyProviderSchema = z.enum(["zalo_zns", "esms"]);
export type NotifyProvider = z.infer<typeof notifyProviderSchema>;

/** GET /api/leads/notify-credentials — BYOK status for the `notify_manager` push channel
 * (packages/drivers/src/notify). Secrets are never returned, only whether one is configured;
 * `config` holds the non-secret fields (Zalo ZNS `templateId`, eSMS `brandname`) verbatim. */
export const notifyCredentialSchema = z.object({
  provider: notifyProviderSchema,
  configured: z.boolean(),
  config: z.record(z.string(), z.string()),
  updatedAt: z.coerce.date().nullable()
});
export type NotifyCredential = z.infer<typeof notifyCredentialSchema>;

export const upsertNotifyCredentialSchema = z.discriminatedUnion("provider", [
  z.object({
    provider: z.literal("zalo_zns"),
    /** OA access token an org obtained themselves via Zalo's OAuth flow — org keeps it valid
     * (re-pastes when it expires), same BYOK-token model as Facebook's Page Access Token. */
    accessToken: z.string().min(1),
    templateId: z.string().min(1)
  }),
  z.object({
    provider: z.literal("esms"),
    apiKey: z.string().min(1),
    secretKey: z.string().min(1),
    brandname: z.string().optional()
  })
]);
export type UpsertNotifyCredentialInput = z.infer<
  typeof upsertNotifyCredentialSchema
>;

/** POST /api/leads/webhook-credentials/generic/generate — the plaintext key is returned exactly
 * once, here, right after generation; it is never retrievable again (only `configured: true`
 * shows afterward, same as Facebook/Zalo). */
export const generateGenericApiKeyResultSchema = z.object({
  apiKey: z.string().min(1)
});
export type GenerateGenericApiKeyResult = z.infer<
  typeof generateGenericApiKeyResultSchema
>;

/** Body accepted by POST /webhooks/generic-leads — the normalized shape every non-native
 * integration (Zapier/Make/n8n, a Zalo Mini App's own backend, a custom CRM, ...) forwards into,
 * same fields `POST /public/leads` uses minus the browser-only `turnstileToken`. */
export const genericLeadPayloadSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  email: z.email().nullable().optional(),
  customFields: z.record(z.string(), z.unknown()).default({})
});
export type GenericLeadPayloadInput = z.infer<typeof genericLeadPayloadSchema>;
