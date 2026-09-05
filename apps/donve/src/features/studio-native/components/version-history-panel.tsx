import type { PageVersion, PageVersionOrigin } from "@dv/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@dv/ui/components/shadcn/alert-dialog";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { ScrollArea } from "@dv/ui/components/shadcn/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import { fetchVersions, restoreVersion } from "../../studio/api";
import { formatRelativeTime } from "../../studio/lib/relative-time";
import { landingKeys, pageVersionKeys } from "../../studio/query-keys";
import { VersionDiffDialog } from "./version-diff-dialog";

const ORIGIN_LABEL: Record<PageVersionOrigin, () => string> = {
  manual: m.studioVersionOriginManual,
  import: m.studioVersionOriginImport,
  restore: m.studioVersionOriginRestore,
  ai_patch: m.studioVersionOriginAiPatch,
  ai_full: m.studioVersionOriginAiFull
};

/** Studio Native's version history — same Sheet-panel pattern as QualityPanel/SeoPanel, not a
 * Puck plugin tab. Reuses the legacy editor's `fetchVersions`/`restoreVersion` (format-agnostic)
 * but pairs them with the native-specific structural diff dialog instead of the HTML one. */
export function VersionHistoryPanel({
  open,
  onOpenChange,
  landingPageId,
  currentVersionId,
  onRestored
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: string;
  currentVersionId: string | null;
  /** Restore lands a new server version — the caller's in-memory edit buffer, if any, is now
   * stale (same reason `QualityPanel`'s Auto Fixer needs `onAutoFixApplied`). */
  onRestored: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedForDiff, setSelectedForDiff] = React.useState<Set<string>>(
    new Set()
  );
  const [diffPair, setDiffPair] = React.useState<
    [PageVersion, PageVersion] | null
  >(null);
  const [restoreTarget, setRestoreTarget] = React.useState<PageVersion | null>(
    null
  );

  const versionsQuery = useQuery({
    queryKey: pageVersionKeys.list(landingPageId),
    queryFn: () => fetchVersions(landingPageId),
    enabled: open
  });

  const restoreMutation = useMutation({
    mutationFn: (versionId: string) => restoreVersion(landingPageId, versionId),
    onSuccess: () => {
      setRestoreTarget(null);
      queryClient.invalidateQueries({
        queryKey: pageVersionKeys.list(landingPageId)
      });
      queryClient.invalidateQueries({
        queryKey: landingKeys.detail(landingPageId)
      });
      onRestored();
    },
    onError: () =>
      toast.add({ title: m.studioVersionRestoreErrorToast(), type: "error" })
  });

  const versions = versionsQuery.data ?? [];
  const canCompare = selectedForDiff.size === 2;

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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="flex-row items-center justify-between space-y-0 pr-10">
            <SheetTitle>{m.studioVersionHistoryTitle()}</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              disabled={!canCompare}
              onClick={openCompare}
            >
              {m.studioVersionCompareButton()}
            </Button>
          </SheetHeader>
          <ScrollArea className="flex-1 px-4 pb-4">
            {versions.length === 0 ? (
              <p className="py-2 text-xs text-muted-foreground">
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
                    onRestore={() => setRestoreTarget(version)}
                    restoring={
                      restoreMutation.isPending &&
                      restoreMutation.variables === version.id
                    }
                  />
                ))}
              </ul>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <VersionDiffDialog
        landingPageId={landingPageId}
        versions={diffPair}
        onOpenChange={(open) => {
          if (!open) setDiffPair(null);
        }}
      />

      <AlertDialog
        open={restoreTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {m.studioVersionRestoreButton()}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Trang sẽ được khôi phục về nội dung của v{restoreTarget?.seq}.
              Thao tác này lưu thành một phiên bản mới — lịch sử hiện tại vẫn
              được giữ lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              disabled={restoreMutation.isPending}
              onClick={() =>
                restoreTarget && restoreMutation.mutate(restoreTarget.id)
              }
            >
              {m.studioVersionRestoreButton()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function VersionRow({
  version,
  isCurrent,
  checked,
  onToggle,
  onRestore,
  restoring
}: {
  version: PageVersion;
  isCurrent: boolean;
  checked: boolean;
  onToggle: () => void;
  onRestore: () => void;
  restoring: boolean;
}) {
  return (
    <li className="flex items-start gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
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
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={m.studioVersionRestoreButton()}
        disabled={isCurrent || restoring}
        onClick={onRestore}
      >
        <RotateCcw className="size-3.5" />
      </Button>
    </li>
  );
}
