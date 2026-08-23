import {
  DndContext,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Lead, LeadListQuery } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { toast } from "@dv/ui/components/shadcn/toast";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { useActiveOrganization } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import { fetchLeads, updateLeadStage, type PipelineStage } from "../api";
import { leadKeys } from "../query-keys";
import {
  isLeadUnread,
  LeadAgeBadge,
  LeadRepeatCustomerBadge,
  LeadUnreadDot
} from "./lead-age-badge";
import { LeadAssigneeAvatar } from "./lead-assignee-avatar";

/** Kept comfortably under `leadListQuerySchema`'s `pageSize` cap of 100 (contracts/crm.ts) —
 * each column paginates its own stage instead of trying to fetch the whole board in one page. */
const KANBAN_COLUMN_PAGE_SIZE = 50;

type BoardQuery = Omit<LeadListQuery, "stage" | "page" | "pageSize">;

export function LeadsKanban({
  query,
  pipeline,
  onOpenLead
}: {
  query: BoardQuery;
  pipeline: PipelineStage[];
  onOpenLead: (lead: Lead) => void;
}) {
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const move = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      updateLeadStage(id, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
    },
    onError: () =>
      toast.add({ title: m.leadsStageChangeErrorToast(), type: "error" })
  });

  function handleDragEnd(event: DragEndEvent) {
    const leadId = event.active.id as string;
    const targetStage = event.over?.id as string | undefined;
    const fromStage = event.active.data.current?.stage as string | undefined;
    if (!targetStage || !fromStage || fromStage === targetStage) return;
    move.mutate({ id: leadId, stage: targetStage });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {pipeline.map((stage) => (
          <KanbanColumn
            key={stage.key}
            stage={stage}
            boardQuery={query}
            onOpenLead={onOpenLead}
          />
        ))}
      </div>
    </DndContext>
  );
}

const EMPTY_LEADS: Lead[] = [];

function KanbanColumn({
  stage,
  boardQuery,
  onOpenLead
}: {
  stage: PipelineStage;
  boardQuery: BoardQuery;
  onOpenLead: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  const stageQuery: Omit<LeadListQuery, "page" | "pageSize"> = {
    ...boardQuery,
    stage: stage.key
  };

  const {
    data,
    error,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: leadKeys.list(stageQuery),
    queryFn: ({ pageParam }) =>
      fetchLeads({
        ...stageQuery,
        page: pageParam,
        pageSize: KANBAN_COLUMN_PAGE_SIZE
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.pageSize < lastPage.total
        ? lastPage.page + 1
        : undefined
  });

  const leads = data?.pages.flatMap((page) => page.leads) ?? EMPTY_LEADS;
  const total = data?.pages[0]?.total ?? leads.length;

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col gap-2 rounded-lg border p-2 ${isOver ? "bg-muted" : ""}`}
    >
      <div className="flex items-center gap-2 px-1 py-1">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
        <span className="text-sm font-medium">{stage.label}</span>
        <span className="text-xs text-muted-foreground">{total}</span>
      </div>
      {isPending || error ? (
        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={false}
          errorTitle={m.leadsLoadErrorTitle()}
          emptyTitle={m.leadsEmptyTitle()}
          className="flex items-center gap-2 px-1 text-xs text-muted-foreground"
        />
      ) : (
        <div className="flex min-h-24 flex-col gap-2">
          {leads.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
              {m.leadsKanbanEmptyColumn()}
            </div>
          )}
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} onOpenLead={onOpenLead} />
          ))}
          {hasNextPage && (
            <Button
              variant="outline"
              size="sm"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? <Spinner /> : m.commonLoadMore()}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function KanbanCard({
  lead,
  onOpenLead
}: {
  lead: Lead;
  onOpenLead: (lead: Lead) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id, data: { stage: lead.stage } });
  const { data: activeOrganization } = useActiveOrganization();

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`cursor-grab p-0 ${isDragging ? "opacity-50" : ""}`}
      {...listeners}
      {...attributes}
      onClick={() => onOpenLead(lead)}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-3">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <LeadUnreadDot show={isLeadUnread(lead)} />
          {lead.fullName}
        </CardTitle>
        <LeadAssigneeAvatar
          assigneeId={lead.assigneeId}
          members={activeOrganization?.members}
        />
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-1.5 px-3 pb-3 text-xs text-muted-foreground">
        {lead.phone}
        <span className="flex items-center gap-1.5">
          <LeadRepeatCustomerBadge orderCount={lead.orderCount} />
          <LeadAgeBadge hoursSinceActivity={lead.hoursSinceActivity} />
        </span>
      </CardContent>
    </Card>
  );
}
