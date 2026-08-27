import {
  createDataSubjectRequestSchema,
  dataSubjectRequestTypeValues,
  type CreateDataSubjectRequestInput,
  type DataSubjectRequest,
  type LeadActivity,
  type Order,
  type UpdateLeadOrderStatusInput
} from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle
} from "@dv/ui/components/shadcn/item";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { DetailSheetSkeleton } from "@/components/detail-sheet-skeleton";
import { useActiveOrganizationQuery } from "@/features/auth/queries";
import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import { fetchOrderRefundRequests } from "@/features/refund-requests/api";
import { refundRequestKeys } from "@/features/refund-requests/query-keys";
import { fromDateInputValue, toDateInputValue } from "@/lib/date-input";
import * as m from "@/paraglide/messages.js";

import {
  assignLead,
  completeDataSubjectRequest,
  createDataSubjectRequest,
  createLeadActivity,
  fetchLeadDataSubjectRequests,
  fetchLeadDetail,
  markLeadViewed,
  updateLeadOrderStatus
} from "../api";
import { leadKeys } from "../query-keys";
import { LeadRepeatCustomerBadge } from "./lead-age-badge";

const ACTIVITY_LABELS: Record<LeadActivity["type"], () => string> = {
  note: m.leadsActivityNote,
  call: m.leadsActivityCall,
  stage_change: m.leadsActivityStageChange,
  order_created: m.leadsActivityOrderCreated,
  payment: m.leadsActivityPayment,
  resubmit: m.leadsActivityResubmit,
  system: m.leadsActivitySystem
};

type OrderTransitionTarget = UpdateLeadOrderStatusInput["status"];

/** `createDataSubjectRequestSchema`'s `receivedAt` is `z.coerce.date()` for the wire, but the
 * RHF field already holds a real `Date | undefined` via the `fromDateInputValue` bridge (same
 * reasoning as `product-form-dialog`'s `attributes.startsAt`) — plain `z.date()` here instead. */
const dataSubjectRequestFormSchema = createDataSubjectRequestSchema.extend({
  receivedAt: z.date().optional()
});

const ORDER_TRANSITIONS: Record<Order["status"], OrderTransitionTarget[]> = {
  pending: ["awaiting_confirmation", "paid", "cancelled"],
  awaiting_confirmation: ["paid", "cancelled"],
  paid: ["fulfilled"],
  fulfilled: [],
  cancelled: [],
  refunded: []
};

export function LeadDetailSheet({
  leadId,
  onOpenChange
}: {
  leadId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={leadId !== null} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto p-4">
        {leadId && <LeadDetailBody leadId={leadId} />}
      </SheetContent>
    </Sheet>
  );
}

function LeadDetailBody({ leadId }: { leadId: string }) {
  const queryClient = useQueryClient();
  const { data: activeOrganization } = useActiveOrganizationQuery();
  const { data, isPending } = useQuery({
    queryKey: leadKeys.detail(leadId),
    queryFn: () => fetchLeadDetail(leadId)
  });
  // Orders can span campaigns other than the lead's current `campaign` (a resubmit from a
  // later campaign merges onto the same phone-deduped lead) — name lookup for the per-order
  // campaign shown in the CSKH history below. Shares the cache `LeadsFilterBar` already warms.
  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns
  });
  const [note, setNote] = useState("");
  const [pendingTransition, setPendingTransition] = useState<{
    orderId: string;
    status: OrderTransitionTarget;
  } | null>(null);
  const [reason, setReason] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) });
    queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
  };

  // Fire-and-forget — clears the unread dot without blocking the sheet on the round trip.
  useEffect(() => {
    void markLeadViewed(leadId).then(() => {
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) });
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
    });
  }, [leadId, queryClient]);

  const assign = useMutation({
    mutationFn: (assigneeId: string | null) =>
      assignLead(leadId, { assigneeId }),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.leadsAssignErrorToast(), type: "error" })
  });

  const addNote = useMutation({
    mutationFn: () =>
      createLeadActivity(leadId, { type: "note", body: note.trim() }),
    onSuccess: () => {
      setNote("");
      invalidate();
    },
    onError: () => toast.add({ title: m.leadsNoteErrorToast(), type: "error" })
  });

  const changeOrderStatus = useMutation({
    mutationFn: ({
      orderId,
      status,
      reason
    }: {
      orderId: string;
      status: OrderTransitionTarget;
      reason: string;
    }) => updateLeadOrderStatus(leadId, orderId, { status, reason }),
    onSuccess: () => {
      invalidate();
      setPendingTransition(null);
      setReason("");
    },
    onError: () => toast.add({ title: m.leadsOrderErrorToast(), type: "error" })
  });

  if (isPending || !data) {
    return <DetailSheetSkeleton />;
  }

  const { lead, activities, orders, campaign } = data;
  const campaignNameById = new Map(
    campaigns?.map((c) => [c.id, c.name] as const)
  );
  const totalPaidAmount = orders
    .filter((order) => order.status === "paid" || order.status === "fulfilled")
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <SheetHeader className="p-0">
        <SheetTitle className="flex items-center gap-2">
          {lead.fullName}
          <LeadRepeatCustomerBadge orderCount={orders.length} />
        </SheetTitle>
        <SheetDescription>{lead.phone}</SheetDescription>
        {campaign && (
          <span className="text-xs text-muted-foreground">
            {m.leadsCampaignLabel()}: {campaign.name}
          </span>
        )}
        {orders.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {m.leadsOrderCountLabel()}: {orders.length}
            {totalPaidAmount > 0 &&
              ` · ${m.leadsTotalPaidLabel()}: ${totalPaidAmount.toLocaleString("vi-VN")}đ`}
          </span>
        )}
      </SheetHeader>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<a href={`tel:${lead.phone}`} />}
        >
          <Phone /> {m.leadsActionCall()}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            void navigator.clipboard.writeText(lead.phone);
            toast.add({ title: m.leadsActionCopiedToast() });
          }}
        >
          <Copy /> {m.leadsActionCopyPhone()}
        </Button>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={
            <a
              href={`https://zalo.me/${lead.phone.replace(/^\+/, "")}`}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          <MessageCircle /> {m.leadsActionZalo()}
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          {m.leadsAssigneeLabel()}
        </span>
        <NativeSelect
          value={lead.assigneeId ?? ""}
          onChange={(e) => assign.mutate(e.target.value || null)}
        >
          <NativeSelectOption value="">
            {m.leadsUnassigned()}
          </NativeSelectOption>
          {activeOrganization?.members.map((member) => (
            <NativeSelectOption key={member.id} value={member.userId}>
              {member.user.name || member.user.email}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      {orders.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">
            {m.leadsOrdersLabel()}
          </span>
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-md border p-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{order.code}</span>
                <div className="flex items-center gap-1.5">
                  <OrderDuplicatePaymentBadge orderId={order.id} />
                  <Badge variant="secondary">{order.status}</Badge>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {order.amount.toLocaleString("vi-VN")}đ
                {campaignNameById.has(order.campaignId) &&
                  ` · ${campaignNameById.get(order.campaignId)}`}
              </span>
              {ORDER_TRANSITIONS[order.status].length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ORDER_TRANSITIONS[order.status].map((next) => (
                    <Button
                      key={next}
                      size="sm"
                      variant="outline"
                      disabled={changeOrderStatus.isPending}
                      onClick={() =>
                        setPendingTransition({
                          orderId: order.id,
                          status: next
                        })
                      }
                    >
                      {next === "paid" && m.leadsOrderConfirmPayment()}
                      {next === "fulfilled" && m.leadsOrderFulfill()}
                      {next === "awaiting_confirmation" &&
                        m.leadsOrderAwaitingConfirmation()}
                      {next === "cancelled" && m.leadsOrderCancel()}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <LeadDataSubjectRequests leadId={leadId} />

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          {m.leadsAddNoteLabel()}
        </span>
        <Textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={m.leadsAddNotePlaceholder()}
        />
        <Button
          size="sm"
          className="self-start"
          disabled={!note.trim() || addNote.isPending}
          onClick={() => addNote.mutate()}
        >
          {addNote.isPending ? m.commonLoading() : m.leadsAddNoteSubmit()}
        </Button>
      </div>

      <ItemGroup>
        <span className="text-xs text-muted-foreground">
          {m.leadsTimelineLabel()}
        </span>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </ItemGroup>

      <Dialog
        open={pendingTransition !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingTransition(null);
            setReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m.leadsOrderReasonTitle()}</DialogTitle>
          </DialogHeader>
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={m.leadsOrderReasonPlaceholder()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPendingTransition(null);
                setReason("");
              }}
            >
              {m.leadsOrderReasonCancel()}
            </Button>
            <Button
              disabled={!reason.trim() || changeOrderStatus.isPending}
              onClick={() =>
                pendingTransition &&
                changeOrderStatus.mutate({
                  ...pendingTransition,
                  reason: reason.trim()
                })
              }
            >
              {m.leadsOrderReasonConfirm()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** FR-D-14: surfaces a pending duplicate-payment refund request against this order, so sales
 * doesn't miss it while working the lead. */
function OrderDuplicatePaymentBadge({ orderId }: { orderId: string }) {
  const { data } = useQuery({
    queryKey: refundRequestKeys.forOrder(orderId),
    queryFn: () => fetchOrderRefundRequests(orderId)
  });

  const hasPendingDuplicate = data?.some(
    (request) =>
      request.reason === "duplicate_payment" && request.status === "pending"
  );
  if (!hasPendingDuplicate) return null;

  return (
    <Badge variant="destructive">{m.refundRequestsDuplicateBadge()}</Badge>
  );
}

/** NFR-10 (Nghị định 13/2023/NĐ-CP) — lets sales/admin log a lead's delete/export request and
 * track it against the org's own 72h response SLA (NFR-12), right where they're already
 * looking at the lead. */
function LeadDataSubjectRequests({ leadId }: { leadId: string }) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data } = useQuery({
    queryKey: leadKeys.dataSubjectRequests(leadId),
    queryFn: () => fetchLeadDataSubjectRequests(leadId)
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting }
  } = useForm({
    resolver: zodResolver(dataSubjectRequestFormSchema),
    defaultValues: {
      requestType: "delete",
      receivedAt: undefined,
      notes: ""
    }
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: leadKeys.dataSubjectRequests(leadId)
    });
    queryClient.invalidateQueries({
      queryKey: leadKeys.orgDataSubjectRequests()
    });
  };

  const create = useMutation({
    mutationFn: (values: CreateDataSubjectRequestInput) =>
      createDataSubjectRequest(leadId, values),
    onSuccess: () => {
      invalidate();
      setDialogOpen(false);
      reset();
    },
    onError: () =>
      toast.add({ title: m.leadsDsrCreateErrorToast(), type: "error" })
  });

  const complete = useMutation({
    mutationFn: (id: string) => completeDataSubjectRequest(leadId, id),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.leadsDsrCompleteErrorToast(), type: "error" })
  });

  const onSubmit = handleSubmit((values) => create.mutate(values));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {m.leadsDsrSectionLabel()}
        </span>
        <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
          {m.leadsDsrAddButton()}
        </Button>
      </div>

      {data && data.length === 0 && (
        <span className="text-xs text-muted-foreground">
          {m.leadsDsrEmpty()}
        </span>
      )}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.map((request) => (
            <DataSubjectRequestRow
              key={request.id}
              request={request}
              onComplete={() => complete.mutate(request.id)}
              completing={complete.isPending}
            />
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m.leadsDsrDialogTitle()}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dsr-type">{m.leadsDsrTypeLabel()}</Label>
              <NativeSelect
                id="dsr-type"
                className="w-full"
                {...register("requestType")}
              >
                {dataSubjectRequestTypeValues.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {value === "delete"
                      ? m.leadsDsrTypeDelete()
                      : m.leadsDsrTypeExport()}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dsr-received-at">
                {m.leadsDsrReceivedAtLabel()}
              </Label>
              <Controller
                control={control}
                name="receivedAt"
                render={({ field }) => (
                  <Input
                    id="dsr-received-at"
                    type="date"
                    className="w-full"
                    value={toDateInputValue(field.value)}
                    onChange={(e) =>
                      field.onChange(
                        fromDateInputValue(e.target.value) ?? undefined
                      )
                    }
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dsr-notes">{m.leadsDsrNotesLabel()}</Label>
              <Textarea
                id="dsr-notes"
                rows={2}
                className="w-full"
                placeholder={m.leadsDsrNotesPlaceholder()}
                {...register("notes")}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                {m.leadsDsrCancel()}
              </Button>
              <Button type="submit" disabled={isSubmitting || create.isPending}>
                {isSubmitting || create.isPending
                  ? m.commonLoading()
                  : m.leadsDsrSubmit()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DataSubjectRequestRow({
  request,
  onComplete,
  completing
}: {
  request: DataSubjectRequest;
  onComplete: () => void;
  completing: boolean;
}) {
  const overdue = request.status === "pending" && request.dueAt < new Date();

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5">
          {request.requestType === "delete"
            ? m.leadsDsrTypeDelete()
            : m.leadsDsrTypeExport()}
          {" · "}
          {request.status === "pending"
            ? m.leadsDsrStatusPending()
            : m.leadsDsrStatusCompleted()}
          {overdue && (
            <Badge variant="destructive">{m.leadsDsrOverdueBadge()}</Badge>
          )}
        </span>
        <span className="text-xs text-muted-foreground">
          {m.leadsDsrDueLabel()}: {request.dueAt.toLocaleString()}
        </span>
        {request.notes && (
          <span className="text-xs text-muted-foreground">{request.notes}</span>
        )}
      </div>
      {request.status === "pending" && (
        <Button
          size="sm"
          variant="outline"
          disabled={completing}
          onClick={onComplete}
        >
          {m.leadsDsrCompleteAction()}
        </Button>
      )}
    </div>
  );
}

function ActivityItem({ activity }: { activity: LeadActivity }) {
  return (
    <div className="flex flex-col gap-0.5 border-b py-2 last:border-b-0">
      <ItemContent>
        <ItemTitle>{ACTIVITY_LABELS[activity.type]()}</ItemTitle>
        {activity.body && <ItemDescription>{activity.body}</ItemDescription>}
        <span className="text-xs text-muted-foreground">
          {new Date(activity.createdAt).toLocaleString()}
        </span>
      </ItemContent>
    </div>
  );
}
