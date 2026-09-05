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
import { Copy, Globe, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { QueryState } from "@/components/query-state";
import { FeatureRequiredError } from "@/lib/api-client";
import { featureUpgradeCopy } from "@/lib/feature-upgrade-copy";
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

  // The list fetch 403s with the raw `feature_required:<key>` message for orgs on a plan
  // without custom domains — swap in the same upgrade copy `AddDomainDialog` already shows,
  // instead of surfacing that machine-readable string to a non-technical tenant.
  const isUpgradeRequired = error instanceof FeatureRequiredError;
  const upgradeCopy = isUpgradeRequired
    ? featureUpgradeCopy(error.featureKey)
    : null;

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
            error={upgradeCopy ? new Error(upgradeCopy.description) : error}
            isEmpty={domains?.length === 0}
            errorTitle={
              upgradeCopy ? upgradeCopy.title : m.domainsLoadErrorTitle()
            }
            emptyTitle={m.domainsEmptyTitle()}
            emptyIcon={<Globe />}
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
        <div className="flex flex-col gap-2">
          <span className="font-medium">{domain.hostname}</span>
          {domain.status !== "active" && cnameTarget && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {m.domainsDnsInstructionsIntro()}
              </span>
              <CopyableDnsRecord
                label={m.domainsCnameHostLabel()}
                value={domain.hostname}
              />
              <CopyableDnsRecord
                label={m.domainsCnameValueLabel()}
                value={cnameTarget}
              />
            </div>
          )}
          {domain.status !== "active" && ownership && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                {m.domainsTxtInstructionsIntro()}
              </span>
              <CopyableDnsRecord
                label={m.domainsTxtHostLabel()}
                value={ownership.name}
              />
              <CopyableDnsRecord
                label={m.domainsTxtValueLabel()}
                value={ownership.value}
              />
            </div>
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

/** One copy-able DNS field (host or value) for the CNAME/TXT setup instructions — a
 * non-technical tenant needs to paste these exactly into their domain registrar's UI, so a
 * plain `<span>` (select-and-copy by hand) isn't enough; mirrors the `Input readOnly` + copy
 * button pattern already used for the webhook URL/API key in `webhook-settings-page.tsx`. */
function CopyableDnsRecord({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <Input readOnly value={value} className="h-7 font-mono text-xs" />
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        aria-label={m.commonCopy()}
        onClick={() => {
          void navigator.clipboard.writeText(value);
          toast.add({ title: m.domainsValueCopiedToast() });
        }}
      >
        <Copy />
      </Button>
    </div>
  );
}
