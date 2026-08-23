import { Link } from "@tanstack/react-router";

import * as m from "@/paraglide/messages.js";

const leadsSubNavItems = [
  { to: "/leads", label: () => m.leadsSubNavOverview() },
  {
    to: "/leads/assignment-rules",
    label: () => m.leadsSubNavAssignmentRules()
  },
  { to: "/leads/notify-settings", label: () => m.leadsSubNavNotifications() },
  { to: "/leads/webhook-settings", label: () => m.leadsSubNavWebhooks() }
] as const;

export function LeadsSubNav() {
  return (
    <nav className="flex flex-wrap gap-1 border-b px-4 py-2">
      {leadsSubNavItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          // `/leads` would otherwise fuzzy-match every /leads/* sub-route and stay
          // marked active (TanStack Router's default `isActive` is prefix-based).
          activeOptions={{ exact: true }}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground aria-[current]:bg-accent aria-[current]:text-accent-foreground"
        >
          {item.label()}
        </Link>
      ))}
    </nav>
  );
}
