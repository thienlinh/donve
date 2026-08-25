import type { PublicPaymentConnection } from "@dv/contracts";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Landmark, Trash2 } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import {
  fetchPaymentConnectionGuide,
  fetchPaymentConnections,
  removePaymentConnection
} from "../api";
import { paymentConnectionKeys } from "../query-keys";
import { ConnectPaymentDialog } from "./connect-payment-dialog";

export function PaymentConnectionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <ConnectionsCard />
      <GuideCard />
    </div>
  );
}

function ConnectionsCard() {
  const {
    data: connections,
    isPending,
    error
  } = useQuery({
    queryKey: paymentConnectionKeys.list(),
    queryFn: fetchPaymentConnections
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.paymentConnectionsTitle()}</CardTitle>
        <CardDescription>{m.paymentConnectionsDescription()}</CardDescription>
        <CardAction>
          <ConnectPaymentDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={connections?.length === 0}
          errorTitle={m.paymentConnectionsLoadErrorTitle()}
          emptyTitle={m.paymentConnectionsEmptyTitle()}
          emptyIcon={<Landmark />}
        />
        {connections && connections.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{m.paymentConnectionColumnBank()}</TableHead>
                <TableHead>{m.paymentConnectionColumnAccount()}</TableHead>
                <TableHead>{m.paymentConnectionColumnStatus()}</TableHead>
                <TableHead className="text-end">
                  {m.paymentConnectionColumnActions()}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => (
                <ConnectionRow key={connection.id} connection={connection} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectionRow({
  connection
}: {
  connection: PublicPaymentConnection;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const remove = useMutation({
    mutationFn: () => removePaymentConnection(connection.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentConnectionKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.paymentRemoveConnectionErrorToast(), type: "error" })
  });

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{connection.bankBin}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{connection.accountName}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {connection.accountNumber}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={connection.status === "active" ? "default" : "destructive"}
        >
          {connection.status}
        </Badge>
      </TableCell>
      <TableCell className="flex justify-end gap-1">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.paymentRemoveConnectionAction()}
              >
                <Trash2 className="text-destructive" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {m.paymentRemoveConfirmTitle()}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {m.paymentRemoveConfirmBody()}
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
                  : m.paymentRemoveConnectionAction()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}

/** FR-D-15 step-by-step guide, images/video optional per step (`@dv/drivers` payments.PaymentConnectionGuide). */
function GuideCard() {
  const {
    data: guide,
    isPending,
    error
  } = useQuery({
    queryKey: paymentConnectionKeys.guide(),
    queryFn: fetchPaymentConnectionGuide
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.paymentGuideTitle()}</CardTitle>
        <CardDescription>{m.paymentGuideDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={false}
          errorTitle={m.paymentGuideLoadErrorTitle()}
          emptyTitle=""
        />
        {guide && (
          <ol className="flex flex-col gap-4">
            {guide.steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-2">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                  {step.imageUrl && (
                    <img
                      src={step.imageUrl}
                      alt={step.title}
                      className="max-w-md rounded-md border"
                    />
                  )}
                  {step.videoUrl && (
                    // eslint-disable-next-line jsx-a11y/media-has-caption -- provider-authored setup clips, no captions source available
                    <video
                      src={step.videoUrl}
                      controls
                      className="max-w-md rounded-md border"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
