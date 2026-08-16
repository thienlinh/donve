import { z } from "zod";

import {
  jsonRecordSchema,
  orgIdSchema,
  timestampsSchema,
  ulidSchema,
} from "./common.js";

export const membershipRoleValues = [
  "owner",
  "admin",
  "editor",
  "sales",
] as const;
export const membershipRoleSchema = z.enum(membershipRoleValues);
export type MembershipRole = z.infer<typeof membershipRoleSchema>;

export const orgPlanValues = ["free", "starter", "pro"] as const;
export const orgPlanSchema = z.enum(orgPlanValues);
export type OrgPlan = z.infer<typeof orgPlanSchema>;

const pipelineStageSchema = z.object({
  key: z.string(),
  label: z.string(),
  color: z.string(),
});

/** organizations.settings — brand tokens, pipeline stages, timezone; open-ended beyond that. */
export const orgSettingsSchema = z
  .object({
    pipeline: z.array(pipelineStageSchema).optional(),
    timezone: z.string().optional(),
  })
  .catchall(z.unknown());
export type OrgSettings = z.infer<typeof orgSettingsSchema>;

export const organizationSchema = z.object({
  id: ulidSchema,
  name: z.string().min(1),
  slug: z.string().min(1),
  plan: orgPlanSchema.default("free"),
  aiCreditBalance: z.number().int().nonnegative().default(0),
  settings: orgSettingsSchema.default({}),
  ...timestampsSchema.shape,
});
export type Organization = z.infer<typeof organizationSchema>;

/** memberships.salesConfig — e.g. { seeAllLeads: false }. */
export const salesConfigSchema = z
  .object({
    seeAllLeads: z.boolean().optional(),
  })
  .catchall(z.unknown());
export type SalesConfig = z.infer<typeof salesConfigSchema>;

export const membershipSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  userId: ulidSchema,
  role: membershipRoleSchema,
  salesConfig: salesConfigSchema.default({}),
});
export type Membership = z.infer<typeof membershipSchema>;

export const inviteSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  email: z.email(),
  role: membershipRoleSchema,
  token: z.string(),
  expiresAt: z.coerce.date(),
  ...timestampsSchema.shape,
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
  createdAt: z.coerce.date(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;
