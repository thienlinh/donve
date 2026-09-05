import { Resend } from "resend";

import {
  renderDataSubjectRequestSla,
  renderInviteEmail,
  renderLeadDigest,
  renderOrderConfirmation,
  renderResetPassword,
  renderSlaBreachAlert,
  renderTrafficSpikeAlert,
  renderVerifyEmail
} from "./templates.js";
import type { EmailSender, SendEmailInput, SendEmailResult } from "./types.js";

export interface ResendEmailSenderConfig {
  apiKey: string;
  /**
   * FR-I-05/06: locked sending domain — isolated subdomain so a deliverability
   * incident here never touches `donve.vn` (landing/app/`info@`).
   * Override only for local/staging testing against a different verified domain.
   */
  from?: string;
}

const DEFAULT_FROM = "no-reply@mail.donve.vn";

export function createResendEmailSender(
  config: ResendEmailSenderConfig
): EmailSender {
  const client = new Resend(config.apiKey);
  const from = config.from ?? DEFAULT_FROM;

  return {
    async send(input: SendEmailInput): Promise<SendEmailResult> {
      const { subject, html } = renderTemplate(input);
      const { data, error } = await client.emails.send({
        from,
        to: input.to,
        subject,
        html
      });
      if (error) {
        throw new Error(
          `Resend send failed (${input.template}): ${error.message}`
        );
      }
      return { id: data?.id ?? null };
    }
  };
}

function renderTemplate(input: SendEmailInput): {
  subject: string;
  html: string;
} {
  switch (input.template) {
    case "verify_email":
      return renderVerifyEmail(input.props);
    case "reset_password":
      return renderResetPassword(input.props);
    case "invite":
      return renderInviteEmail(input.props);
    case "lead_digest":
      return renderLeadDigest(input.props);
    case "order_confirmation":
      return renderOrderConfirmation(input.props);
    case "traffic_spike_alert":
      return renderTrafficSpikeAlert(input.props);
    case "data_subject_request_sla":
      return renderDataSubjectRequestSla(input.props);
    case "sla_breach_alert":
      return renderSlaBreachAlert(input.props);
    default: {
      const exhaustive: never = input;
      throw new Error(
        `unhandled email template: ${JSON.stringify(exhaustive)}`
      );
    }
  }
}
