import { Badge } from "@dv/ui/components/shadcn/badge";

import * as m from "@/paraglide/messages.js";

const SLA_AMBER_HOURS = 4;
const SLA_RED_HOURS = 24;

/** FR-E: SLA/age badge — green under 4h, amber 4-24h, red over 24h since last activity.
 * `hoursSinceActivity` isn't in `@dv/contracts` yet for every row during rollout, so this
 * renders nothing rather than crash when it's briefly undefined. */
export function LeadAgeBadge({
  hoursSinceActivity
}: {
  hoursSinceActivity: number | undefined;
}) {
  if (hoursSinceActivity === undefined) return null;

  const label =
    hoursSinceActivity < 24
      ? m.leadsAgeHours({ hours: Math.max(0, Math.round(hoursSinceActivity)) })
      : m.leadsAgeDays({ days: Math.round(hoursSinceActivity / 24) });

  if (hoursSinceActivity > SLA_RED_HOURS) {
    return <Badge variant="destructive">{label}</Badge>;
  }
  if (hoursSinceActivity >= SLA_AMBER_HOURS) {
    return (
      <Badge
        variant="outline"
        className="border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400"
      >
        {label}
      </Badge>
    );
  }
  return <Badge variant="outline">{label}</Badge>;
}

/** Unread indicator — shown when a lead has activity the current viewer hasn't opened yet. */
export function isLeadUnread(lead: {
  lastViewedAt?: string | Date | null;
  updatedAt: string | Date;
}): boolean {
  if (!lead.lastViewedAt) return true;
  return new Date(lead.lastViewedAt) < new Date(lead.updatedAt);
}

export function LeadUnreadDot({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      aria-label={m.leadsUnreadIndicatorLabel()}
      className="size-2 shrink-0 rounded-full bg-primary"
    />
  );
}

/** 2+ orders across this lead's lifetime (any campaign — `orderCount` already spans every
 * resubmit merged onto the same phone-deduped row, see `leads.ts` repository). `orderCount`
 * is only present on list-row responses, same rollout-safety reasoning as `LeadAgeBadge`. */
export function LeadRepeatCustomerBadge({
  orderCount
}: {
  orderCount: number | undefined;
}) {
  if (!orderCount || orderCount < 2) return null;
  return <Badge variant="outline">{m.leadsRepeatCustomerBadge()}</Badge>;
}
