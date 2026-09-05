import type { NativePageDocument, PageVersion } from "@dv/contracts";
import { CodeBlockContainer } from "@dv/ui/components/ai-elements/code-block";
import { Badge } from "@dv/ui/components/shadcn/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { ScrollArea } from "@dv/ui/components/shadcn/scroll-area";
import { cn } from "@dv/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { fetchVersionSpec } from "../../studio/api";
import { pageVersionKeys } from "../../studio/query-keys";
import { diffPageSpecElements, type ElementDiff } from "../lib/spec-diff";

const STATUS_LABEL: Record<ElementDiff["status"], string> = {
  added: "Thêm mới",
  removed: "Đã xoá",
  changed: "Đã sửa"
};

const STATUS_CLASS: Record<ElementDiff["status"], string> = {
  added: "bg-emerald-500/15 text-emerald-700",
  removed: "bg-red-500/15 text-red-700",
  changed: "bg-amber-500/15 text-amber-700"
};

/** Studio Native version diff — structural (PageSpec elements), not the legacy HTML line diff.
 * No iframe preview here: a native version has no rendered HTML to preview outside publish. */
export function VersionDiffDialog({
  landingPageId,
  versions,
  onOpenChange
}: {
  landingPageId: string;
  /** Exactly 2 versions, oldest first — null closes the dialog. */
  versions: [PageVersion, PageVersion] | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={versions !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[min(95vw,1000px)] max-w-none flex-col sm:max-w-none">
        {versions && (
          <VersionDiffBody landingPageId={landingPageId} versions={versions} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function VersionDiffBody({
  landingPageId,
  versions
}: {
  landingPageId: string;
  versions: [PageVersion, PageVersion];
}) {
  const [before, after] = versions;
  const beforeVersion = useQuery({
    queryKey: pageVersionKeys.detail(landingPageId, before.id),
    queryFn: () => fetchVersionSpec(landingPageId, before.id)
  });
  const afterVersion = useQuery({
    queryKey: pageVersionKeys.detail(landingPageId, after.id),
    queryFn: () => fetchVersionSpec(landingPageId, after.id)
  });

  const diffs = React.useMemo(() => {
    const beforeDoc = beforeVersion.data?.spec as
      | NativePageDocument
      | undefined;
    const afterDoc = afterVersion.data?.spec as NativePageDocument | undefined;
    if (!beforeDoc?.pageSpec || !afterDoc?.pageSpec) return null;
    return diffPageSpecElements(
      beforeDoc.pageSpec.elements,
      afterDoc.pageSpec.elements
    );
  }, [beforeVersion.data, afterVersion.data]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          So sánh phiên bản — v{before.seq} → v{after.seq}
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="min-h-0 flex-1 rounded border">
        <div className="flex flex-col gap-2 p-3">
          {diffs === null ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : diffs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Không có thay đổi nào giữa 2 phiên bản này.
            </p>
          ) : (
            diffs.map((diff) => <ElementDiffRow key={diff.id} diff={diff} />)
          )}
        </div>
      </ScrollArea>
    </>
  );
}

function ElementDiffRow({ diff }: { diff: ElementDiff }) {
  const [expanded, setExpanded] = React.useState(false);
  const element = diff.status === "removed" ? diff.before : diff.after;
  const label =
    typeof element.props.title === "string"
      ? element.props.title
      : typeof element.props.headline === "string"
        ? element.props.headline
        : null;

  return (
    <div className="rounded-md border">
      <button
        type="button"
        disabled={diff.status !== "changed"}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 p-2 text-left text-sm enabled:hover:bg-muted disabled:cursor-default"
      >
        <Badge className={cn("shrink-0", STATUS_CLASS[diff.status])}>
          {STATUS_LABEL[diff.status]}
        </Badge>
        <span className="min-w-0 flex-1 truncate">
          <span className="font-medium">{element.type}</span>
          {label && <span className="text-muted-foreground"> — {label}</span>}
        </span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {diff.id}
        </span>
      </button>
      {diff.status === "changed" && expanded && (
        <div className="flex flex-col gap-2 border-t p-2">
          {diff.props.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Chỉ thay đổi cấu trúc con (children), không có props nào khác.
            </p>
          ) : (
            diff.props.map((prop) => (
              <div key={prop.key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {prop.key}
                </span>
                <ScrollArea className="max-h-48 rounded border">
                  <CodeBlockContainer language="json">
                    <div className="p-2 font-mono text-xs">
                      {prop.lines.map((line) => (
                        <div
                          key={line.key}
                          className={cn(
                            "whitespace-pre-wrap",
                            line.type === "add" && "bg-emerald-500/15",
                            line.type === "remove" && "bg-red-500/15"
                          )}
                        >
                          {line.type === "add"
                            ? "+ "
                            : line.type === "remove"
                              ? "- "
                              : "  "}
                          {line.text}
                        </div>
                      ))}
                    </div>
                  </CodeBlockContainer>
                </ScrollArea>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
