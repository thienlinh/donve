import type { LandingPage } from "@dv/contracts";
import type { PatchOp } from "@dv/studio-core";
import {
  InspectorPanel,
  LayerTreePanel,
  StudioModeProvider,
  useStudioMode,
  useStudioModeHotkeys,
  type CanvasTransform,
  type DrawTool,
  type InspectorValues,
  type LayerNode
} from "@dv/studio-ui";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@dv/ui/components/shadcn/resizable";
import { Skeleton } from "@dv/ui/components/shadcn/skeleton";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import * as React from "react";
import { useDefaultLayout } from "react-resizable-panels";

import { useSession } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import {
  fetchLandingPage,
  fetchVersionHtml,
  generateLandingPage,
  saveManualVersion,
  uploadThumbnail
} from "../api";
import { sendDrawMessage } from "../comments-api";
import { toHtmlFileName } from "../lib/file-name";
import { usePersistentState } from "../lib/use-persistent-state";
import { chatMessageKeys, landingKeys, pageVersionKeys } from "../query-keys";
import {
  Canvas,
  type CommentTarget,
  type DrawControls,
  type ExportControls,
  type ThumbnailControls,
  type ZoomControls
} from "./canvas";
import { ChatPanel } from "./chat-panel";
import { CommentDialog } from "./comment-dialog";
import { StudioTopBar } from "./studio-top-bar";
import { WorkArea, type StudioWorkAreaTab } from "./work-area";

// Bound route hooks, not the standalone `useParams({ from: ... })` form — this file is the
// route's `component`, split out into its own module, so importing the route's own `Route`
// object here would be a circular import; `getRouteApi` is TanStack Router's sanctioned way
// around that (docs: "code splitting a route's component").
const routeApi = getRouteApi("/_authenticated/landings/$id/studio");

const DEFAULT_DRAW_COLOR = "#ef4444";

/** Exact wording from studio-builder-spec.md §7 (screenshot #1) — not localized. */
function drawDefaultPrompt(fileName: string): string {
  return `Apply the marked-up changes to ${fileName}. The attached image shows the current preview with my annotations drawn on top.`;
}

export function StudioPage() {
  const { id } = routeApi.useParams();
  const { prompt } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: landingKeys.detail(id),
    queryFn: () => fetchLandingPage(id)
  });

  // FR-B-21: fires once the pending record's `prompt` search param is available. Stays in the
  // URL until the call actually succeeds (cleared in `onSuccess`) so a failed request — or a
  // page reload mid-flight — can retry with the same prompt; the `firedRef` guard (not just
  // "prompt is present") is what keeps this from double-firing on its own re-renders/refetches.
  const firedRef = React.useRef(false);
  const generateMutation = useMutation({
    mutationFn: (p: string) => generateLandingPage(id, p),
    onSuccess: () => {
      navigate({ search: {}, replace: true });
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
    }
  });
  React.useEffect(() => {
    if (!prompt || firedRef.current) return;
    firedRef.current = true;
    generateMutation.mutate(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot on the `prompt` param, not on mutation identity
  }, [prompt]);

  const htmlKey = detailQuery.data?.currentVersion?.htmlKey ?? null;
  const htmlQuery = useQuery({
    queryKey: landingKeys.html(id, htmlKey ?? ""),
    queryFn: () => fetchVersionHtml(id),
    enabled: htmlKey !== null
  });

  if (detailQuery.isPending || (htmlKey !== null && htmlQuery.isPending)) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Spinner /> Loading studio…
      </div>
    );
  }

  // The prompt bar creates the record and navigates here immediately — `currentVersionId`
  // is null until the generate call above lands the first version (or if it's still running).
  // Show a skeleton canvas rather than treating "no version yet" as a load error.
  if (detailQuery.data && detailQuery.data.currentVersionId === null) {
    return (
      <div className="flex h-full flex-col gap-3 p-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-full flex-1" />
        {generateMutation.isError && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Couldn't generate this page</EmptyTitle>
              <EmptyDescription>
                {generateMutation.error.message}
              </EmptyDescription>
            </EmptyHeader>
            {prompt && (
              <EmptyContent>
                <Button onClick={() => generateMutation.mutate(prompt)}>
                  Retry
                </Button>
              </EmptyContent>
            )}
          </Empty>
        )}
      </div>
    );
  }

  const error = detailQuery.error ?? htmlQuery.error;
  if (
    error ||
    htmlKey === null ||
    htmlQuery.data === undefined ||
    !detailQuery.data
  ) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Couldn't load this landing page</EmptyTitle>
          {error && <EmptyDescription>{error.message}</EmptyDescription>}
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <StudioModeProvider>
      <StudioEditor landingPage={detailQuery.data} html={htmlQuery.data} />
    </StudioModeProvider>
  );
}

function StudioEditor({
  landingPage,
  html
}: {
  landingPage: LandingPage;
  html: string;
}) {
  useStudioModeHotkeys();
  const { mode, setMode } = useStudioMode();
  const { data: session } = useSession();
  const userId = session?.user.id ?? "anon";

  const [chatCollapsed, setChatCollapsed] = usePersistentState(
    `studio:chatCollapsed:${userId}`,
    false
  );
  const [activeTab, setActiveTab] = usePersistentState<StudioWorkAreaTab>(
    `studio:activeTab:${userId}`,
    "page"
  );
  // Panel sizes persist per user, not per landing page (studio-builder-spec.md §3) —
  // the library's own localStorage-backed layout hook does exactly this.
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: `studio-panels:${userId}`,
    storage: localStorage,
    // Without this, a transient layout computed during mount/resize (before
    // the panel group's container has settled to its final width) gets
    // auto-saved as-is — once persisted, every future load restores that
    // same broken size and there's no user-facing way to reset it.
    onlySaveAfterUserInteractions: true
  });

  const [refreshKey, setRefreshKey] = React.useState(0);
  const [zoomPercent, setZoomPercent] = React.useState(100);
  const [layers, setLayers] = React.useState<LayerNode[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  // Draw mode doesn't hit-test hover at all, so a stale hover target from
  // whichever mode was active before would otherwise sit highlighted in the
  // LayerTree indefinitely — clear it the moment drawing starts.
  React.useEffect(() => {
    if (mode === "draw") setHoveredId(null);
  }, [mode]);
  const [commentTarget, setCommentTarget] =
    React.useState<CommentTarget | null>(null);
  const [selectedValues, setSelectedValues] =
    React.useState<InspectorValues | null>(null);
  const commitRef = React.useRef<((op: PatchOp) => void) | null>(null);
  const zoomControlsRef = React.useRef<ZoomControls | null>(null);
  const drawControlsRef = React.useRef<DrawControls | null>(null);
  const thumbnailControlsRef = React.useRef<ThumbnailControls | null>(null);
  const exportControlsRef = React.useRef<ExportControls | null>(null);
  const [drawTool, setDrawTool] = React.useState<DrawTool>("pen");
  const [drawColor, setDrawColor] = React.useState(DEFAULT_DRAW_COLOR);
  const [canUndoDraw, setCanUndoDraw] = React.useState(false);

  const queryClient = useQueryClient();
  const fileName = toHtmlFileName(landingPage.name);
  // Tracks the true current version id across manual saves without touching
  // `landingKeys.detail` (see the no-invalidation note below) — Design Files'
  // version history/"current" badge and restore-availability need this to stay
  // accurate, otherwise every manual save leaves them pointing at a stale version.
  const [currentVersionId, setCurrentVersionId] = React.useState(
    landingPage.currentVersionId
  );
  // Follows `landingPage.currentVersionId` on every *real* refetch (initial
  // mount, restore) — manual saves never trigger one (see above), so this
  // can't clobber the mutation's own update with a stale value in between.
  React.useEffect(() => {
    setCurrentVersionId(landingPage.currentVersionId);
  }, [landingPage.currentVersionId]);

  // studio-builder-spec.md §5: 800ms after the last style/text commit settles, land a new
  // `pageVersions` row (origin="manual"). Canvas debounces and hands over the full HTML +
  // the ops batch; failures are non-blocking (the edit already applied live + to undo stack).
  // Deliberately doesn't invalidate `landingKeys.detail`/`.html` on success: Canvas's live
  // iframe DOM is already the source of truth for the open session, and refetching would
  // swap `htmlKey` under it, forcing a disruptive iframe reload mid-edit for no visible gain.
  // oxlint-disable-next-line react-doctor/query-mutation-missing-invalidation -- see comment above
  // Autosave runs silently 800ms after every edit (no user-initiated save
  // action to give feedback on) — without this, there's no way to tell
  // whether the last change actually landed short of opening Version History.
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const manualSaveMutation = useMutation({
    mutationFn: (input: { html: string; patch: unknown }) =>
      saveManualVersion(landingPage.id, input),
    // FR-B-26: re-capture `.thumbnail.jpg` after every version-creating save. Best-effort —
    // a failed capture/upload doesn't affect the save that already succeeded.
    onSuccess: async (version) => {
      setCurrentVersionId(version.id);
      setLastSavedAt(new Date());
      queryClient.invalidateQueries({
        queryKey: pageVersionKeys.list(landingPage.id)
      });
      const blob = await thumbnailControlsRef.current?.capture();
      if (blob) await uploadThumbnail(landingPage.id, blob);
    }
  });
  // FR-B-22/23: the AI patch already validated + persisted server-side (studio/routes.ts's
  // apply_patch tool call) — the client just mirrors it onto the live canvas via the exact
  // same `commitRef.current(op)` path Inspector/LayerTree use (real undo stack, no second
  // write path). This does leave the existing 800ms debounce free to land one more redundant
  // "manual" pageVersion right on top a moment later — ponytail: acceptable duplication,
  // skip a "was this AI-applied" flag on Canvas unless that redundancy proves costly.
  const handleApplyAiPatch = React.useCallback((ops: PatchOp[]) => {
    for (const op of ops) commitRef.current?.(op);
  }, []);

  // apply_full_html replaced the whole document server-side — refetch so `html`/`htmlKey`
  // pick up the new version (there's no incremental DOM patch for a full-document swap).
  const handleFullHtmlApplied = React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: landingKeys.detail(landingPage.id)
    });
  }, [queryClient, landingPage.id]);

  const sendDrawMutation = useMutation({
    mutationFn: async (text: string) => {
      const imageDataUrl = await drawControlsRef.current?.composite();
      if (!imageDataUrl) throw new Error("draw_composite_failed");
      return sendDrawMessage({
        landingPageId: landingPage.id,
        text: text || drawDefaultPrompt(fileName),
        imageDataUrl
      });
    },
    onSuccess: () => {
      drawControlsRef.current?.clear();
      queryClient.invalidateQueries({
        queryKey: chatMessageKeys.list(landingPage.id)
      });
    }
  });

  // "select" has no dedicated hotkey — picking an element while in "view" enters it
  // (studio-builder-spec.md §10).
  function handleSelect(id: string) {
    setSelectedId(id);
    if (mode === "view") setMode("select");
  }

  // Esc, or a confirmed Delete (studio-builder-spec.md §10).
  function handleDeselect() {
    setSelectedId(null);
    if (mode === "select") setMode("view");
  }

  function handleTransformChange(transform: CanvasTransform) {
    setZoomPercent(Math.round(transform.scale * 100));
  }

  const canvasArea = (
    <div className="grid h-full grid-cols-[240px_1fr_280px]">
      <div className="border-r">
        <LayerTreePanel
          layers={layers}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={handleSelect}
          onHoverChange={setHoveredId}
          onToggleVisibility={(srcmapId, hidden) =>
            commitRef.current?.({ type: "toggleVisibility", srcmapId, hidden })
          }
          onRename={(srcmapId, name) =>
            commitRef.current?.({ type: "renameLayer", srcmapId, name })
          }
          onReorder={(srcmapId, beforeSrcmapId) =>
            commitRef.current?.({
              type: "moveBefore",
              srcmapId,
              beforeSrcmapId
            })
          }
          footer={m.studioLayersFooterHint()}
        />
      </div>

      <Canvas
        key={refreshKey}
        html={html}
        mode={mode}
        selectedId={selectedId}
        hoveredId={hoveredId}
        drawTool={drawTool}
        drawColor={drawColor}
        onSelect={handleSelect}
        onHover={setHoveredId}
        onLayersChange={setLayers}
        onSelectedValuesChange={setSelectedValues}
        onCommitReady={(commit) => {
          commitRef.current = commit;
        }}
        onTransformChange={handleTransformChange}
        onZoomControlsReady={(controls) => {
          zoomControlsRef.current = controls;
        }}
        onDeselect={handleDeselect}
        onCommentTarget={setCommentTarget}
        onDrawControlsReady={(controls) => {
          drawControlsRef.current = controls;
        }}
        onDrawCanUndoChange={setCanUndoDraw}
        onManualSave={(input) => manualSaveMutation.mutateAsync(input)}
        onThumbnailControlsReady={(controls) => {
          thumbnailControlsRef.current = controls;
        }}
        onExportControlsReady={(controls) => {
          exportControlsRef.current = controls;
        }}
      />

      {mode === "edit" && selectedId && selectedValues && (
        <div className="border-l">
          <InspectorPanel
            key={selectedId}
            values={selectedValues}
            onCommit={(prop, value) => {
              commitRef.current?.({
                type: "setStyle",
                srcmapId: selectedId,
                prop,
                value: value === null ? null : String(value)
              });
            }}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>
  );

  const workArea = (
    <WorkArea
      fileName={fileName}
      landingPageId={landingPage.id}
      currentVersionId={currentVersionId}
      layers={layers}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      zoomPercent={zoomPercent}
      onZoomIn={() => zoomControlsRef.current?.zoomIn()}
      onZoomOut={() => zoomControlsRef.current?.zoomOut()}
      onRefresh={() => setRefreshKey((k) => k + 1)}
      drawTool={drawTool}
      onDrawToolChange={setDrawTool}
      drawColor={drawColor}
      onDrawColorChange={setDrawColor}
      canUndoDraw={canUndoDraw}
      onUndoDraw={() => drawControlsRef.current?.undo()}
      onClearDraw={() => {
        drawControlsRef.current?.clear();
        setCanUndoDraw(false);
      }}
      drawDefaultPrompt={drawDefaultPrompt(fileName)}
      onSendDraw={(text) => sendDrawMutation.mutate(text)}
      sendingDraw={sendDrawMutation.isPending}
      saving={manualSaveMutation.isPending}
      lastSavedAt={lastSavedAt}
    >
      {canvasArea}
    </WorkArea>
  );

  return (
    <div className="flex h-full flex-col">
      <StudioTopBar
        landingPage={landingPage}
        html={html}
        onCapturePng={async () =>
          (await exportControlsRef.current?.capturePng()) ?? null
        }
        chatCollapsed={chatCollapsed}
        onToggleChat={() => setChatCollapsed((v) => !v)}
      />
      <div className="min-h-0 flex-1">
        {chatCollapsed ? (
          workArea
        ) : (
          <ResizablePanelGroup
            id={`studio-panels:${userId}`}
            defaultLayout={defaultLayout}
            onLayoutChanged={onLayoutChanged}
          >
            <ResizablePanel
              id="chat"
              defaultSize="22"
              minSize="20"
              maxSize="45"
            >
              <ChatPanel
                landingPageId={landingPage.id}
                onApplyPatch={handleApplyAiPatch}
                onFullHtmlApplied={handleFullHtmlApplied}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="work-area" defaultSize="78">
              {workArea}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
      <CommentDialog
        target={commentTarget}
        landingPageId={landingPage.id}
        onOpenChange={(open) => {
          if (!open) setCommentTarget(null);
        }}
      />
    </div>
  );
}
