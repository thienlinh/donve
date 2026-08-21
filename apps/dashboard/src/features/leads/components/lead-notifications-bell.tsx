import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { useActiveOrganization } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

const UNREAD_DISPLAY_CAP = 99;
const LEADS_PATH = "/leads";

/** module E finding #4 — subscribes to `/api/leads/stream` (SSE, mirrors `/orders/stream`) and
 * badges the bell with an unread count of newly-created leads since the last visit to /leads.
 * Native `EventSource` (not the studio's manual fetch+reader pattern) since this is a plain GET
 * SSE feed with no request body to stream — `withCredentials` covers the cross-origin cookie. */
export function LeadNotificationsBell() {
  const [unread, setUnread] = useState(0);
  const { data: activeOrganization } = useActiveOrganization();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Syncing local state to the router's external location, same category as
  // packages/ui's use-media-query/use-mobile hooks syncing to `window` — an effect is the
  // correct tool here (React docs' own "adjust state during render" ref alternative is blocked
  // by this repo's react(refs) rule, which doesn't special-case it).
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    if (pathname === LEADS_PATH) setUnread(0);
  }, [pathname]);

  const orgId = activeOrganization?.id;
  useEffect(() => {
    if (!orgId) return;
    const source = new EventSource(
      `${import.meta.env.VITE_API_URL}/api/leads/stream`,
      { withCredentials: true }
    );
    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as { count?: number };
      setUnread((prev) => prev + (payload.count ?? 1));
    };
    return () => source.close();
  }, [orgId]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={m.leadsNotificationsBellLabel({ count: unread })}
      onClick={() => {
        setUnread(0);
        navigate({ to: "/leads" });
      }}
    >
      <Bell />
      {unread > 0 && (
        <Badge className="absolute -top-1 -right-1 h-4 min-w-4 justify-center px-1 text-xs leading-none">
          {unread > UNREAD_DISPLAY_CAP ? `${UNREAD_DISPLAY_CAP}+` : unread}
        </Badge>
      )}
    </Button>
  );
}
