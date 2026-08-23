import type { NotifyChannel, NotifyEvent, NotifyTarget } from "./types.js";

export interface EsmsChannelConfig {
  apiKey: string;
  secretKey: string;
  brandname?: string;
}

function toSmsContent(event: NotifyEvent): string {
  switch (event.type) {
    case "sla_breach":
      return `[Donve] Lead "${event.props.leadFullName}" qua SLA ${event.props.slaHours}h tren ${event.props.orgName}, can chu y.`;
    default: {
      const exhaustive: never = event.type;
      throw new Error(`unhandled notify event: ${JSON.stringify(exhaustive)}`);
    }
  }
}

interface EsmsSendResponse {
  CodeResult?: string;
  ErrorMessage?: string;
}

/**
 * eSMS.vn — BYOK SMS provider, org registers their own eSMS account and pastes their
 * ApiKey/SecretKey (no separate OAuth/refresh flow, unlike Zalo ZNS).
 *
 * ⚠️ Endpoint/response shape per eSMS's documented `SendMultipleMessage_V4_get` API
 * (https://esms.vn/tai-lieu-api) — same "confirm against the real docs once a real account is
 * available" caveat as the Zalo ZNS channel. `CodeResult: "100"` is eSMS's documented success
 * code; eSMS returns HTTP 200 even for a business-logic failure (bad key, low balance, ...), so
 * an `ok` response alone isn't proof of a sent message.
 */
export function createEsmsNotifyChannel(
  config: EsmsChannelConfig
): NotifyChannel {
  return {
    kind: "sms",
    canSend: (target: NotifyTarget) => Boolean(target.phone),
    async send(target: NotifyTarget, event: NotifyEvent): Promise<void> {
      if (!target.phone) return;
      const res = await fetch(
        "https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ApiKey: config.apiKey,
            SecretKey: config.secretKey,
            Phone: target.phone,
            Content: toSmsContent(event),
            SmsType: "2",
            Brandname: config.brandname,
            IsUnicode: "1"
          })
        }
      );
      if (!res.ok) {
        throw new Error(`eSMS send failed: HTTP ${res.status}`);
      }
      const json = (await res.json()) as EsmsSendResponse;
      if (json.CodeResult !== "100") {
        throw new Error(
          `eSMS send failed: CodeResult=${json.CodeResult ?? "unknown"}`
        );
      }
    }
  };
}
