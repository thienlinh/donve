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
  landingPage,
  surface = "landing-pages"
}: {
  landingPage: LandingPageListItem;
  surface?: "landing-pages" | "offers";
}) {
  const isOfferSurface = surface === "offers";
  const detailTo = "/offers/$id";
  const displayName =
    isOfferSurface && landingPage.campaignName
      ? landingPage.campaignName
      : landingPage.name;
  // Avoid a known 404 request for pages that have never produced a thumbnail.
  const hasThumbnail = landingPage.thumbnailKey !== null;
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const queryClient = useQueryClient();
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(landingPage.name);
  const renameInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <Card className="group/landing-card overflow-hidden py-0">
      <Link
        aria-label={
          isOfferSurface
            ? `Mở sản phẩm đang bán ${displayName}`
            : `Mở trang bán ${landingPage.name}`
        }
        to={detailTo}
        params={{ id: landingPage.id }}
        className="block"
      >
        {thumbnailFailed || !hasThumbnail ? (
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
          <div className="flex min-w-0 flex-col gap-0.5">
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
                to={detailTo}
                params={{ id: landingPage.id }}
                className="line-clamp-1 font-medium hover:underline"
              >
                {displayName}
              </Link>
            )}
            {isOfferSurface && displayName !== landingPage.name && (
              <span className="line-clamp-1 text-xs text-muted-foreground">
                {m.shellLandingsNav()}: {landingPage.name}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={m.landingsCardActionsLabel()}
                  className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
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
          {isOfferSurface ? (
            <Badge variant="outline">{m.shellLandingsNav()}</Badge>
          ) : (
            landingPage.campaignName && (
              <Badge variant="outline">{landingPage.campaignName}</Badge>
            )
          )}
          <span>{formatRelativeTime(landingPage.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
