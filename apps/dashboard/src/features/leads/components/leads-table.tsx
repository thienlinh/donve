import type { Lead, LeadListQuery } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";

import * as m from "@/paraglide/messages.js";

import { fetchLeads, type PipelineStage } from "../api";
import { leadKeys } from "../query-keys";

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

  const stageLabel = (key: string) =>
    pipeline.find((stage) => stage.key === key)?.label ?? key;

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner /> {m.commonLoading()}
      </div>
    );
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{m.leadsLoadErrorTitle()}</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (data.leads.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{m.leadsEmptyTitle()}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{m.leadsColumnName()}</TableHead>
            <TableHead>{m.leadsColumnPhone()}</TableHead>
            <TableHead>{m.leadsColumnStage()}</TableHead>
            <TableHead>{m.leadsColumnCreatedAt()}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer"
              onClick={() => onOpenLead(lead)}
            >
              <TableCell className="font-medium">{lead.fullName}</TableCell>
              <TableCell className="text-muted-foreground">
                {lead.phone}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{stageLabel(lead.stage)}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={data.page <= 1}
            onClick={() => onPageChange(data.page - 1)}
          >
            {m.commonPrevious()}
          </Button>
          <span className="text-sm text-muted-foreground">
            {m.leadsPaginationLabel({ page: data.page, total: totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data.page >= totalPages}
            onClick={() => onPageChange(data.page + 1)}
          >
            {m.commonNext()}
          </Button>
        </div>
      )}
    </div>
  );
}
