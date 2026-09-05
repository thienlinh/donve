import type { CampaignWithProducts } from "@dv/contracts";
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
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Copy, Megaphone, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Pagination } from "@/components/pagination";
import { QueryState } from "@/components/query-state";
import { getTotalPages, usePagedQuery } from "@/hooks/use-paged-query";
import * as m from "@/paraglide/messages.js";

import { duplicateCampaign, fetchCampaignsPage, removeCampaign } from "../api";
import { campaignKeys } from "../query-keys";
import { CampaignAnalyticsDialog } from "./campaign-analytics-dialog";
import {
  CampaignFormDialog,
  campaignStatusLabels
} from "./campaign-form-dialog";
import { CampaignsBulkToolbar } from "./campaigns-bulk-toolbar";

const PAGE_SIZE = 20;

export function CampaignsPage() {
  const { setPage, query } = usePagedQuery(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const listQuery = { ...query, search: search || undefined };
  const { data, isPending, error } = useQuery({
    queryKey: campaignKeys.listPage(listQuery),
    queryFn: () => fetchCampaignsPage(listQuery)
  });
  const campaigns = data?.campaigns;
  const totalPages = getTotalPages(data);
  // ponytail: selection cleared on filter/page change by remounting via `key` (same pattern
  // as `leads-table.tsx`'s selection reset) instead of an effect that reset-on-prop-change.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectedIds = useMemo(() => [...selected], [selected]);

  function toggleAll() {
    if (!campaigns) return;
    const allSelected = campaigns.every((c) => selected.has(c.id));
    setSelected(allSelected ? new Set() : new Set(campaigns.map((c) => c.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allSelected = Boolean(
    campaigns?.length && campaigns.every((c) => selected.has(c.id))
  );
  const someSelected =
    !allSelected && Boolean(campaigns?.some((c) => selected.has(c.id)));

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.campaignsTitle()}</CardTitle>
          <CardDescription>{m.campaignsDescription()}</CardDescription>
          <CardAction>
            <CampaignFormDialog />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              setSelected(new Set());
            }}
            placeholder={m.campaignsSearchPlaceholder()}
            className="max-w-64"
            aria-label={m.campaignsSearchPlaceholder()}
          />
          <QueryState
            isPending={isPending}
            error={error}
            isEmpty={campaigns?.length === 0}
            errorTitle={m.campaignsLoadErrorTitle()}
            emptyTitle={m.campaignsEmptyTitle()}
            emptyIcon={<Megaphone />}
          />
          {campaigns && campaigns.length > 0 && (
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
                  <TableHead>{m.campaignsColumnName()}</TableHead>
                  <TableHead>{m.campaignsColumnStatus()}</TableHead>
                  <TableHead>{m.campaignsColumnProducts()}</TableHead>
                  <TableHead className="text-end">
                    {m.campaignsColumnActions()}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <CampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    selected={selected.has(campaign.id)}
                    onToggleSelected={() => toggleOne(campaign.id)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
          {data && (
            <Pagination
              page={data.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
          <CampaignsBulkToolbar
            selectedIds={selectedIds}
            onCleared={() => setSelected(new Set())}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignRow({
  campaign,
  selected,
  onToggleSelected
}: {
  campaign: CampaignWithProducts;
  selected: boolean;
  onToggleSelected: () => void;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: campaignKeys.list() });

  const remove = useMutation({
    mutationFn: () => removeCampaign(campaign.id),
    onSuccess: () => {
      invalidate();
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.campaignsRemoveErrorToast(), type: "error" })
  });

  const duplicate = useMutation({
    mutationFn: () => duplicateCampaign(campaign.id),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.campaignsDuplicateErrorToast(), type: "error" })
  });

  return (
    <TableRow>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={selected} onCheckedChange={onToggleSelected} />
      </TableCell>
      <TableCell className="font-medium">{campaign.name}</TableCell>
      <TableCell>
        <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
          {campaignStatusLabels[campaign.status]}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {campaign.productIds.length}
      </TableCell>
      <TableCell className="flex justify-end gap-1">
        <CampaignAnalyticsDialog
          campaignId={campaign.id}
          trigger={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={m.campaignsAnalyticsAction()}
            >
              <BarChart3 />
            </Button>
          }
        />
        <CampaignFormDialog campaign={campaign} />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={m.campaignsActionDuplicate()}
          disabled={duplicate.isPending}
          onClick={() => duplicate.mutate()}
        >
          <Copy />
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.campaignsRemoveConfirmTitle({
                  name: campaign.name
                })}
              >
                <Trash2 className="text-destructive" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {m.campaignsRemoveConfirmTitle({ name: campaign.name })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {m.campaignsRemoveConfirmBody()}
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
                  : m.campaignsRemoveConfirmAction()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
