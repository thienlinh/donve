import type { CustomDomain } from "@dv/contracts";
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
import { RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import {
  fetchCustomDomains,
  removeCustomDomain,
  verifyCustomDomain
} from "../api";
import { customDomainKeys } from "../query-keys";
import { AddDomainDialog } from "./add-domain-dialog";

export function DomainsPage() {
  const queryClient = useQueryClient();
  const {
    data: domains,
    isPending,
    error
  } = useQuery({
    queryKey: customDomainKeys.list(),
    queryFn: fetchCustomDomains
  });

  // `POST /:id/verify` is what actually re-checks Cloudflare's DCV/SSL status (the list query
  // just reads whatever `domains.status` was last written) — DNS propagation + cert issuance can
  // take minutes to hours, and a non-technical tenant has no reason to know they must come back
  // and click the verify button themselves, so poll it for them while anything is still pending.
  const pendingIds = (domains ?? [])
    .filter((d) => d.status !== "active")
    .map((d) => d.id);
  const pendingKey = pendingIds.join(",");
  useEffect(() => {
    if (!pendingKey) return;
    const interval = setInterval(() => {
      void Promise.all(pendingIds.map((id) => verifyCustomDomain(id))).then(
        () =>
          queryClient.invalidateQueries({ queryKey: customDomainKeys.list() })
      );
    }, 15_000);
    return () => clearInterval(interval);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- re-subscribe only when the pending id set actually changes (pendingIds/queryClient are derived/stable each render, not independent triggers)
  }, [pendingKey]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.domainsTitle()}</CardTitle>
          <CardDescription>{m.domainsDescription()}</CardDescription>
          <CardAction>
            <AddDomainDialog />
          </CardAction>
        </CardHeader>
        <CardContent>
          <QueryState
            isPending={isPending}
            error={error}
            isEmpty={domains?.length === 0}
            errorTitle={m.domainsLoadErrorTitle()}
            emptyTitle={m.domainsEmptyTitle()}
          />
          {domains && domains.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.domainsColumnHostname()}</TableHead>
                  <TableHead>{m.domainsColumnStatus()}</TableHead>
                  <TableHead className="text-end">
                    {m.domainsColumnActions()}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <DomainRow key={domain.id} domain={domain} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const STATUS_VARIANT = {
  active: "default",
  pending: "secondary",
  failed: "destructive"
} as const;

function statusLabel(status: CustomDomain["status"]): string {
  if (status === "active") return m.domainsStatusActive();
  if (status === "failed") return m.domainsStatusFailed();
  return m.domainsStatusPending();
}

function DomainRow({ domain }: { domain: CustomDomain }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const verify = useMutation({
    mutationFn: () => verifyCustomDomain(domain.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: customDomainKeys.list() }),
    onError: () =>
      toast.add({ title: m.domainsVerifyErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => removeCustomDomain(domain.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customDomainKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.domainsRemoveErrorToast(), type: "error" })
  });

  const cnameTarget = domain.verification.cnameTarget;
  const ownership = domain.verification.ownershipVerification;

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="font-medium">{domain.hostname}</span>
          {domain.status !== "active" && cnameTarget && (
            <span className="text-xs text-muted-foreground">
              {m.domainsCnameInstructions({
                hostname: domain.hostname,
                target: cnameTarget
              })}
            </span>
          )}
          {domain.status !== "active" && ownership && (
            <span className="font-mono text-xs text-muted-foreground">
              TXT {ownership.name} → {ownership.value}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={STATUS_VARIANT[domain.status]}>
          {statusLabel(domain.status)}
        </Badge>
      </TableCell>
      <TableCell className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={m.domainsVerifyButton()}
          disabled={verify.isPending || domain.status === "active"}
          onClick={() => verify.mutate()}
        >
          <RefreshCw
            className={verify.isPending ? "animate-spin" : undefined}
          />
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.domainsRemoveAction()}
              >
                <Trash2 className="text-destructive" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {m.domainsRemoveConfirmTitle({ hostname: domain.hostname })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {m.domainsRemoveConfirmBody()}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={remove.isPending}
                onClick={() => remove.mutate()}
              >
                {remove.isPending ? m.commonLoading() : m.domainsRemoveAction()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
