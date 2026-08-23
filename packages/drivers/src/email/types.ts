export type EmailTemplate =
  | "verify_email"
  | "reset_password"
  | "invite"
  | "lead_digest"
  | "order_confirmation"
  | "traffic_spike_alert"
  | "data_subject_request_sla"
  | "sla_breach_alert";

export interface VerifyEmailProps {
  name: string;
  url: string;
}

export interface ResetPasswordProps {
  name: string;
  url: string;
}

export interface InviteEmailProps {
  orgName: string;
  inviteUrl: string;
  role: string;
}

export interface LeadDigestItem {
  fullName: string;
  phone: string;
  createdAt: string;
}

/** FR-I-03 — one batched email per assignee/owner instead of one per lead. */
export interface LeadDigestProps {
  orgName: string;
  dashboardUrl: string;
  leads: LeadDigestItem[];
}

/** FR-I-04 — sent when an order reaches `paid` or `fulfilled`, opt-in per campaign. */
export interface OrderConfirmationProps {
  orderCode: string;
  status: "paid" | "fulfilled";
  amount: number;
}

/** NFR-14 — a hostname's request count today vs. its trailing-7-day average, founder-only. */
export interface TrafficSpikeAlertProps {
  hostname: string;
  todayCount: number;
  trailingAverage: number;
  multiplier: number;
}

export type SendEmailInput =
  | { to: string; template: "verify_email"; props: VerifyEmailProps }
  | { to: string; template: "reset_password"; props: ResetPasswordProps }
  | { to: string; template: "invite"; props: InviteEmailProps }
  | { to: string; template: "lead_digest"; props: LeadDigestProps }
  | {
      to: string;
      template: "order_confirmation";
      props: OrderConfirmationProps;
    }
  | {
      to: string;
      template: "traffic_spike_alert";
      props: TrafficSpikeAlertProps;
    }
  | {
      to: string;
      template: "data_subject_request_sla";
      props: DataSubjectRequestSlaProps;
    }
  | { to: string; template: "sla_breach_alert"; props: SlaBreachAlertProps };

/** NFR-10 (Nghị định 13/2023/NĐ-CP) — one entry in the daily SLA alert, sent to an org's
 * owner/admin when a lead's delete/export request is overdue or due within 24h. */
export interface DataSubjectRequestSlaItem {
  leadFullName: string;
  requestType: "delete" | "export";
  dueAt: string;
  overdue: boolean;
}

export interface DataSubjectRequestSlaProps {
  orgName: string;
  dashboardUrl: string;
  requests: DataSubjectRequestSlaItem[];
}

/** FR-E `notify_manager` — sent to the org owner (no separate "manager" role exists) when a
 * lead's `onSlaBreach: "notify_manager"` rule fires, alongside the existing activity-timeline
 * entry `lead-sla-sweep.ts` already writes. */
export interface SlaBreachAlertProps {
  orgName: string;
  dashboardUrl: string;
  leadFullName: string;
  slaHours: number;
}

export interface SendEmailResult {
  /** Resend's own id, null for a no-op/test sender. */
  id: string | null;
}

/**
 * FR-I-01/02/04: only one provider (Resend) is planned — no VNPAY/MoMo-style
 * multi-provider need like `PaymentsDriver` — but this still sits behind an
 * interface so `packages/auth` and `apps/api` never import `resend` directly.
 */
export interface EmailSender {
  send(input: SendEmailInput): Promise<SendEmailResult>;
}
