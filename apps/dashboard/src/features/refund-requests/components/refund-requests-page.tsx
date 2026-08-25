import type { RefundRequestWithOrder, RefundStatus } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { useQuery } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import { fetchRefundRequests } from "../api";
import { refundRequestKeys } from "../query-keys";
import { RefundRequestDetailSheet } from "./refund-request-detail-sheet";

const STATUS_VARIANT = {
  pending: "secondary",
  processing: "default",
  completed: "default",
  rejected: "destructive"
} as const;

function statusLabel(status: RefundStatus) {
  if (status === "pending") return m.refundRequestsStatusPending();
  if (status === "processing") return m.refundRequestsStatusProcessing();
  if (status === "completed") return m.refundRequestsStatusCompleted();
  return m.refundRequestsStatusRejected();
}

function reasonLabel(reason: RefundRequestWithOrder["reason"]) {
  if (reason === "customer_request") return m.refundRequestsReasonCustomer();
  if (reason === "duplicate_payment")
    return m.refundRequestsReasonDuplicatePayment();
  if (reason === "wrong_match") return m.refundRequestsReasonWrongMatch();
  return m.refundRequestsReasonOther();
}

export function RefundRequestsPage() {
  const [status, setStatus] = useState<RefundStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: refundRequestKeys.list(status || undefined),
    queryFn: () => fetchRefundRequests(status || undefined)
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.refundRequestsTitle()}</CardTitle>
          <CardDescription>{m.refundRequestsDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <NativeSelect
            className="w-48"
            value={status}
            onChange={(e) => setStatus(e.target.value as RefundStatus | "")}
          >
            <NativeSelectOption value="">
              {m.refundRequestsFilterAll()}
            </NativeSelectOption>
            <NativeSelectOption value="pending">
              {m.refundRequestsStatusPending()}
            </NativeSelectOption>
            <NativeSelectOption value="processing">
              {m.refundRequestsStatusProcessing()}
            </NativeSelectOption>
            <NativeSelectOption value="completed">
              {m.refundRequestsStatusCompleted()}
            </NativeSelectOption>
            <NativeSelectOption value="rejected">
              {m.refundRequestsStatusRejected()}
            </NativeSelectOption>
          </NativeSelect>

          <QueryState
            isPending={isPending}
            error={error}
            isEmpty={data?.length === 0}
            errorTitle={m.refundRequestsLoadErrorTitle()}
            emptyTitle={m.refundRequestsEmptyTitle()}
            emptyIcon={<Undo2 />}
          />

          {data && data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.refundRequestsColumnOrder()}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {m.refundRequestsColumnLead()}
                  </TableHead>
                  <TableHead>{m.refundRequestsColumnAmount()}</TableHead>
                  <TableHead>{m.refundRequestsColumnReason()}</TableHead>
                  <TableHead>{m.refundRequestsColumnStatus()}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(row.id)}
                  >
                    <TableCell className="font-mono text-xs">
                      {row.orderCode}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {row.leadFullName} · {row.leadPhone}
                    </TableCell>
                    <TableCell>{row.amount.toLocaleString("vi-VN")}đ</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {reasonLabel(row.reason)}
                        {row.reason === "duplicate_payment" &&
                          row.status === "pending" && (
                            <Badge variant="destructive">
                              {m.refundRequestsDuplicateBadge()}
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[row.status]}>
                        {statusLabel(row.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <RefundRequestDetailSheet
        id={selectedId}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}
