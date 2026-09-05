import type {
  OrderDeskItem,
  OrderSearchResult,
  UnmatchedTransactionWithCandidates
} from "@dv/contracts";
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
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
import { CheckCircle2, Clock3, PackageCheck, Scale } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { updateLeadOrderStatus } from "@/features/leads/api";
import { leadSourceLabel } from "@/lib/lead-source-label";
import * as m from "@/paraglide/messages.js";

import {
  executeFulfillment,
  fetchFulfillmentTask,
  fetchOrderDesk,
  fetchUnmatchedTransactions,
  resolveUnmatchedTransaction,
  searchOrders
} from "../api";
import { unmatchedTransactionKeys } from "../query-keys";
export type OrderDeskFilter = OrderDeskItem["status"] | "all";

const REASON_VARIANT = {
  no_candidate: "secondary",
  ambiguous: "default",
  already_paid: "destructive"
} as const;

export function ReconciliationPage({
  initialStatus = "all",
  onStatusChange
}: {
  initialStatus?: OrderDeskFilter;
  onStatusChange?: (status: OrderDeskFilter) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.reconciliationTitle()}</CardTitle>
          <CardDescription>{m.reconciliationDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <UnmatchedTransactionsList />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng và việc giao</CardTitle>
          <CardDescription>
            Đơn đã thanh toán luôn có một hành động rõ ràng; chỉ đánh dấu đã
            giao sau khi bạn xác nhận.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderDeskList
            initialStatus={initialStatus}
            onStatusChange={onStatusChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
const ORDER_STATUS_LABELS: Record<OrderDeskItem["status"] | "all", string> = {
  all: "Tất cả",
  pending: "Chờ thanh toán",
  awaiting_confirmation: "Cần xác nhận",
  paid: "Chưa giao",
  fulfilled: "Đã giao",
  cancelled: "Đã huỷ",
  refunded: "Hoàn tiền"
};

const ORDER_DESK_STATUSES: OrderDeskFilter[] = [
  "all",
  "pending",
  "awaiting_confirmation",
  "paid",
  "fulfilled"
];

function OrderDeskList({
  initialStatus,
  onStatusChange
}: {
  initialStatus: OrderDeskFilter;
  onStatusChange?: (status: OrderDeskFilter) => void;
}) {
  const status = initialStatus;
  const { data, error, isPending, refetch } = useQuery({
    queryKey: ["order-desk", status],
    queryFn: () => fetchOrderDesk(status)
  });

  if (isPending || error || !data) {
    return (
      <QueryState
        error={error}
        errorTitle="Không tải được đơn hàng"
        emptyTitle=""
        isEmpty={false}
        isPending={isPending}
        onRetry={async () => {
          await refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        aria-label="Lọc trạng thái đơn"
        className="flex gap-2 overflow-x-auto pb-1"
        role="group"
      >
        {ORDER_DESK_STATUSES.map((item) => (
          <Button
            aria-pressed={status === item}
            key={item}
            onClick={() => onStatusChange?.(item)}
            variant={status === item ? "default" : "outline"}
          >
            {ORDER_STATUS_LABELS[item]}
          </Button>
        ))}
      </div>
      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <PackageCheck className="mx-auto mb-2 size-5 text-muted-foreground" />
          <p className="text-sm font-medium">Không có đơn trong hàng đợi này</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Khi có đơn mới hoặc thanh toán thành công, việc tiếp theo sẽ xuất
            hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((order) => (
            <OrderDeskRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderDeskRow({ order }: { order: OrderDeskItem }) {
  const queryClient = useQueryClient();
  const isPaid = order.status === "paid";
  const transition = order.status === "awaiting_confirmation" ? "paid" : null;
  const fulfillment = useQuery({
    queryKey: ["fulfillment", order.id],
    queryFn: () => fetchFulfillmentTask(order.id),
    enabled: isPaid || order.status === "fulfilled"
  });
  const update = useMutation({
    mutationFn: async () => {
      if (transition) {
        await updateLeadOrderStatus(order.leadId, order.id, {
          status: "paid",
          reason: "Đã kiểm tra giao dịch"
        });
        return;
      }
      await executeFulfillment(order.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-desk"] });
      queryClient.invalidateQueries({
        queryKey: ["leads", "operatingSummary"]
      });
      queryClient.invalidateQueries({ queryKey: ["fulfillment", order.id] });
    },
    onError: () =>
      toast.add({ title: "Chưa cập nhật được đơn hàng", type: "error" })
  });

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-medium">{order.code}</span>
          <Badge variant="secondary">{ORDER_STATUS_LABELS[order.status]}</Badge>
          {fulfillment.data && (
            <Badge
              variant={
                fulfillment.data.status === "failed" ? "destructive" : "outline"
              }
            >
              {fulfillment.data.status === "completed"
                ? "Đã ghi nhận giao"
                : fulfillment.data.status === "failed"
                  ? "Giao lỗi"
                  : "Chờ giao"}
            </Badge>
          )}
        </div>
        <p className="truncate text-sm">
          {order.leadFullName} · {order.leadPhone}
        </p>
        <p className="text-sm text-muted-foreground">
          {order.amount.toLocaleString("vi-VN")}đ ·{" "}
          {leadSourceLabel(order.source)} ·{" "}
          {new Date(order.createdAt).toLocaleString("vi-VN")}
        </p>
        {fulfillment.data?.lastError && (
          <p className="text-sm text-destructive" role="alert">
            {fulfillment.data.lastError}
          </p>
        )}
      </div>
      {transition || isPaid ? (
        <Button
          disabled={update.isPending || fulfillment.isPending}
          onClick={() => update.mutate()}
          size="sm"
        >
          {transition ? <CheckCircle2 /> : <PackageCheck />}
          {transition ? "Xác nhận đã thanh toán" : "Xác nhận đã giao"}
        </Button>
      ) : (
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="size-4" />{" "}
          {order.status === "pending"
            ? "Chờ khách chuyển khoản"
            : "Đã hoàn tất"}
        </span>
      )}
      {update.error && (
        <div
          className="flex items-center gap-2 text-sm text-destructive"
          role="alert"
        >
          <span>
            {update.error instanceof Error
              ? update.error.message
              : "Không thể cập nhật"}
          </span>
          <Button onClick={() => update.mutate()} size="sm" variant="ghost">
            Thử lại
          </Button>
        </div>
      )}
    </div>
  );
}

function reasonLabel(reason: UnmatchedTransactionWithCandidates["reason"]) {
  if (reason === "no_candidate") return m.reconciliationReasonNoCandidate();
  if (reason === "ambiguous") return m.reconciliationReasonAmbiguous();
  return m.reconciliationReasonAlreadyPaid();
}

function UnmatchedTransactionsList() {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: unmatchedTransactionKeys.list(),
    queryFn: fetchUnmatchedTransactions
  });

  if (isPending || error || !data || data.length === 0) {
    return (
      <QueryState
        isPending={isPending}
        error={error}
        isEmpty={!isPending && !error && (!data || data.length === 0)}
        errorTitle={m.reconciliationLoadErrorTitle()}
        emptyTitle={m.reconciliationEmptyTitle()}
        emptyIcon={<Scale />}
        onRetry={async () => {
          await refetch();
        }}
      />
    );
  }

  const ambiguousCount = data.filter(
    (row) => row.reason === "ambiguous"
  ).length;
  const noCandidateCount = data.filter(
    (row) => row.reason === "no_candidate"
  ).length;
  const alreadyPaidCount = data.filter(
    (row) => row.reason === "already_paid"
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label={m.reconciliationSummaryAmbiguous()}
          value={ambiguousCount}
        />
        <SummaryCard
          label={m.reconciliationSummaryNoCandidate()}
          value={noCandidateCount}
        />
        <SummaryCard
          label={m.reconciliationSummaryAlreadyPaid()}
          value={alreadyPaidCount}
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>{m.reconciliationColumnTransaction()}</TableHead>
              <TableHead>{m.reconciliationColumnAmount()}</TableHead>
              <TableHead>{m.reconciliationColumnReason()}</TableHead>
              <TableHead>{m.reconciliationColumnCandidates()}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TransactionRow key={row.id} transaction={row} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function TransactionRow({
  transaction
}: {
  transaction: UnmatchedTransactionWithCandidates;
}) {
  const queryClient = useQueryClient();

  const resolve = useMutation({
    mutationFn: (orderId: string) =>
      resolveUnmatchedTransaction(transaction.id, { orderId }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: unmatchedTransactionKeys.list()
      }),
    onError: () =>
      toast.add({ title: m.reconciliationResolveErrorToast(), type: "error" })
  });

  const dismiss = useMutation({
    mutationFn: () =>
      resolveUnmatchedTransaction(transaction.id, { dismissed: true }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: unmatchedTransactionKeys.list()
      }),
    onError: () =>
      toast.add({ title: m.reconciliationDismissErrorToast(), type: "error" })
  });

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        {transaction.providerTxId}
      </TableCell>
      <TableCell>
        {transaction.amount === null
          ? "—"
          : `${transaction.amount.toLocaleString("vi-VN")}đ`}
      </TableCell>
      <TableCell>
        <Badge variant={REASON_VARIANT[transaction.reason]}>
          {reasonLabel(transaction.reason)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          {transaction.reason === "ambiguous" &&
            transaction.candidates.map((candidate) => (
              <div key={candidate.orderId} className="flex items-center gap-3">
                <span className="text-sm">
                  {candidate.code} · {candidate.leadFullName} (
                  {candidate.leadPhone}) ·{" "}
                  {candidate.amount.toLocaleString("vi-VN")}đ
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={resolve.isPending}
                  onClick={() => resolve.mutate(candidate.orderId)}
                >
                  {m.reconciliationSelectOrderAction()}
                </Button>
              </div>
            ))}

          {transaction.reason === "no_candidate" && (
            <OrderSearchPicker
              disabled={resolve.isPending}
              onSelect={(orderId) => resolve.mutate(orderId)}
            />
          )}

          {transaction.reason === "already_paid" && (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={dismiss.isPending}
                  >
                    {m.reconciliationDismissAction()}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {m.reconciliationDismissConfirmTitle()}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {m.reconciliationDismissConfirmBody()}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => dismiss.mutate()}>
                    {m.reconciliationDismissAction()}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

/** Manual order-attach search for `no_candidate` transactions (FR-D-09) — searches by order
 * code or lead phone instead of picking from a ranked candidate list. */
function OrderSearchPicker({
  disabled,
  onSelect
}: {
  disabled: boolean;
  onSelect: (orderId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const search = useQuery({
    queryKey: unmatchedTransactionKeys.orderSearch(submittedQuery),
    queryFn: () => searchOrders(submittedQuery),
    enabled: submittedQuery.length > 0
  });

  return (
    <div className="flex flex-col gap-2">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmittedQuery(query.trim());
        }}
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={m.reconciliationSearchPlaceholder()}
          className="h-8 w-56"
        />
        <Button type="submit" size="sm" variant="outline">
          {m.reconciliationSearchButton()}
        </Button>
      </form>

      {search.error && (
        <span className="text-xs text-destructive">
          {m.reconciliationSearchErrorToast()}
        </span>
      )}

      {search.data && search.data.length === 0 && (
        <span className="text-xs text-muted-foreground">
          {m.reconciliationSearchNoResults()}
        </span>
      )}

      {search.data?.map((order: OrderSearchResult) => (
        <div key={order.orderId} className="flex items-center gap-3">
          <span className="text-sm">
            {order.code} · {order.leadFullName} ({order.leadPhone}) ·{" "}
            {order.amount.toLocaleString("vi-VN")}đ
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={() => onSelect(order.orderId)}
          >
            {m.reconciliationSelectOrderAction()}
          </Button>
        </div>
      ))}
    </div>
  );
}
