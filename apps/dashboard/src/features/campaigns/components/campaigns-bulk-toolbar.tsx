import { campaignStatusValues } from "@dv/contracts";
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
import { Trash2 } from "lucide-react";

import * as m from "@/paraglide/messages.js";

import { bulkDeleteCampaigns, bulkUpdateCampaigns } from "../api";
import { campaignStatusLabels } from "./campaign-form-dialog";

/** Floating bulk-action toolbar for the campaigns table — same shape as `LeadsBulkToolbar`
 * (appears once >=1 row is selected, invalidates the shared list key rather than doing
 * optimistic cache surgery since a bulk op can touch many rows at once). */
export function CampaignsBulkToolbar({
  selectedIds,
  onCleared
}: {
  selectedIds: string[];
  onCleared: () => void;
}) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    onCleared();
  };

  const changeStatus = useMutation({
    mutationFn: (status: (typeof campaignStatusValues)[number]) =>
      bulkUpdateCampaigns({ campaignIds: selectedIds, status }),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.campaignsBulkStatusErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => bulkDeleteCampaigns({ campaignIds: selectedIds }),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.campaignsBulkDeleteErrorToast(), type: "error" })
  });

  if (selectedIds.length === 0) return null;

  return (
    <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 self-center rounded-lg border bg-popover p-3 shadow-md">
      <span className="text-sm font-medium">
        {m.campaignsBulkSelectedCount({ count: selectedIds.length })}
      </span>

      <NativeSelect
        className="w-40"
        value=""
        disabled={changeStatus.isPending}
        onChange={(e) =>
          e.target.value &&
          changeStatus.mutate(
            e.target.value as (typeof campaignStatusValues)[number]
          )
        }
      >
        <NativeSelectOption value="" disabled>
          {m.campaignsBulkChangeStatus()}
        </NativeSelectOption>
        {campaignStatusValues.map((status) => (
          <NativeSelectOption key={status} value={status}>
            {campaignStatusLabels[status]}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button size="sm" variant="destructive">
              <Trash2 /> {m.campaignsBulkDelete()}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {m.campaignsBulkDeleteConfirmTitle()}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {m.campaignsBulkDeleteConfirmDescription({
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
                : m.campaignsBulkDeleteConfirm()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button size="sm" variant="ghost" onClick={onCleared}>
        {m.campaignsBulkClearSelection()}
      </Button>
    </div>
  );
}
