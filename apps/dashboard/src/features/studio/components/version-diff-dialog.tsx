import type { PageVersion } from "@dv/contracts";
import { CodeBlockContainer } from "@dv/ui/components/ai-elements/code-block";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { ScrollArea } from "@dv/ui/components/shadcn/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import { cn } from "@dv/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import { fetchVersionHtmlById } from "../api";
import { diffLines } from "../lib/diff-lines";
import { pageVersionKeys } from "../query-keys";

/** FR-B-27 — 2 iframe previews side by side + a line-level HTML diff, no new diff lib. */
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
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[min(95vw,1400px)] max-w-none flex-col sm:max-w-none">
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
  const beforeHtml = useQuery({
    queryKey: pageVersionKeys.html(landingPageId, before.id),
    queryFn: () => fetchVersionHtmlById(landingPageId, before.id)
  });
  const afterHtml = useQuery({
    queryKey: pageVersionKeys.html(landingPageId, after.id),
    queryFn: () => fetchVersionHtmlById(landingPageId, after.id)
  });

  const lines = React.useMemo(() => {
    if (!beforeHtml.data || !afterHtml.data) return null;
    return diffLines(beforeHtml.data, afterHtml.data);
  }, [beforeHtml.data, afterHtml.data]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {m.studioVersionDiffTitle()} — v{before.seq} → v{after.seq}
        </DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="preview" className="flex min-h-0 flex-1 flex-col">
        <TabsList variant="line" className="shrink-0">
          <TabsTrigger value="preview">
            {m.studioVersionDiffPreviewTab()}
          </TabsTrigger>
          <TabsTrigger value="code">{m.studioVersionDiffCodeTab()}</TabsTrigger>
        </TabsList>
        <TabsContent
          value="preview"
          className="grid min-h-0 flex-1 grid-cols-2 gap-2 pt-2"
        >
          <iframe
            title={`v${before.seq}`}
            srcDoc={beforeHtml.data ?? ""}
            sandbox=""
            className="h-full w-full rounded border bg-white"
          />
          <iframe
            title={`v${after.seq}`}
            srcDoc={afterHtml.data ?? ""}
            sandbox=""
            className="h-full w-full rounded border bg-white"
          />
        </TabsContent>
        <TabsContent value="code" className="min-h-0 flex-1 pt-2">
          <ScrollArea className="h-full rounded border">
            <CodeBlockContainer language="html">
              <div className="p-2 font-mono text-sm">
                {lines?.map((line) => (
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
        </TabsContent>
      </Tabs>
    </>
  );
}
