import type { LandingPageListItem } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Card, CardContent } from "@dv/ui/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@dv/ui/components/shadcn/dropdown-menu";
import { Input } from "@dv/ui/components/shadcn/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Copy,
  ExternalLink,
  FolderMinus,
  FolderPlus,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Trash2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { fetchCampaigns } from "@/features/campaigns/api";
import { campaignKeys } from "@/features/campaigns/query-keys";
import * as m from "@/paraglide/messages.js";

import {
  assignLandingPageToCampaign,
  deleteLandingPage,
  duplicateLandingPage,
  removeLandingPageFromCampaign,
  renameLandingPage,
  thumbnailUrl
} from "../api";
import { formatRelativeTime } from "../lib/relative-time";
import { landingKeys } from "../query-keys";

export function LandingCard({
  landingPage
}: {
  landingPage: LandingPageListItem;
}) {
  const queryClient = useQueryClient();
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(landingPage.name);
  const renameInputRef = useRef<HTMLInputElement>(null);
  // No thumbnail captured yet (FR-B-26 only runs after the first manual save) 404s here —
  // falls back to the icon placeholder rather than a broken image.
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  useEffect(() => {
    if (isRenaming) renameInputRef.current?.focus();
  }, [isRenaming]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: landingKeys.list() });

  const renameMutation = useMutation({
    mutationFn: (name: string) => renameLandingPage(landingPage.id, name),
    onSuccess: invalidate
  });
  const duplicateMutation = useMutation({
    mutationFn: () => duplicateLandingPage(landingPage.id),
    onSuccess: invalidate
  });
  const removeFromCampaignMutation = useMutation({
    mutationFn: () => removeLandingPageFromCampaign(landingPage.id),
    onSuccess: invalidate
  });
  const assignToCampaignMutation = useMutation({
    mutationFn: (campaignId: string) =>
      assignLandingPageToCampaign(landingPage.id, campaignId),
    onSuccess: invalidate
  });
  const { data: campaigns } = useQuery({
    queryKey: campaignKeys.list(),
    queryFn: fetchCampaigns
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteLandingPage(landingPage.id),
    onSuccess: invalidate
  });

  function commitRename() {
    setIsRenaming(false);
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== landingPage.name) {
      renameMutation.mutate(trimmed);
    } else {
      setNameDraft(landingPage.name);
    }
  }

  // 3 distinct editors: `custom_import` (raw HTML, no canvas), native (`isNative` — a PageSpec
  // canvas, whether AI- or hand-authored; `source` alone can't tell since a native-AI page keeps
  // `source: "ai"` forever), or the legacy srcmap editor for everything else. An `ai`-sourced,
  // not-yet-native page with no version is the business→strategy→architecture wizard abandoned
  // mid-flow (e.g. navigated away before finishing) — the legacy editor has no prompt to
  // generate from and dead-ends, so send it back to resume the wizard instead.
  const studioRoute =
    landingPage.source === "custom_import"
      ? ("/landings/$id/custom-import" as const)
      : landingPage.isNative
        ? ("/landings/$id/studio-native" as const)
        : landingPage.source === "ai" && landingPage.currentVersionId === null
          ? ("/landings/$id/business" as const)
          : ("/landings/$id/studio" as const);

  return (
    <Card className="group/landing-card overflow-hidden py-0">
      <Link to={studioRoute} params={{ id: landingPage.id }} className="block">
        {thumbnailFailed ? (
          <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        ) : (
          <img
            key={landingPage.id}
            src={thumbnailUrl(landingPage.id)}
            alt=""
            crossOrigin="use-credentials"
            className="aspect-video w-full bg-muted object-cover"
            onError={() => setThumbnailFailed(true)}
          />
        )}
      </Link>

      <CardContent className="flex flex-col gap-1.5 pb-4">
        <div className="flex items-start justify-between gap-2">
          {isRenaming ? (
            <Input
              ref={renameInputRef}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setNameDraft(landingPage.name);
                  setIsRenaming(false);
                }
              }}
              className="h-7"
            />
          ) : (
            <Link
              to={studioRoute}
              params={{ id: landingPage.id }}
              className="line-clamp-1 font-medium hover:underline"
            >
              {landingPage.name}
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={m.landingsCardActionsLabel()}
                  className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setNameDraft(landingPage.name);
                  setIsRenaming(true);
                }}
              >
                <Pencil /> {m.landingsActionRename()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicateMutation.mutate()}>
                <Copy /> {m.landingsActionDuplicate()}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderPlus /> {m.landingsActionAssignToCampaign()}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {!campaigns || campaigns.length === 0 ? (
                    <DropdownMenuItem disabled>
                      {m.landingsAssignToCampaignEmpty()}
                    </DropdownMenuItem>
                  ) : (
                    campaigns
                      .filter(
                        (campaign) => campaign.id !== landingPage.campaignId
                      )
                      .map((campaign) => (
                        <DropdownMenuItem
                          key={campaign.id}
                          onClick={() =>
                            assignToCampaignMutation.mutate(campaign.id)
                          }
                        >
                          {campaign.name}
                        </DropdownMenuItem>
                      ))
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {landingPage.isPublished && landingPage.liveHostname && (
                <DropdownMenuItem
                  render={
                    <a
                      href={`https://${landingPage.liveHostname}`}
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink /> {m.landingsActionViewLive()}
                </DropdownMenuItem>
              )}
              {landingPage.campaignId && (
                <DropdownMenuItem
                  onClick={() => removeFromCampaignMutation.mutate()}
                >
                  <FolderMinus /> {m.landingsActionRemoveFromCampaign()}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
              >
                <Trash2 /> {m.landingsActionDelete()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Badge variant={landingPage.isPublished ? "default" : "secondary"}>
            {landingPage.isPublished
              ? m.landingsBadgePublished()
              : m.landingsBadgeDraft()}
          </Badge>
          {landingPage.campaignName && (
            <Badge variant="outline">{landingPage.campaignName}</Badge>
          )}
          <span>{formatRelativeTime(landingPage.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
