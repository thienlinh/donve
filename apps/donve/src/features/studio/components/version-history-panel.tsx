import type { PageVersion, PageVersionOrigin } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@dv/ui/components/shadcn/popover";
import { ScrollArea } from "@dv/ui/components/shadcn/scroll-area";
import { toast } from "@dv/ui/components/shadcn/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@dv/ui/components/shadcn/tooltip";
import { cn } from "@dv/ui/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, RotateCcw, Tag } from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import { fetchVersions, restoreVersion, setVersionLabel } from "../api";
import { formatRelativeTime } from "../lib/relative-time";
import { landingKeys, pageVersionKeys } from "../query-keys";
import { VersionDiffDialog } from "./version-diff-dialog";

const ORIGIN_LABEL: Record<PageVersionOrigin, () => string> = {
  manual: m.studioVersionOriginManual,
  import: m.studioVersionOriginImport,
  restore: m.studioVersionOriginRestore,
  ai_patch: m.studioVersionOriginAiPatch,
  ai_full: m.studioVersionOriginAiFull
};

export function VersionHistoryPanel({
  landingPageId,
  currentVersionId,
  highlightVersionId,
  onHighlightVersionIdHandled,
  onViewChat
}: {
  landingPageId: string;
  currentVersionId: string | null;
  /** Chat's "view this version" link (studio-page.tsx's cross-panel state) — scrolled to and
   * briefly highlighted, then cleared via `onHighlightVersionIdHandled`. */
  highlightVersionId?: string | null;
  onHighlightVersionIdHandled?: () => void;
  /** Jumps the chat panel to the message that produced a version (`version.chatMessageId`). */
  onViewChat?: (chatMessageId: string) => void;
}) {
  const queryClient = useQueryClient();
  const [selectedForDiff, setSelectedForDiff] = React.useState<Set<string>>(
    new Set()
  );
  const [diffPair, setDiffPair] = React.useState<
    [PageVersion, PageVersion] | null
  >(null);

  const versionsQuery = useQuery({
    queryKey: pageVersionKeys.list(landingPageId),
    queryFn: () => fetchVersions(landingPageId)
  });

  // ponytail: re-capturing `.thumbnail.jpg` on restore needs the live Canvas iframe, which
  // this panel doesn't have access to — only the manual-save path (studio-page.tsx) re-captures
  // for now. Wire restore's capture through once Canvas reloads on `currentVersionId` change.
  const restoreMutation = useMutation({
    mutationFn: (versionId: string) => restoreVersion(landingPageId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: pageVersionKeys.list(landingPageId)
      });
      queryClient.invalidateQueries({
        queryKey: landingKeys.detail(landingPageId)
      });
    },
    onError: () =>
      toast.add({ title: m.studioVersionRestoreErrorToast(), type: "error" })
  });

  const versions = versionsQuery.data ?? [];
  const canCompare = selectedForDiff.size === 2;

  // Chat's "view this version" link — same rAF + one-shot-prop-clear pattern as chat-panel's
  // `scrollToMessageId` (the row needs to be painted before `scrollIntoView` can find it).
  React.useEffect(() => {
    if (!highlightVersionId) return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(`version-row-${highlightVersionId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    const timer = window.setTimeout(
      () => onHighlightVersionIdHandled?.(),
      2000
    );
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [highlightVersionId, onHighlightVersionIdHandled]);

  function toggleSelected(id: string) {
    setSelectedForDiff((prev) => {
      if (prev.has(id)) return new Set([...prev].filter((v) => v !== id));
      // Cap at 2 selections — drop the oldest once a third is picked.
      const kept = prev.size >= 2 ? [...prev].slice(1) : [...prev];
      return new Set([...kept, id]);
    });
  }

  function openCompare() {
    const [a, b] = [...selectedForDiff]
      .map((id) => versions.find((v) => v.id === id))
      .filter((v): v is PageVersion => v !== undefined)
      .toSorted((x, y) => x.seq - y.seq);
    if (a && b) setDiffPair([a, b]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">
          {m.studioVersionHistoryTitle()}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canCompare}
          onClick={openCompare}
        >
          {m.studioVersionCompareButton()}
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2">
          {versions.length === 0 ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              {m.studioVersionHistoryEmpty()}
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {versions.map((version) => (
                <VersionRow
                  key={version.id}
                  version={version}
                  isCurrent={version.id === currentVersionId}
                  checked={selectedForDiff.has(version.id)}
                  onToggle={() => toggleSelected(version.id)}
                  onRestore={() => restoreMutation.mutate(version.id)}
                  restoring={
                    restoreMutation.isPending &&
                    restoreMutation.variables === version.id
                  }
                  landingPageId={landingPageId}
                  highlighted={version.id === highlightVersionId}
                  onViewChat={onViewChat}
                />
              ))}
            </ul>
          )}
        </div>
      </ScrollArea>

      <VersionDiffDialog
        landingPageId={landingPageId}
        versions={diffPair}
        onOpenChange={(open) => {
          if (!open) setDiffPair(null);
        }}
      />
    </div>
  );
}

function VersionRow({
  version,
  isCurrent,
  checked,
  onToggle,
  onRestore,
  restoring,
  landingPageId,
  highlighted,
  onViewChat
}: {
  version: PageVersion;
  isCurrent: boolean;
  checked: boolean;
  onToggle: () => void;
  onRestore: () => void;
  restoring: boolean;
  landingPageId: string;
  highlighted: boolean;
  onViewChat?: (chatMessageId: string) => void;
}) {
  const queryClient = useQueryClient();
  const [labelDraft, setLabelDraft] = React.useState(version.label ?? "");
  const [labelOpen, setLabelOpen] = React.useState(false);

  const labelMutation = useMutation({
    mutationFn: (label: string | null) =>
      setVersionLabel(landingPageId, version.id, label),
    onSuccess: () => {
      setLabelOpen(false);
      queryClient.invalidateQueries({
        queryKey: pageVersionKeys.list(landingPageId)
      });
    },
    onError: () =>
      toast.add({ title: m.studioVersionLabelErrorToast(), type: "error" })
  });

  return (
    <li
      id={`version-row-${version.id}`}
      className={cn(
        "flex items-start gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted",
        highlighted && "bg-accent ring-1 ring-primary"
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">v{version.seq}</span>
          {isCurrent && (
            <Badge className="px-1.5 py-0 text-xs">
              {m.studioVersionCurrentBadge()}
            </Badge>
          )}
          <span className="ms-auto shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(version.createdAt)}
          </span>
        </div>
        <div className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <span className="shrink-0">{ORIGIN_LABEL[version.origin]()}</span>
          {version.label && (
            <span className="min-w-0 truncate">· {version.label}</span>
          )}
        </div>
        {version.chatMessageId && onViewChat && (
          <button
            type="button"
            className="mt-0.5 flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline"
            onClick={() => onViewChat(version.chatMessageId!)}
          >
            <MessageSquare className="size-3" />
            {m.studioVersionViewChatButton()}
          </button>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Popover open={labelOpen} onOpenChange={setLabelOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.studioVersionLabelButton()}
              />
            }
          >
            <Tag className="size-3.5" />
          </PopoverTrigger>
          <PopoverContent align="end" className="flex w-64 gap-2">
            <Input
              value={labelDraft}
              placeholder={m.studioVersionLabelPlaceholder()}
              onChange={(e) => setLabelDraft(e.target.value)}
            />
            <Button
              size="sm"
              disabled={labelMutation.isPending}
              onClick={() => labelMutation.mutate(labelDraft.trim() || null)}
            >
              {m.studioVersionLabelSave()}
            </Button>
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.studioVersionRestoreButton()}
                disabled={isCurrent || restoring}
                onClick={onRestore}
              >
                <RotateCcw className="size-3.5" />
              </Button>
            }
          />
          <TooltipContent>{m.studioVersionRestoreButton()}</TooltipContent>
        </Tooltip>
      </div>
    </li>
  );
}
