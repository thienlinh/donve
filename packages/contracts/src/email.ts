import { z } from "zod";

import { orgIdSchema, ulidSchema } from "./common.js";

export const emailTemplateValues = [
  "verify_email",
  "reset_password",
  "invite",
  "lead_digest",
  "order_paid",
] as const;
export const emailTemplateSchema = z.enum(emailTemplateValues);
export type EmailTemplate = z.infer<typeof emailTemplateSchema>;

export const emailStatusValues = [
  "queued",
  "sent",
  "delivered",
  "bounced",
  "failed",
] as const;
export const emailStatusSchema = z.enum(emailStatusValues);
export type EmailStatus = z.infer<typeof emailStatusSchema>;

export const emailLogSchema = z.object({
  id: ulidSchema,
  /** null for emails sent before an org exists (signup verification). */
  orgId: orgIdSchema.nullable(),
  to: z.email(),
  /** open beyond the known set — Resend template keys evolve independently of this package. */
  template: z.union([emailTemplateSchema, z.string()]),
  /** Resend's own id, used to look up bounce/delivery status. */
  resendId: z.string().nullable(),
  status: emailStatusSchema.default("queued"),
  createdAt: z.coerce.date(),
});
export type EmailLog = z.infer<typeof emailLogSchema>;
