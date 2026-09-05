import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

import { fetchOrgDataSubjectRequests } from "@/features/leads/api";
import { leadKeys } from "@/features/leads/query-keys";
import * as m from "@/paraglide/messages.js";

const DUE_SOON_WINDOW_MS = 24 * 60 * 60 * 1000;
// Low-frequency compliance data — no need for the SSE bell's realtime push, a periodic
// refetch on this cadence is plenty to not miss a 72h SLA.
const STALE_TIME_MS = 5 * 60 * 1000;

/** NFR-10/NFR-12 — org-wide count of pending data-subject requests that are overdue or due
 * within 24h, so one doesn't get missed just because nobody happens to open that lead. */
export function DataSubjectRequestIndicator() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: leadKeys.orgDataSubjectRequests("pending"),
    queryFn: () => fetchOrgDataSubjectRequests("pending"),
    staleTime: STALE_TIME_MS
  });

  const cutoff = new Date();
  cutoff.setTime(cutoff.getTime() + DUE_SOON_WINDOW_MS);
  const count = data?.filter((r) => r.dueAt <= cutoff).length ?? 0;
  if (count === 0) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={m.leadsDsrIndicatorLabel({ count })}
      onClick={() => navigate({ to: "/leads" })}
    >
      <ShieldAlert />
      <Badge
        variant="destructive"
        className="absolute -top-1 -right-1 h-4 min-w-4 justify-center px-1 text-xs leading-none"
      >
        {count}
      </Badge>
    </Button>
  );
}
