import type {
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
import { Scale } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import {
  fetchUnmatchedTransactions,
  resolveUnmatchedTransaction,
  searchOrders
} from "../api";
import { unmatchedTransactionKeys } from "../query-keys";

const REASON_VARIANT = {
  no_candidate: "secondary",
  ambiguous: "default",
  already_paid: "destructive"
} as const;

export function ReconciliationPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.reconciliationTitle()}</CardTitle>
          <CardDescription>{m.reconciliationDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <UnmatchedTransactionsList />
        </CardContent>
      </Card>
    </div>
  );
}

function reasonLabel(reason: UnmatchedTransactionWithCandidates["reason"]) {
  if (reason === "no_candidate") return m.reconciliationReasonNoCandidate();
  if (reason === "ambiguous") return m.reconciliationReasonAmbiguous();
  return m.reconciliationReasonAlreadyPaid();
}

function UnmatchedTransactionsList() {
  const { data, isPending, error } = useQuery({
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
      />
    );
  }

  return (
    <Table>
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
