import type { Lead, LeadListQuery } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Pagination } from "@/components/pagination";
import { QueryState } from "@/components/query-state";
import { useActiveOrganizationQuery } from "@/features/auth/queries";
import * as m from "@/paraglide/messages.js";

import { fetchLeads, type PipelineStage } from "../api";
import { leadKeys } from "../query-keys";
import {
  isLeadUnread,
  LeadAgeBadge,
  LeadRepeatCustomerBadge,
  LeadUnreadDot
} from "./lead-age-badge";
import { LeadAssigneeAvatar } from "./lead-assignee-avatar";
import { LeadsBulkToolbar } from "./leads-bulk-toolbar";

export function LeadsTable({
  query,
  pipeline,
  onPageChange,
  onOpenLead
}: {
  query: LeadListQuery;
  pipeline: PipelineStage[];
  onPageChange: (page: number) => void;
  onOpenLead: (lead: Lead) => void;
}) {
  const { data, isPending, error } = useQuery({
    queryKey: leadKeys.list(query),
    queryFn: () => fetchLeads(query)
  });
  const { data: activeOrganization } = useActiveOrganizationQuery();
  // ponytail: selection cleared "on filter change" by remounting via `key` in `leads-page.tsx`
  // (React resets all local state on remount) instead of an effect that reset-on-prop-change.
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const stageLabel = (key: string) =>
    pipeline.find((stage) => stage.key === key)?.label ?? key;

  if (isPending || error) {
    return (
      <QueryState
        isPending={isPending}
        error={error}
        isEmpty={false}
        errorTitle={m.leadsLoadErrorTitle()}
        emptyTitle={m.leadsEmptyTitle()}
      />
    );
  }

  if (data.leads.length === 0) {
    return (
      <QueryState
        isPending={false}
        error={null}
        isEmpty
        errorTitle={m.leadsLoadErrorTitle()}
        emptyTitle={m.leadsEmptyTitle()}
        emptyIcon={<Users />}
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  // Memoized (not inline in JSX) so the bulk toolbar doesn't get a fresh array identity every
  // unrelated re-render (react-perf/jsx-no-new-array-as-prop).
  const selectedIds = useMemo(() => [...selected], [selected]);
  const selectedLeads = useMemo(
    () => data.leads.filter((lead) => selected.has(lead.id)),
    [data.leads, selected]
  );
  const allSelected = data.leads.every((lead) => selected.has(lead.id));
  const someSelected =
    !allSelected && data.leads.some((lead) => selected.has(lead.id));

  function toggleAll() {
    if (!data) return;
    setSelected(allSelected ? new Set() : new Set(data.leads.map((l) => l.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>{m.leadsColumnName()}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {m.leadsColumnPhone()}
            </TableHead>
            <TableHead>{m.leadsColumnStage()}</TableHead>
            <TableHead>{m.leadsColumnAssignee()}</TableHead>
            <TableHead>{m.leadsColumnAge()}</TableHead>
            <TableHead className="hidden sm:table-cell">
              {m.leadsColumnCreatedAt()}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.leads.map((lead) => (
            <TableRow key={lead.id} className="cursor-pointer">
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selected.has(lead.id)}
                  onCheckedChange={() => toggleOne(lead.id)}
                />
              </TableCell>
              <TableCell
                className="font-medium"
                onClick={() => onOpenLead(lead)}
              >
                <span className="flex items-center gap-1.5">
                  <LeadUnreadDot show={isLeadUnread(lead)} />
                  {lead.fullName}
                  <LeadRepeatCustomerBadge orderCount={lead.orderCount} />
                </span>
              </TableCell>
              <TableCell
                className="hidden text-muted-foreground sm:table-cell"
                onClick={() => onOpenLead(lead)}
              >
                {lead.phone}
              </TableCell>
              <TableCell onClick={() => onOpenLead(lead)}>
                <Badge variant="secondary">{stageLabel(lead.stage)}</Badge>
              </TableCell>
              <TableCell onClick={() => onOpenLead(lead)}>
                <LeadAssigneeAvatar
                  assigneeId={lead.assigneeId}
                  members={activeOrganization?.members}
                />
              </TableCell>
              <TableCell onClick={() => onOpenLead(lead)}>
                <LeadAgeBadge hoursSinceActivity={lead.hoursSinceActivity} />
              </TableCell>
              <TableCell
                className="hidden text-muted-foreground sm:table-cell"
                onClick={() => onOpenLead(lead)}
              >
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={data.page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="flex items-center justify-center gap-3"
      />

      <LeadsBulkToolbar
        selectedIds={selectedIds}
        selectedLeads={selectedLeads}
        pipeline={pipeline}
        onCleared={() => setSelected(new Set())}
      />
    </div>
  );
}
