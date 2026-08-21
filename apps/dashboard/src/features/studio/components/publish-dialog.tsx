import type { Deployment, LandingPage } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@dv/ui/components/shadcn/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import { Separator } from "@dv/ui/components/shadcn/separator";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, History, Loader2, TriangleAlert } from "lucide-react";
import * as React from "react";

import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import * as m from "@/paraglide/messages.js";

import {
  assignLandingPageToCampaign,
  fetchDeployments,
  publishLandingPage,
  rollbackDeployment,
  unpublishLandingPage
} from "../api";
import { formatRelativeTime } from "../lib/relative-time";
import { deploymentKeys, landingKeys } from "../query-keys";

/** The landing runtime's own lead-form selector (`apps/landing-runtime/src/lead-form.ts`,
 * `bindLeadForms`) — a plain substring/attribute match is enough, no need to parse the HTML. */
const LEAD_FORM_MARKER = /data-dv-form=["']lead["']/;

/** FR-G-01/02/03 — publish/rollback/unpublish, all through the same outbox mechanism
 * (architecture.md §5.2) already implemented server-side; this dialog is just the UI on top. */
export function PublishDialog({
  landingPage,
  html,
  open,
  onOpenChange
}: {
  landingPage: LandingPage;
  /** current version's HTML, if loaded — used only to check for a lead form (FR-C-04). */
  html: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <PublishDialogBody
            landingPage={landingPage}
            html={html}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PublishDialogBody({
  landingPage,
  html,
  onOpenChange
}: {
  landingPage: LandingPage;
  html: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const landingPageId = landingPage.id;
  const queryClient = useQueryClient();
  const { data: deployments, isLoading } = useQuery({
    queryKey: deploymentKeys.list(landingPageId),
    queryFn: () => fetchDeployments(landingPageId)
  });

  // FR-C-04: a form with no campaign has no field config, no payment config, and nothing to
  // submit into — warn (don't block) at the point that actually matters, publish time.
  const hasLeadForm = html !== null && LEAD_FORM_MARKER.test(html);
  const needsCampaign = hasLeadForm && !landingPage.campaignId;
  const [publishAnyway, setPublishAnyway] = React.useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = React.useState<
    string | null
  >(null);
  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns,
    enabled: needsCampaign
  });
  const campaignItems = React.useMemo(
    () => (campaigns ?? []).map((c) => ({ value: c.id, label: c.name })),
    [campaigns]
  );
  const attachCampaignMutation = useMutation({
    mutationFn: (campaignId: string) =>
      assignLandingPageToCampaign(landingPageId, campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: landingKeys.detail(landingPageId)
      });
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      toast.add({
        title: m.studioPublishCampaignAttachedToast(),
        type: "success"
      });
    },
    onError: () =>
      toast.add({
        title: m.studioPublishCampaignAttachErrorToast(),
        type: "error"
      })
  });

  const live = deployments?.find((d) => d.status === "live") ?? null;
  const history =
    deployments?.filter(
      (d) =>
        d.id !== live?.id && d.status !== "building" && d.status !== "failed"
    ) ?? [];

  const [subdomain, setSubdomain] = React.useState(
    () => live?.hostname.split(".")[0] ?? ""
  );
  // Prefills once the live deployment loads, without clobbering an in-progress edit.
  const prefilled = React.useRef(false);
  React.useEffect(() => {
    if (live && !prefilled.current) {
      setSubdomain(live.hostname.split(".")[0] ?? "");
      prefilled.current = true;
    }
  }, [live]);

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: deploymentKeys.list(landingPageId)
    });
    queryClient.invalidateQueries({ queryKey: landingKeys.list() });
    queryClient.invalidateQueries({
      queryKey: landingKeys.detail(landingPageId)
    });
  }

  const publishMutation = useMutation({
    mutationFn: () => publishLandingPage(landingPageId, subdomain.trim()),
    onSuccess: ({ deployment }) => {
      invalidate();
      toast.add({
        title: m.studioPublishSuccessToast({ hostname: deployment.hostname }),
        type: "success"
      });
    },
    onError: () =>
      toast.add({ title: m.studioPublishErrorToast(), type: "error" })
  });

  const rollbackMutation = useMutation({
    mutationFn: (deploymentId: string) =>
      rollbackDeployment(landingPageId, deploymentId),
    onSuccess: () => {
      invalidate();
      toast.add({ title: m.studioRollbackSuccessToast(), type: "success" });
    },
    onError: () =>
      toast.add({ title: m.studioRollbackErrorToast(), type: "error" })
  });

  const unpublishMutation = useMutation({
    mutationFn: () => unpublishLandingPage(landingPageId),
    onSuccess: () => {
      invalidate();
      toast.add({ title: m.studioUnpublishSuccessToast(), type: "success" });
    },
    onError: () =>
      toast.add({ title: m.studioUnpublishErrorToast(), type: "error" })
  });

  const trimmedSubdomain = subdomain.trim();

  return (
    <>
      <DialogHeader>
        <DialogTitle>{m.studioPublishDialogTitle()}</DialogTitle>
        <DialogDescription>
          {m.studioPublishDialogDescription()}
        </DialogDescription>
      </DialogHeader>

      {live && (
        <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
          <div className="flex min-w-0 items-center gap-1.5">
            <Badge>{m.landingsBadgePublished()}</Badge>
            <a
              href={`https://${live.hostname}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-w-0 items-center gap-1 truncate font-medium hover:underline"
            >
              <span className="truncate">{live.hostname}</span>
              <ExternalLink className="size-3.5 shrink-0" />
            </a>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={unpublishMutation.isPending}
            onClick={() => unpublishMutation.mutate()}
          >
            {unpublishMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : null}
            {m.studioUnpublishButton()}
          </Button>
        </div>
      )}

      {needsCampaign && !publishAnyway && (
        <div className="space-y-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <div className="flex gap-2">
            <TriangleAlert className="size-4 shrink-0 text-amber-600" />
            <p>{m.studioPublishNoCampaignWarning()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Combobox
              items={campaignItems}
              value={
                campaignItems.find((c) => c.value === selectedCampaignId) ??
                null
              }
              onValueChange={(item) =>
                setSelectedCampaignId(item?.value ?? null)
              }
            >
              <ComboboxInput
                className="flex-1"
                placeholder={m.studioPublishCampaignSearchPlaceholder()}
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {m.studioPublishCampaignSearchEmpty()}
                </ComboboxEmpty>
                <ComboboxList>
                  <ComboboxCollection>
                    {(item: { value: string; label: string }) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Button
              size="sm"
              disabled={!selectedCampaignId || attachCampaignMutation.isPending}
              onClick={() =>
                selectedCampaignId &&
                attachCampaignMutation.mutate(selectedCampaignId)
              }
            >
              {attachCampaignMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : null}
              {m.studioPublishAttachCampaignButton()}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPublishAnyway(true)}
          >
            {m.studioPublishAnywayButton()}
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <label
            htmlFor="publish-subdomain"
            className="text-sm font-medium text-muted-foreground"
          >
            {m.studioPublishSubdomainLabel()}
          </label>
          <Input
            id="publish-subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            placeholder="my-landing-page"
          />
        </div>
        <Button
          disabled={
            !trimmedSubdomain ||
            publishMutation.isPending ||
            (needsCampaign && !publishAnyway)
          }
          onClick={() => publishMutation.mutate()}
        >
          {publishMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : null}
          {live ? m.studioPublishUpdateButton() : m.studioPublishButton()}
        </Button>
      </div>

      {(isLoading || history.length > 0) && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <History className="size-3.5" /> {m.studioDeployHistoryTitle()}
            </div>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {history.map((deployment) => (
                <DeploymentRow
                  key={deployment.id}
                  deployment={deployment}
                  onRollback={() => rollbackMutation.mutate(deployment.id)}
                  rollingBack={
                    rollbackMutation.isPending &&
                    rollbackMutation.variables === deployment.id
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}

      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)}>
          {m.commonCancel()}
        </Button>
      </DialogFooter>
    </>
  );
}

function DeploymentRow({
  deployment,
  onRollback,
  rollingBack
}: {
  deployment: Deployment;
  onRollback: () => void;
  rollingBack: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
      <div className="flex min-w-0 flex-col">
        <span className="truncate">
          {formatRelativeTime(deployment.createdAt)}
        </span>
        <span className="text-xs text-muted-foreground">
          {deployment.status === "unpublished"
            ? m.studioDeployStatusUnpublished()
            : m.studioDeployStatusSuperseded()}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={rollingBack}
        onClick={onRollback}
      >
        {rollingBack ? <Loader2 className="animate-spin" /> : null}
        {m.studioRollbackButton()}
      </Button>
    </div>
  );
}
