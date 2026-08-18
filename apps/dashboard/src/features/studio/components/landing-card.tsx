import type { LandingPageListItem } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Card, CardContent } from "@dv/ui/components/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@dv/ui/components/shadcn/dropdown-menu";
import { Input } from "@dv/ui/components/shadcn/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Copy,
  ExternalLink,
  FolderMinus,
  ImageIcon,
  MoreHorizontal,
  Pencil,
  Trash2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import * as m from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";

import {
  deleteLandingPage,
  duplicateLandingPage,
  removeLandingPageFromCampaign,
  renameLandingPage
} from "../api";
import { landingKeys } from "../query-keys";

const relativeTimeFormatter = new Intl.RelativeTimeFormat(getLocale(), {
  numeric: "auto"
});

function formatRelativeTime(date: Date): string {
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const thresholds: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60]
  ];
  for (const [unit, secondsInUnit] of thresholds) {
    if (Math.abs(diffSeconds) >= secondsInUnit) {
      return relativeTimeFormatter.format(
        Math.round(diffSeconds / secondsInUnit),
        unit
      );
    }
  }
  return relativeTimeFormatter.format(diffSeconds, "second");
}

export function LandingCard({
  landingPage
}: {
  landingPage: LandingPageListItem;
}) {
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
        to="/landings/$id/studio"
        params={{ id: landingPage.id }}
        className="block"
      >
        {/* ponytail: no thumbnail-serving route exists yet (only html is served from
            storage) — placeholder until `.thumbnail.jpg` objects are served publicly. */}
        <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
          <ImageIcon className="size-8" />
        </div>
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
              to="/landings/$id/studio"
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
