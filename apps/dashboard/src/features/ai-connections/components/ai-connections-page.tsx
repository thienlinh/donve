import type { PublicAiConnection } from "@dv/contracts";
import { Alert, AlertTitle } from "@dv/ui/components/shadcn/alert";
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
import { Star, TriangleAlert, Trash2 } from "lucide-react";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

import {
  fetchAiConnections,
  fetchAiUsage,
  removeAiConnection,
  updateAiConnection
} from "../api";
import { aiConnectionKeys, aiUsageKeys } from "../query-keys";
import { ConnectAiDialog } from "./connect-ai-dialog";

export function AiConnectionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <UsageCard />
      <ConnectionsCard />
    </div>
  );
}

function UsageCard() {
  const {
    data: usage,
    isPending,
    error
  } = useQuery({
    queryKey: aiUsageKeys.summary(),
    queryFn: fetchAiUsage
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.aiUsageTitle()}</CardTitle>
        <CardDescription>{m.aiUsageDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> {m.commonLoading()}
          </div>
        )}
        {error && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.aiUsageLoadErrorTitle()}</EmptyTitle>
              <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {usage && (
          <>
            {(usage.aiCreditBalance === 0 ||
              usage.trialUsesRemaining === 0) && (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>
                  {usage.aiCreditBalance === 0
                    ? m.aiCreditBalanceLowWarning()
                    : m.aiTrialRemainingLowWarning()}
                </AlertTitle>
              </Alert>
            )}
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {m.aiCreditBalanceLabel()}
                </span>
                <span className="text-lg font-medium">
                  {usage.aiCreditBalance}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {m.aiTrialRemainingLabel()}
                </span>
                <span className="text-lg font-medium">
                  {usage.trialUsesRemaining}
                </span>
              </div>
            </div>
            {usage.recentUsage.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{m.aiUsageEmptyTitle()}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{m.aiUsageColumnModel()}</TableHead>
                    <TableHead>{m.aiUsageColumnTokens()}</TableHead>
                    <TableHead>{m.aiUsageColumnCost()}</TableHead>
                    <TableHead>{m.aiUsageColumnDate()}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usage.recentUsage.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">
                        {row.model}
                      </TableCell>
                      <TableCell>
                        {row.inputTokens + row.outputTokens}
                      </TableCell>
                      <TableCell>{row.creditCost}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.createdAt.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectionsCard() {
  const {
    data: connections,
    isPending,
    error
  } = useQuery({
    queryKey: aiConnectionKeys.list(),
    queryFn: fetchAiConnections
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.aiConnectionsTitle()}</CardTitle>
        <CardDescription>{m.aiConnectionsDescription()}</CardDescription>
        <CardAction>
          <ConnectAiDialog />
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
              <EmptyTitle>{m.aiConnectionsLoadErrorTitle()}</EmptyTitle>
              <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        {connections && connections.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.aiConnectionsEmptyTitle()}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
        {connections && connections.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{m.aiConnectionColumnProvider()}</TableHead>
                <TableHead>{m.aiConnectionColumnModel()}</TableHead>
                <TableHead>{m.aiConnectionColumnStatus()}</TableHead>
                <TableHead className="text-end">
                  {m.aiConnectionColumnActions()}
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

function ConnectionRow({ connection }: { connection: PublicAiConnection }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const setDefault = useMutation({
    mutationFn: () => updateAiConnection(connection.id, { isDefault: true }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: aiConnectionKeys.list() }),
    onError: () =>
      toast.add({ title: m.aiSetDefaultErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => removeAiConnection(connection.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiConnectionKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.aiRemoveConnectionErrorToast(), type: "error" })
  });

  return (
    <TableRow>
      <TableCell className="flex items-center gap-2 font-medium">
        {connection.provider}
        {connection.isDefault && <Badge variant="secondary">Default</Badge>}
      </TableCell>
      <TableCell className="font-mono text-xs">
        {connection.defaultModel}
      </TableCell>
      <TableCell>
        <Badge
          variant={connection.status === "active" ? "default" : "destructive"}
        >
          {connection.status}
        </Badge>
      </TableCell>
      <TableCell className="flex justify-end gap-1">
        {!connection.isDefault && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.aiSetDefaultAction()}
            disabled={setDefault.isPending}
            onClick={() => setDefault.mutate()}
          >
            <Star />
          </Button>
        )}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.aiRemoveConnectionAction()}
              >
                <Trash2 className="text-destructive" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{m.aiRemoveConfirmTitle()}</AlertDialogTitle>
              <AlertDialogDescription>
                {m.aiRemoveConfirmBody()}
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
                  : m.aiRemoveConnectionAction()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
