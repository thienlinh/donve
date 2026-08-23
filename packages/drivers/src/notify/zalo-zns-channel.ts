import type { NotifyChannel, NotifyEvent, NotifyTarget } from "./types.js";

export interface ZaloZnsChannelConfig {
  accessToken: string;
  templateId: string;
}

/** `template_data` field names are a contract with whatever ZNS template the org got Zalo to
 * approve — this fixed set (`lead_name`, `sla_hours`, `org_name`) is what the org is told to use
 * when submitting their template for approval (see lead-integrations.md's notify_manager
 * section). A template using different field names simply won't render right; that's a
 * configuration mismatch on the org's side, not a bug in this channel. */
function toTemplateData(event: NotifyEvent): Record<string, string> {
  switch (event.type) {
    case "sla_breach":
      return {
        lead_name: event.props.leadFullName,
        sla_hours: String(event.props.slaHours),
        org_name: event.props.orgName
      };
    default: {
      const exhaustive: never = event.type;
      throw new Error(`unhandled notify event: ${JSON.stringify(exhaustive)}`);
    }
  }
}

/**
 * Zalo ZNS (Zalo Notification Service) template-message send — BYOK, org supplies an access
 * token they obtained themselves through Zalo's own OAuth flow (same "org keeps the token
 * valid, re-pastes it when it expires" model as Facebook's Page Access Token in
 * `webhooks.ts` — this channel does not implement Zalo's refresh_token exchange).
 *
 * ⚠️ Endpoint per Zalo's documented ZNS template-send API
 * (https://developers.zalo.me/docs/zalo-notification-service) — same "confirm against the real
 * docs once an actual ZNS app/template is available" caveat the Zalo Mini App bridge worker
 * (docs/features/leads/examples/zalo-miniapp-bridge-worker.ts) already carries for its own
 * unconfirmed endpoint.
 */
export function createZaloZnsNotifyChannel(
  config: ZaloZnsChannelConfig
): NotifyChannel {
  return {
    kind: "zalo_zns",
    canSend: (target: NotifyTarget) => Boolean(target.phone),
    async send(target: NotifyTarget, event: NotifyEvent): Promise<void> {
      if (!target.phone) return;
      const res = await fetch(
        "https://business.openapi.zalo.me/message/template",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            access_token: config.accessToken
          },
          body: JSON.stringify({
            phone: target.phone,
            template_id: config.templateId,
            template_data: toTemplateData(event)
          })
        }
      );
      if (!res.ok) {
        throw new Error(`Zalo ZNS send failed: HTTP ${res.status}`);
      }
    }
  };
}
