/**
 * Channel-agnostic manager-alert dispatcher (FR-E `notify_manager`, lead-integrations.md's
 * documented "no dedicated push channel" gap). Only `email` is implemented today
 * (`email-channel.ts`) — `sms`/`zalo_zns` are listed here so a caller (or a future BYOK-driven
 * channel picker) can already talk about them, but there is deliberately no driver behind either
 * yet: Zalo ZNS/SMS needs its own org-supplied credentials (own BYOK flow, like
 * `webhook_credentials`) and provider account, which is a separate follow-up, not part of this
 * abstraction.
 */
export type NotifyChannelKind = "email" | "sms" | "zalo_zns";

/** New alert kinds get a new union member here, not a generic `{subject, body}` shape — same
 * reasoning as `email.SendEmailInput`'s per-template props: every channel implementation needs
 * to know exactly what data it has to render, not guess from a free-form string. */
export type NotifyEvent = {
  type: "sla_breach";
  props: {
    orgName: string;
    appUrl: string;
    leadFullName: string;
    slaHours: number;
  };
};

/** Whatever contact info the target has for this channel — a channel that needs a field it
 * doesn't have (e.g. `sms` with no `phone`) is simply not sendable, not an error to throw. */
export interface NotifyTarget {
  email?: string | null;
  phone?: string | null;
}

export interface NotifyChannel {
  kind: NotifyChannelKind;
  canSend(target: NotifyTarget): boolean;
  send(target: NotifyTarget, event: NotifyEvent): Promise<void>;
}
