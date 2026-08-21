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
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Trash2 } from "lucide-react";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

import { fetchCampaignsPage, removeCampaign } from "../api";
import { campaignKeys } from "../query-keys";
import { CampaignAnalyticsDialog } from "./campaign-analytics-dialog";
import {
  CampaignFormDialog,
  campaignStatusLabels
} from "./campaign-form-dialog";

const PAGE_SIZE = 20;

export function CampaignsPage() {
  const [page, setPage] = useState(1);
  const query = { page, pageSize: PAGE_SIZE };
  const { data, isPending, error } = useQuery({
    queryKey: campaignKeys.listPage(query),
    queryFn: () => fetchCampaignsPage(query)
  });
  const campaigns = data?.campaigns;
  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

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
        <CardContent>
          {isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> {m.commonLoading()}
            </div>
          )}
          {error && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{m.campaignsLoadErrorTitle()}</EmptyTitle>
                <EmptyDescription>{error.message}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {campaigns && campaigns.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{m.campaignsEmptyTitle()}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
          {campaigns && campaigns.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
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
                  <CampaignRow key={campaign.id} campaign={campaign} />
                ))}
              </TableBody>
            </Table>
          )}
          {data && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={data.page <= 1}
                onClick={() => setPage(data.page - 1)}
              >
                {m.commonPrevious()}
              </Button>
              <span className="text-sm text-muted-foreground">
                {m.campaignsPaginationLabel({
                  page: data.page,
                  total: totalPages
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={data.page >= totalPages}
                onClick={() => setPage(data.page + 1)}
              >
                {m.commonNext()}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CampaignRow({ campaign }: { campaign: CampaignWithProducts }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const remove = useMutation({
    mutationFn: () => removeCampaign(campaign.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.campaignsRemoveErrorToast(), type: "error" })
  });

  return (
    <TableRow>
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
