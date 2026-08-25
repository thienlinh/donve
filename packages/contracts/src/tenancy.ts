import { z } from "zod";

import {
  jsonRecordSchema,
  orgIdSchema,
  timestampsSchema,
  ulidSchema
} from "./common.js";

export const membershipRoleValues = [
  "owner",
  "admin",
  "editor",
  "sales"
] as const;
export const membershipRoleSchema = z.enum(membershipRoleValues);
export type MembershipRole = z.infer<typeof membershipRoleSchema>;

export const orgPlanValues = ["free", "starter", "pro"] as const;
export const orgPlanSchema = z.enum(orgPlanValues);
export type OrgPlan = z.infer<typeof orgPlanSchema>;

const pipelineStageSchema = z.object({
  key: z.string(),
  label: z.string(),
  color: z.string()
});

export const leadDigestFrequencyValues = ["hourly", "daily"] as const;
export const leadDigestFrequencySchema = z.enum(leadDigestFrequencyValues);
export type LeadDigestFrequency = z.infer<typeof leadDigestFrequencySchema>;

/** organizations.settings — brand tokens, pipeline stages, timezone; open-ended beyond that. */
export const orgSettingsSchema = z
  .object({
    pipeline: z.array(pipelineStageSchema).optional(),
    timezone: z.string().optional(),
    /** FR-I-03 — new-lead digest batching window; defaults to hourly when unset. */
    leadDigestFrequency: leadDigestFrequencySchema.optional(),
    /** NFR-11 — org opt-out of the 12-month unpaid-lead anonymize job; default enabled. */
    leadRetentionAnonymizeDisabled: z.boolean().optional(),
    /** FR-E `notify_manager` push channel — which of the org's configured notify credentials
     * (packages/db/src/schema/crm.ts's `notifyCredentials`) `lead-sla-sweep.ts` uses. Defaults
     * to `"email"` when unset — the only channel that needs no BYOK credential at all. */
    notifyChannel: z.enum(["email", "zalo_zns", "sms"]).optional(),
    /** Phone number the `zalo_zns`/`sms` notify channels send to — there is no per-user phone
     * field in the membership model (better-auth's `user` table has none), so this is a single
     * org-wide "manager's phone" setting rather than per-assignee. */
    notifyPhone: z.string().optional(),
    /** FR-B-24 — brand tokens (colors/fonts) fed into the AI prompt (studio-ai's
     * compilePrompt/compileGeneratePrompt). Written by the Brand kit section of Org
     * Settings (primaryColor/secondaryColor/headingFont/bodyFont); `catchall` above
     * still allows ad-hoc extra keys if a future UI wants to add more tokens. */
    designTokens: z.record(z.string(), z.string()).optional()
  })
  .catchall(z.unknown());
export type OrgSettings = z.infer<typeof orgSettingsSchema>;

export const organizationSchema = z.object({
  id: ulidSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  plan: orgPlanSchema.default("free"),
  aiCreditBalance: z.number().int().nonnegative().default(0),
  trialUsesRemaining: z.number().int().nonnegative().default(3),
  settings: orgSettingsSchema.default({}),
  /** Non-null while the org is locked out by `POST /platform/orgs/:id/disable`
   * (docs/architecture/platform-admin.md §11). */
  disabledAt: z.coerce.date().nullable().default(null),
  ...timestampsSchema.shape
});
export type Organization = z.infer<typeof organizationSchema>;

/** memberships.salesConfig — e.g. { seeAllLeads: false }. */
export const salesConfigSchema = z
  .object({
    seeAllLeads: z.boolean().optional()
  })
  .catchall(z.unknown());
export type SalesConfig = z.infer<typeof salesConfigSchema>;

export const membershipSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  userId: ulidSchema,
  role: membershipRoleSchema,
  salesConfig: salesConfigSchema.default({})
});
export type Membership = z.infer<typeof membershipSchema>;

export const inviteSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  email: z.email(),
  role: membershipRoleSchema,
  token: z.string(),
  expiresAt: z.coerce.date(),
  ...timestampsSchema.shape
});
export type Invite = z.infer<typeof inviteSchema>;

export const auditLogSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  actorId: ulidSchema.nullable(),
  action: z.string(),
  targetType: z.string().nullable(),
  targetId: z.string().nullable(),
  meta: jsonRecordSchema.default({}),
  createdAt: z.coerce.date()
});
export type AuditLog = z.infer<typeof auditLogSchema>;
