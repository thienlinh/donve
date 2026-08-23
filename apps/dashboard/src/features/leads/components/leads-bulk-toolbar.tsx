import type { Lead } from "@dv/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@dv/ui/components/shadcn/alert-dialog";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2 } from "lucide-react";

import { useActiveOrganization } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import { bulkDeleteLeads, bulkUpdateLeads, type PipelineStage } from "../api";
import { buildLeadsCsv, downloadCsv } from "../csv";

/** Floating bulk-action toolbar for the list view — appears once ≥1 row is selected.
 * Mutations invalidate the shared `["leads", "list"]` key (same pattern as the kanban's
 * stage-move mutation in `leads-kanban.tsx`) rather than optimistic cache surgery, since a
 * bulk op can touch dozens of rows across pages at once. */
export function LeadsBulkToolbar({
  selectedIds,
  selectedLeads,
  pipeline,
  onCleared
}: {
  selectedIds: string[];
  selectedLeads: Lead[];
  pipeline: PipelineStage[];
  onCleared: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: activeOrganization } = useActiveOrganization();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
    onCleared();
  };

  const changeStage = useMutation({
    mutationFn: (stage: string) =>
      bulkUpdateLeads({ leadIds: selectedIds, stage }),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.leadsBulkStageErrorToast(), type: "error" })
  });

  const changeAssignee = useMutation({
    mutationFn: (assigneeId: string) =>
      bulkUpdateLeads({ leadIds: selectedIds, assigneeId: assigneeId || null }),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.leadsBulkAssignErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => bulkDeleteLeads({ leadIds: selectedIds }),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.leadsBulkDeleteErrorToast(), type: "error" })
  });

  if (selectedIds.length === 0) return null;

  return (
    <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 self-center rounded-lg border bg-popover p-3 shadow-md">
      <span className="text-sm font-medium">
        {m.leadsBulkSelectedCount({ count: selectedIds.length })}
      </span>

      <NativeSelect
        className="w-40"
        value=""
        disabled={changeStage.isPending}
        onChange={(e) => e.target.value && changeStage.mutate(e.target.value)}
      >
        <NativeSelectOption value="" disabled>
          {m.leadsBulkChangeStage()}
        </NativeSelectOption>
        {pipeline.map((stage) => (
          <NativeSelectOption key={stage.key} value={stage.key}>
            {stage.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        className="w-40"
        value=""
        disabled={changeAssignee.isPending}
        onChange={(e) => changeAssignee.mutate(e.target.value)}
      >
        <NativeSelectOption value="" disabled>
          {m.leadsBulkAssignTo()}
        </NativeSelectOption>
        <NativeSelectOption value="">{m.leadsUnassigned()}</NativeSelectOption>
        {activeOrganization?.members.map((member) => (
          <NativeSelectOption key={member.id} value={member.userId}>
            {member.user.name || member.user.email}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          downloadCsv(
            `leads-selection-${new Date().toISOString().slice(0, 10)}.csv`,
            buildLeadsCsv(selectedLeads)
          )
        }
      >
        <Download /> {m.leadsBulkExport()}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button size="sm" variant="destructive">
              <Trash2 /> {m.leadsBulkDelete()}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {m.leadsBulkDeleteConfirmTitle()}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {m.leadsBulkDeleteConfirmDescription({
                count: selectedIds.length
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              {remove.isPending
                ? m.commonLoading()
                : m.leadsBulkDeleteConfirm()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button size="sm" variant="ghost" onClick={onCleared}>
        {m.leadsBulkClearSelection()}
      </Button>
    </div>
  );
}
