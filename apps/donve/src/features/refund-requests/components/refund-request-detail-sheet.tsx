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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { DetailSheetSkeleton } from "@/components/detail-sheet-skeleton";
import * as m from "@/paraglide/messages.js";

import {
  completeRefundRequest,
  fetchRefundRequest,
  refundEvidenceUrl,
  rejectRefundRequest,
  uploadRefundEvidence
} from "../api";
import { refundRequestKeys } from "../query-keys";

export function RefundRequestDetailSheet({
  id,
  onOpenChange
}: {
  id: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={id !== null} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto p-4">
        {id && <RefundRequestDetailBody id={id} />}
      </SheetContent>
    </Sheet>
  );
}

function RefundRequestDetailBody({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isPending } = useQuery({
    queryKey: refundRequestKeys.detail(id),
    queryFn: () => fetchRefundRequest(id)
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: refundRequestKeys.detail(id) });
    queryClient.invalidateQueries({ queryKey: ["refund-requests"] });
  };

  const upload = useMutation({
    mutationFn: (file: File) => uploadRefundEvidence(id, file, file.name),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.refundRequestsUploadErrorToast(), type: "error" })
  });

  const complete = useMutation({
    mutationFn: () => completeRefundRequest(id),
    onSuccess: invalidate,
    onError: () =>
      toast.add({ title: m.refundRequestsCompleteErrorToast(), type: "error" })
  });

  const [rejectOpen, setRejectOpen] = useState(false);
  const reject = useMutation({
    mutationFn: () => rejectRefundRequest(id),
    onSuccess: () => {
      setRejectOpen(false);
      invalidate();
    },
    onError: () =>
      toast.add({ title: m.refundRequestsRejectErrorToast(), type: "error" })
  });

  if (isPending || !data) {
    return <DetailSheetSkeleton rows={4} />;
  }

  const canComplete = data.status === "pending" || data.status === "processing";

  return (
    <div className="flex flex-col gap-6">
      <SheetHeader className="p-0">
        <SheetTitle>{data.orderCode}</SheetTitle>
        <SheetDescription>
          {data.leadFullName} · {data.leadPhone}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          {m.refundRequestsColumnAmount()}
        </span>
        <span className="text-lg font-medium">
          {data.amount.toLocaleString("vi-VN")}đ
        </span>
      </div>

      {data.reason === "duplicate_payment" && data.status === "pending" && (
        <Badge variant="destructive" className="w-fit">
          {m.refundRequestsDuplicateBadge()}
        </Badge>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          {m.refundRequestsRemitterLabel()}
        </span>
        <span className="text-sm">
          {data.remitterInfo.name ?? "—"}
          {data.remitterInfo.accountNumber &&
            ` · ${data.remitterInfo.accountNumber}`}
        </span>
      </div>

      {data.evidenceKey && (
        <img
          src={refundEvidenceUrl(id)}
          alt={m.refundRequestsEvidenceLabel()}
          crossOrigin="use-credentials"
          className="w-full rounded border"
        />
      )}

      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
          }}
        />
        <Button
          size="sm"
          variant="outline"
          className="self-start"
          disabled={upload.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {upload.isPending
            ? m.commonLoading()
            : m.refundRequestsUploadEvidenceButton()}
        </Button>

        {canComplete && (
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={complete.isPending}
              onClick={() => complete.mutate()}
            >
              {complete.isPending
                ? m.commonLoading()
                : m.refundRequestsMarkTransferredButton()}
            </Button>

            <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
              <AlertDialogTrigger
                render={
                  <Button size="sm" variant="outline">
                    {m.refundRequestsRejectButton()}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {m.refundRequestsRejectConfirmTitle()}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {m.refundRequestsRejectConfirmBody()}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={reject.isPending}
                    onClick={() => reject.mutate()}
                  >
                    {reject.isPending
                      ? m.commonLoading()
                      : m.refundRequestsRejectConfirmAction()}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
