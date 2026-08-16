export type EmailTemplate = "verify_email" | "reset_password" | "invite"

export interface VerifyEmailProps {
  name: string
  url: string
}

export interface ResetPasswordProps {
  name: string
  url: string
}

export interface InviteEmailProps {
  orgName: string
  inviteUrl: string
  role: string
}

export type SendEmailInput =
  | { to: string; template: "verify_email"; props: VerifyEmailProps }
  | { to: string; template: "reset_password"; props: ResetPasswordProps }
  | { to: string; template: "invite"; props: InviteEmailProps }

export interface SendEmailResult {
  /** Resend's own id, null for a no-op/test sender. */
  id: string | null
}

/**
 * FR-I-01/02/04: only one provider (Resend) is planned — no VNPAY/MoMo-style
 * multi-provider need like `PaymentsDriver` — but this still sits behind an
 * interface so `packages/auth` and `apps/api` never import `resend` directly.
 */
export interface EmailSender {
  send(input: SendEmailInput): Promise<SendEmailResult>
}
