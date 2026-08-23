import type { EmailSender } from "../email/types.js";
import type { NotifyChannel, NotifyEvent, NotifyTarget } from "./types.js";

function toSendEmailInput(to: string, event: NotifyEvent) {
  switch (event.type) {
    case "sla_breach":
      return {
        to,
        template: "sla_breach_alert" as const,
        props: {
          orgName: event.props.orgName,
          dashboardUrl: event.props.dashboardUrl,
          leadFullName: event.props.leadFullName,
          slaHours: event.props.slaHours
        }
      };
    default: {
      const exhaustive: never = event.type;
      throw new Error(`unhandled notify event: ${JSON.stringify(exhaustive)}`);
    }
  }
}

export function createEmailNotifyChannel(sender: EmailSender): NotifyChannel {
  return {
    kind: "email",
    canSend: (target: NotifyTarget) => Boolean(target.email),
    async send(target: NotifyTarget, event: NotifyEvent): Promise<void> {
      if (!target.email) return;
      await sender.send(toSendEmailInput(target.email, event));
    }
  };
}
