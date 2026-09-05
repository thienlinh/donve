import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2 } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import { fetchOrgDetail, setOrgDisabled } from "../api";
import { platformKeys } from "../query-keys";
import { PlatformOrgBillingTab } from "./platform-org-billing-tab";

const routeApi = getRouteApi("/_authenticated/platform");

/** Every platform write needs a typed-in reason (platform-admin.md §11) — the API rejects a
 * blank one, so the dialog owns that requirement rather than trusting the caller. */
function ReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  pending,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  pending: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Label htmlFor="platform-reason">{m.platformReasonLabel()}</Label>
        <Textarea
          id="platform-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={m.platformReasonPlaceholder()}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {m.platformCancel()}
          </Button>
          <Button
            disabled={pending || reason.trim().length < 3}
            onClick={() => onConfirm(reason.trim())}
          >
            {m.platformConfirm()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Org detail with the Overview/Billing/Audit tabs from platform-admin.md §11. Write actions are
 * hidden for roles that can't use them — the API is the real gate (`requirePlatformStaff`), this
 * just avoids showing a button that always 403s. */
export function PlatformOrgDetail({ orgId }: { orgId: string }) {
  const { staff } = routeApi.useRouteContext();
  const queryClient = useQueryClient();
  const [disableOpen, setDisableOpen] = useState(false);

  const { data, error, isPending } = useQuery({
    queryKey: platformKeys.org(orgId),
    queryFn: () => fetchOrgDetail(orgId)
  });

  const toggleDisabled = useMutation({
    mutationFn: (input: { disabled: boolean; reason: string }) =>
      setOrgDisabled(orgId, input.disabled, input.reason),
    onSuccess: async () => {
      setDisableOpen(false);
      toast.add({ title: m.platformActionDoneToast(), type: "success" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: platformKeys.org(orgId) }),
        queryClient.invalidateQueries({ queryKey: platformKeys.orgs() })
      ]);
    },
    onError: () =>
      toast.add({ title: m.platformActionErrorToast(), type: "error" })
  });

  const isDisabled = data?.org.disabledAt != null;

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link to="/platform" />}
      >
        <ArrowLeft />
        {m.platformBackToOrgs()}
      </Button>

      <QueryState
        isPending={isPending}
        error={error}
        isEmpty={false}
        errorTitle={m.platformOrgDetailLoadErrorTitle()}
        emptyTitle=""
        emptyIcon={<Building2 />}
        loadingLabel={m.platformOrgsLoading()}
      />

      {data && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {data.org.name}
                <Badge variant={isDisabled ? "destructive" : "secondary"}>
                  {isDisabled
                    ? m.platformOrgsStatusDisabled()
                    : m.platformOrgsStatusActive()}
                </Badge>
                <Badge
                  variant={data.org.plan === "free" ? "outline" : "default"}
                >
                  {data.org.plan}
                </Badge>
              </CardTitle>
              <CardDescription>{data.org.slug}</CardDescription>
            </CardHeader>
            {staff.role === "platform_admin" && (
              <CardContent>
                <Button
                  variant={isDisabled ? "outline" : "destructive"}
                  onClick={() => setDisableOpen(true)}
                >
                  {isDisabled
                    ? m.platformEnableOrgAction()
                    : m.platformDisableOrgAction()}
                </Button>
              </CardContent>
            )}
          </Card>

          <ReasonDialog
            open={disableOpen}
            onOpenChange={setDisableOpen}
            title={
              isDisabled
                ? m.platformEnableOrgAction()
                : m.platformDisableOrgAction()
            }
            description={
              isDisabled
                ? m.platformEnableOrgDescription()
                : m.platformDisableOrgDescription()
            }
            pending={toggleDisabled.isPending}
            onConfirm={(reason) =>
              toggleDisabled.mutate({ disabled: !isDisabled, reason })
            }
          />

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">
                {m.platformTabOverview()}
              </TabsTrigger>
              <TabsTrigger value="billing">
                {m.platformTabBilling()}
              </TabsTrigger>
              <TabsTrigger value="audit">{m.platformTabAudit()}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardContent className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4">
                  <Stat
                    label={m.platformStatMembers()}
                    value={data.stats.memberCount}
                  />
                  <Stat
                    label={m.platformStatCampaigns()}
                    value={data.stats.campaignCount}
                  />
                  <Stat
                    label={m.platformStatLeads()}
                    value={data.stats.leadCount}
                  />
                  <Stat
                    label={m.platformStatCreated()}
                    value={data.org.createdAt.toLocaleDateString()}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <PlatformOrgBillingTab
                detail={data}
                canWrite={staff.role !== "support"}
              />
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>{m.platformTabAudit()}</CardTitle>
                  <CardDescription>
                    {m.platformAuditDescription()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.auditLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {m.platformAuditEmpty()}
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{m.platformAuditColumnAction()}</TableHead>
                          <TableHead>{m.platformAuditColumnStaff()}</TableHead>
                          <TableHead>{m.platformAuditColumnMeta()}</TableHead>
                          <TableHead>{m.platformAuditColumnTime()}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.auditLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {log.action}
                            </TableCell>
                            <TableCell>{log.staffUserId}</TableCell>
                            <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                              {log.meta ?? "—"}
                            </TableCell>
                            <TableCell>
                              {log.createdAt.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
