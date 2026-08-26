import { z } from "zod";

import { timestampsSchema, idSchema } from "./common.js";
import { refundReasonSchema } from "./crm.js";
import { orgPlanSchema, organizationSchema } from "./tenancy.js";

/** Mirrors `platform_staff.role` (packages/db/src/schema/platform.ts), least → most privileged
 * (docs/architecture/platform-admin.md §10) — the order is what `requirePlatformStaff(minRole)`
 * compares against, so it is load-bearing, not cosmetic. */
export const platformStaffRoleValues = [
  "support",
  "billing_ops",
  "platform_admin"
] as const;
export const platformStaffRoleSchema = z.enum(platformStaffRoleValues);
export type PlatformStaffRole = z.infer<typeof platformStaffRoleSchema>;

/** Response shape of `GET /platform/whoami` (apps/api/src/modules/platform/routes.ts). */
export const platformWhoAmISchema = z.object({
  staffId: idSchema,
  role: platformStaffRoleSchema
});
export type PlatformWhoAmI = z.infer<typeof platformWhoAmISchema>;

/** `GET /platform/orgs` row — the org plus its owner's email, which is what support actually
 * searches by (platform-admin.md §11). Null when the org has no owner membership left. */
export const platformOrgListItemSchema = organizationSchema.extend({
  ownerEmail: z.string().nullable()
});
export type PlatformOrgListItem = z.infer<typeof platformOrgListItemSchema>;

/** `platform_audit_logs` row — the Audit tab of the org-detail screen (platform-admin.md §11). */
export const platformAuditLogSchema = z.object({
  id: idSchema,
  staffUserId: z.string(),
  action: z.string(),
  targetOrgId: idSchema.nullable(),
  targetType: z.string().nullable(),
  targetId: z.string().nullable(),
  meta: z.string().nullable(),
  createdAt: z.coerce.date()
});
export type PlatformAuditLog = z.infer<typeof platformAuditLogSchema>;

export const featureFlagSchema = z.object({
  id: idSchema,
  key: z.string().min(1),
  description: z.string(),
  ...timestampsSchema.shape
});
export type FeatureFlag = z.infer<typeof featureFlagSchema>;

export const orgFeatureOverrideSchema = z.object({
  id: idSchema,
  orgId: idSchema,
  featureKey: z.string().min(1),
  /** Stored as text `"true"`/`"false"` per platform-admin.md §12's table shape. */
  enabled: z.enum(["true", "false"]),
  reason: z.string().min(1),
  ...timestampsSchema.shape
});
export type OrgFeatureOverride = z.infer<typeof orgFeatureOverrideSchema>;

/** `GET /platform/orgs/:id` — everything the three detail tabs need in one round trip. */
export const platformOrgDetailSchema = z.object({
  org: organizationSchema,
  stats: z.object({
    memberCount: z.number().int().nonnegative(),
    campaignCount: z.number().int().nonnegative(),
    leadCount: z.number().int().nonnegative(),
    /** Sum of `ai_usage.credit_cost` for the org — its lifetime AI credit burn. */
    aiCreditSpent: z.number().int().nonnegative()
  }),
  /** Feature keys the org's current plan includes, before overrides. */
  planFeatureKeys: z.array(z.string()),
  featureOverrides: z.array(orgFeatureOverrideSchema),
  /** Full flag catalog, so the override editor can offer keys the org doesn't have yet. */
  availableFeatures: z.array(featureFlagSchema),
  auditLogs: z.array(platformAuditLogSchema)
});
export type PlatformOrgDetail = z.infer<typeof platformOrgDetailSchema>;

/** Every platform write that changes an org's standing requires a typed-in reason — it lands in
 * `platform_audit_logs.meta` and is the only record of why (platform-admin.md §11). */
export const platformReasonSchema = z.object({
  reason: z.string().trim().min(3)
});
export type PlatformReasonInput = z.infer<typeof platformReasonSchema>;

/** `POST /platform/orgs/:id/refund-assist` — opens a refund request on behalf of the tenant.
 * Non-custodial platform (FR-D-11): this creates the tracking record the tenant's own refund
 * flow uses, it does not move money. */
export const platformRefundAssistSchema = z.object({
  orderId: idSchema,
  refundReason: refundReasonSchema,
  reason: z.string().trim().min(3)
});
export type PlatformRefundAssistInput = z.infer<
  typeof platformRefundAssistSchema
>;

/** `PATCH /platform/orgs/:id/subscription` — plan change and/or feature overrides in one call.
 * `enabled: null` removes the override, falling back to the plan's own feature set. */
export const platformSubscriptionUpdateSchema = z.object({
  plan: orgPlanSchema.optional(),
  featureOverrides: z
    .array(
      z.object({
        featureKey: z.string().min(1),
        enabled: z.boolean().nullable()
      })
    )
    .optional(),
  reason: z.string().trim().min(3)
});
export type PlatformSubscriptionUpdateInput = z.infer<
  typeof platformSubscriptionUpdateSchema
>;
