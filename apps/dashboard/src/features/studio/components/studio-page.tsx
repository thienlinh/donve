import type { LandingPage } from "@dv/contracts";
import type { PatchOp } from "@dv/studio-core";
import {
  InspectorPanel,
  LAYER_TREE_VIRTUALIZE_THRESHOLD,
  LayerTreePanel,
  StudioModeProvider,
  useStudioMode,
  useStudioModeHotkeys,
  type CanvasTransform,
  type DrawTool,
  type InspectorValues,
  type LayerNode
} from "@dv/studio-ui";
import { Shimmer } from "@dv/ui/components/ai-elements/shimmer";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle
} from "@dv/ui/components/shadcn/alert";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMediaQuery } from "@dv/ui/hooks/use-media-query";
import { cn } from "@dv/ui/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import * as React from "react";
import { useDefaultLayout, usePanelRef } from "react-resizable-panels";

import { ConnectAiDialog } from "@/features/ai-connections/components/connect-ai-dialog";
import { useSession } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import {
  fetchLandingPage,
  fetchVersionHtml,
  generateLandingPageStream,
  saveManualVersion,
  uploadThumbnail
} from "../api";
import { sendDrawMessage } from "../comments-api";
import { toHtmlFileName } from "../lib/file-name";
import { usePersistentState } from "../lib/use-persistent-state";
import { chatMessageKeys, landingKeys, pageVersionKeys } from "../query-keys";
import {
  Canvas,
  type CommentScreenshotControls,
  type CommentTarget,
  type DrawControls,
  type ExportControls,
  type SaveControls,
  type ThumbnailControls,
  type ZoomControls
} from "./canvas";
import { ChatPanel } from "./chat-panel";
import { CommentDialog } from "./comment-dialog";
import { DesignFilesPanel } from "./design-files-panel";
import { StudioTopBar } from "./studio-top-bar";
import { VersionHistoryPanel } from "./version-history-panel";
import { WorkArea } from "./work-area";

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

/**
 * Generate errors are `ApiError.code`s by default (`err.message` falls back to `code` when no
 * message is set — see apps/api/src/lib/errors.ts), so these three known codes surface as raw
 * snake_case strings unless mapped here. Anything else (a real 500, a network failure) falls
 * through to the generic title/raw message the caller already renders.
 */
function generateErrorCopy(
  message: string
): { title: string; description: string; action: React.ReactNode } | null {
  switch (message) {
    case "no_ai_connection":
      return {
        title: m.studioGenerateErrorNoAiConnectionTitle(),
        description: m.studioGenerateErrorNoAiConnectionDescription(),
        action: <ConnectAiDialog />
      };
    case "trial_exhausted":
      return {
        title: m.studioGenerateErrorTrialExhaustedTitle(),
        description: m.studioGenerateErrorTrialExhaustedDescription(),
        action: <ConnectAiDialog />
      };
    case "insufficient_credits":
      return {
        title: m.studioGenerateErrorInsufficientCreditsTitle(),
        description: m.studioGenerateErrorInsufficientCreditsDescription(),
        action: (
          <Button nativeButton={false} render={<Link to="/ai-connections" />}>
            {m.studioGenerateErrorBuyCreditsButton()}
          </Button>
        )
      };
    default:
      return null;
  }
}

export function StudioPage() {
  const { id } = routeApi.useParams();
  const { prompt, missingLeadForm, missingSeoMeta } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  // FR-B-31: one-shot, same idea as `prompt` above — cleared from the URL once the wizard
  // banner is dismissed or actioned, so a reload doesn't keep re-offering it forever.
  const funnelGaps =
    missingLeadForm || missingSeoMeta
      ? { missingLeadForm: !!missingLeadForm, missingSeoMeta: !!missingSeoMeta }
      : null;
  const clearFunnelGaps = () =>
    navigate({
      search: (prev) => ({
        ...prev,
        missingLeadForm: undefined,
        missingSeoMeta: undefined
      }),
      replace: true
    });
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
  // `generateMutation.isError`/`.isPending`/`.error` come from react-query's own mutation
  // observer, which in practice was observed to stop notifying this component of state changes
  // after the mutate() call fired from inside the one-shot effect below (page was stuck on the
  // skeleton forever on a failed generation, with zero feedback — the observer's onSuccess/
  // onError options still fire correctly, only the reactive `.isPending`/`.isError` reads on
  // the object returned by subsequent renders never updated). Mirroring both into plain React
  // state sidesteps that: a normal setState always triggers a re-render of the owning component.
  const [generateError, setGenerateError] = React.useState<Error | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  // Live progress while a generate is in flight — a full generate can take minutes on a slow
  // BYOK model, and the non-streaming call this replaced gave zero feedback for that whole
  // time. Character count rather than the actual streamed HTML: mid-stream markup is invalid/
  // unparseable most of the time, not safe to render into the canvas as it arrives.
  const [generatedChars, setGeneratedChars] = React.useState(0);
  const generateMutation = useMutation({
    mutationFn: (p: string) =>
      generateLandingPageStream(id, p, (delta) => {
        setGeneratedChars((chars) => chars + delta.length);
      }),
    onSuccess: () => {
      setIsGenerating(false);
      setGenerateError(null);
      navigate({ search: {}, replace: true });
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
    },
    onError: (err: Error) => {
      setIsGenerating(false);
      setGenerateError(err);
    }
  });
  const runGenerate = (p: string) => {
    setIsGenerating(true);
    setGenerateError(null);
    setGeneratedChars(0);
    generateMutation.mutate(p);
  };
  React.useEffect(() => {
    if (!prompt || firedRef.current) return;
    firedRef.current = true;
    runGenerate(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot on the `prompt` param, not on mutation identity
  }, [prompt]);

  const htmlKey = detailQuery.data?.currentVersion?.htmlKey ?? null;
  const htmlQuery = useQuery({
    queryKey: landingKeys.html(id, htmlKey ?? ""),
    queryFn: () => fetchVersionHtml(id),
    enabled: htmlKey !== null
  });

  // Before there's even a landing page name to show, there's nothing worth building the studio
  // chrome around yet — this is the one case that stays a bare spinner.
  if (detailQuery.isPending) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
        <Spinner /> Loading studio…
      </div>
    );
  }

  if (!detailQuery.data) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Couldn't load this landing page</EmptyTitle>
          {detailQuery.error && (
            <EmptyDescription>{detailQuery.error.message}</EmptyDescription>
          )}
        </EmptyHeader>
      </Empty>
    );
  }
  const landingPage = detailQuery.data;

  // Everything past this point has a real landing page to show — the studio chrome (top bar,
  // chat, work-area tabs) mounts via StudioEditor regardless of what's happened to the actual
  // content yet, with only the canvas slot swapping to reflect it. Previously each of these
  // cases replaced the entire page with an unrelated standalone screen — jarring, and it threw
  // away the chrome (page name, back button) a stuck/failed generation still needs.

  // The prompt bar creates the record and navigates here immediately — `currentVersionId`
  // is null until the generate call above lands the first version (or if it's still running).
  if (landingPage.currentVersionId === null) {
    let placeholder: React.ReactNode;
    if (generateError) {
      const knownError = generateErrorCopy(generateError.message);
      placeholder = (
        <div className="flex h-full flex-col items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>
                {knownError?.title ?? "Couldn't generate this page"}
              </EmptyTitle>
              <EmptyDescription>
                {knownError?.description ?? generateError.message}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex flex-row gap-2">
              {knownError?.action}
              {prompt && (
                <Button
                  variant={knownError ? "outline" : "default"}
                  disabled={isGenerating}
                  onClick={() => runGenerate(prompt)}
                >
                  Retry
                </Button>
              )}
            </EmptyContent>
          </Empty>
        </div>
      );
    } else if (!prompt) {
      // No `prompt` search param means this render can't attempt (or retry) a generation at
      // all — either the page was reloaded/revisited after the param was already stripped, or
      // generation genuinely never ran. An indefinite "generating" placeholder here would look
      // like it's working forever with no way out; show an honest empty state with a way back
      // to the landings list (there's no original prompt to auto-retry with) instead.
      placeholder = (
        <div className="flex h-full flex-col items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>This page hasn't been generated yet</EmptyTitle>
              <EmptyDescription>
                Its content couldn't be created and there's no pending request
                to retry. Try creating it again from the landing pages list.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/landings" })}
              >
                Back to landing pages
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      );
    } else {
      placeholder = <GeneratingPlaceholder generatedChars={generatedChars} />;
    }
    return (
      <StudioModeProvider>
        <StudioEditor
          landingPage={landingPage}
          html={null}
          canvasPlaceholder={placeholder}
        />
      </StudioModeProvider>
    );
  }

  // Has a version — still fetching or failed to fetch its HTML.
  if (htmlQuery.isPending) {
    return (
      <StudioModeProvider>
        <StudioEditor
          landingPage={landingPage}
          html={null}
          canvasPlaceholder={
            <div className="flex h-full items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
              <Spinner /> Loading page…
            </div>
          }
        />
      </StudioModeProvider>
    );
  }
  if (htmlQuery.error || htmlQuery.data === undefined) {
    return (
      <StudioModeProvider>
        <StudioEditor
          landingPage={landingPage}
          html={null}
          canvasPlaceholder={
            <div className="flex h-full flex-col items-center justify-center p-6">
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Couldn't load this landing page</EmptyTitle>
                  {htmlQuery.error && (
                    <EmptyDescription>
                      {htmlQuery.error.message}
                    </EmptyDescription>
                  )}
                </EmptyHeader>
              </Empty>
            </div>
          }
        />
      </StudioModeProvider>
    );
  }

  return (
    <StudioModeProvider>
      <StudioEditor
        landingPage={landingPage}
        html={htmlQuery.data}
        funnelGaps={funnelGaps}
        onFunnelGapsHandled={clearFunnelGaps}
      />
    </StudioModeProvider>
  );
}

/** Default canvas-area content while there's no HTML to show yet (still generating). Callers
 * pass `canvasPlaceholder` to show something else in the same slot — a generation error with a
 * retry button, or an empty state — without duplicating the surrounding studio chrome. */
function GeneratingPlaceholder({ generatedChars }: { generatedChars: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      <Shimmer className="text-sm font-medium" duration={1.5}>
        {generatedChars > 0
          ? `Generating your page… ${generatedChars.toLocaleString()} characters so far`
          : "Generating your page… this can take a minute or two"}
      </Shimmer>
      <Skeleton className="h-8 w-full max-w-md" />
      <Skeleton className="h-40 w-full max-w-md" />
    </div>
  );
}

function StudioEditor({
  landingPage,
  html,
  canvasPlaceholder,
  funnelGaps = null,
  onFunnelGapsHandled
}: {
  landingPage: LandingPage;
  /** null while the page's first version is still generating (or failed/was never generated) —
   * the studio chrome (top bar, chat, work-area tabs) stays mounted regardless, only the canvas
   * itself swaps for `canvasPlaceholder`. */
  html: string | null;
  canvasPlaceholder?: React.ReactNode;
  /** FR-B-31 — set only right after an import that's missing the standard lead form and/or
   * SEO meta; drives the "chuẩn hoá phễu" banner below. */
  funnelGaps?: { missingLeadForm: boolean; missingSeoMeta: boolean } | null;
  onFunnelGapsHandled?: () => void;
}) {
  useStudioModeHotkeys();
  const { mode, setMode } = useStudioMode();
  const { data: session } = useSession();
  const userId = session?.user.id ?? "anon";
  // Below `lg` (matches the sidebar's `max-lg:`/`lg:` overlay classes), the canvas can't afford
  // to lose a fixed slice of width to either chat or the Layers/Inspect sidebar — both float
  // over the canvas as dismissible overlays instead of splitting it.
  const isDesktopLayout = useMediaQuery("(min-width: 1024px)");

  const [chatCollapsed, setChatCollapsed] = usePersistentState(
    `studio:chatCollapsed:${userId}`,
    false
  );
  // Collapsing through the panel library's own `collapsedSize`/`collapsible` API (rather than
  // unmounting the split) is what makes hide/show animatable — a CSS transition on a mount/
  // unmount swap has nothing to transition between.
  const chatPanelRef = usePanelRef();
  // Fixed-width wrapper around `<ChatPanel>` (rendered inside an `overflow-hidden` box below) —
  // this is what makes the collapse/expand a clean slide instead of the chat's text reflowing
  // through every intermediate width the panel passes through mid-transition. Frozen at the
  // panel's current pixel width for the transition window, then released back to `w-full` so it
  // keeps tracking a live drag-resize the rest of the time.
  const chatContentRef = React.useRef<HTMLDivElement>(null);
  const chatCollapsedFirstRunRef = React.useRef(true);
  React.useEffect(() => {
    const panel = chatPanelRef.current;
    if (!panel) return;
    // `ResizablePanel`'s own `className`/`style` props land on an inner content div, never on
    // the outer element the library actually resizes (documented — done to keep consumers from
    // fighting its own flex layout) — a CSS transition can't be declared through those props at
    // all. Toggling `transition` directly on that outer element (found by its DOM id, which the
    // library sets to the panel's `id`) only while an explicit collapse/expand is in flight is
    // what keeps a live drag-resize from being dragged through a 200ms transition lag too.
    const el = document.getElementById("chat");
    const content = chatContentRef.current;
    const skipAnimation = chatCollapsedFirstRunRef.current;
    chatCollapsedFirstRunRef.current = false;
    if (el && content && !skipAnimation) {
      content.style.width = `${content.getBoundingClientRect().width}px`;
      el.style.transition =
        "flex-grow 200ms ease-out, flex-basis 200ms ease-out";
    }
    if (chatCollapsed && !panel.isCollapsed()) panel.collapse();
    if (!chatCollapsed && panel.isCollapsed()) panel.expand();
    const timer = window.setTimeout(() => {
      if (el) el.style.transition = "";
      if (content) content.style.width = "";
    }, 250);
    return () => window.clearTimeout(timer);
  }, [chatCollapsed, chatPanelRef]);
  // The Layers/Inspect sidebar (studio-builder-spec.md's two fixed columns merged into one
  // collapsible panel) — collapsed by default frees the canvas to full width and keeps the
  // default view to Chat + Canvas only (non-tech default: layers/inspector are power-user tools
  // an owner opens on purpose, not something shown unasked); persists per user like the chat
  // panel above.
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistentState(
    `studio:sidebarCollapsed:${userId}`,
    true
  );
  const [sidebarTab, setSidebarTab] = React.useState<
    "layers" | "inspect" | "files" | "history"
  >("layers");
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
  // Selecting an element to edit its style is the whole point of opening the sidebar in "edit"
  // mode — jump it to the Inspect tab automatically instead of leaving it sitting on Layers.
  // Depends on `mode` and `selectedId`, which change from independent call sites (canvas
  // selection here, the edit-mode toggle in WorkArea) — an effect is the natural join point.
  React.useEffect(() => {
    // oxlint-disable-next-line react-doctor/no-chain-state-updates -- derived tab, see comment above
    if (mode === "edit" && selectedId) setSidebarTab("inspect");
  }, [mode, selectedId]);
  const [commentTarget, setCommentTarget] =
    React.useState<CommentTarget | null>(null);
  const [selectedValues, setSelectedValues] =
    React.useState<InspectorValues | null>(null);
  const commitRef = React.useRef<((op: PatchOp) => void) | null>(null);
  const zoomControlsRef = React.useRef<ZoomControls | null>(null);
  const drawControlsRef = React.useRef<DrawControls | null>(null);
  const thumbnailControlsRef = React.useRef<ThumbnailControls | null>(null);
  const commentScreenshotControlsRef =
    React.useRef<CommentScreenshotControls | null>(null);
  const exportControlsRef = React.useRef<ExportControls | null>(null);
  const saveControlsRef = React.useRef<SaveControls | null>(null);
  const [dirty, setDirty] = React.useState(false);
  // A save is explicit now (Cmd+S / the toolbar button), not a background debounce — losing
  // the tab without saving would otherwise silently drop the edit, so warn on the way out.
  React.useEffect(() => {
    if (!dirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);
  const [chatAutoPrompt, setChatAutoPrompt] = React.useState<string | null>(
    null
  );
  // Version↔chat cross-panel jump (chat's "view this version" / history's "view chat" links) —
  // same one-shot-prop pattern as `chatAutoPrompt` above, mirrored across the two panels rather
  // than a shared ref since they live in separate tabs/split panes.
  const [highlightVersionId, setHighlightVersionId] = React.useState<
    string | null
  >(null);
  const [scrollToChatMessageId, setScrollToChatMessageId] = React.useState<
    string | null
  >(null);
  function handleViewVersion(versionId: string) {
    setSidebarCollapsed(false);
    setSidebarTab("history");
    setHighlightVersionId(versionId);
  }
  function handleViewChatMessage(chatMessageId: string) {
    setChatCollapsed(false);
    setScrollToChatMessageId(chatMessageId);
  }
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

  // An explicit save (Cmd+S / the toolbar Save button — see Canvas's `SaveControls`) lands a
  // new `pageVersions` row (origin="manual") with the full HTML + the accumulated ops batch;
  // failures are non-blocking (the edit already applied live + to undo stack). One deliberate
  // action per version, instead of a version per edit-pause, is what keeps history usable.
  // Deliberately doesn't invalidate `landingKeys.detail`/`.html` on success: Canvas's live
  // iframe DOM is already the source of truth for the open session, and refetching would
  // swap `htmlKey` under it, forcing a disruptive iframe reload mid-edit for no visible gain.
  // oxlint-disable-next-line react-doctor/query-mutation-missing-invalidation -- see comment above
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
    },
    onError: () =>
      toast.add({ title: m.studioDrawSendErrorToast(), type: "error" })
  });

  // FR-B-31: routes the banner's CTA into the exact same chat pipeline a typed message
  // would use (ChatPanel's `autoPrompt`) — no separate "apply fix" endpoint.
  function handleFunnelGapsFix() {
    if (!funnelGaps) return;
    const parts: string[] = [];
    if (funnelGaps.missingLeadForm) parts.push(m.studioFunnelFixFormPrompt());
    if (funnelGaps.missingSeoMeta) parts.push(m.studioFunnelFixSeoPrompt());
    setChatAutoPrompt(parts.join(" "));
    onFunnelGapsHandled?.();
  }

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

  // The canvas flexes to fill whatever width the sidebar isn't using — no forced min-width or
  // horizontal scroll, so collapsing the sidebar actually reclaims working space instead of
  // just revealing empty scroll track. The Layers/Inspect sidebar is one collapsible panel
  // (width transition below) rather than two always-on fixed columns.
  // Without real HTML there's no layer tree/selection to show either — an empty sidebar next to
  // a loading spinner reads as broken, not "loading". Just the placeholder, full width, until
  // there's real content for the layer tree/inspector to reflect.
  const canvasArea =
    html === null ? (
      (canvasPlaceholder ?? <GeneratingPlaceholder generatedChars={0} />)
    ) : (
      <div className="relative flex h-full min-w-0">
        <div className="relative min-w-0 flex-1">
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
            onCommentScreenshotControlsReady={(controls) => {
              commentScreenshotControlsRef.current = controls;
            }}
            onExportControlsReady={(controls) => {
              exportControlsRef.current = controls;
            }}
            onSaveControlsReady={(controls) => {
              saveControlsRef.current = controls;
            }}
            onDirtyChange={setDirty}
          />

          {mode !== "draw" && (
            <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full border bg-background/95 px-1 py-1 shadow-sm backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label={m.studioToolbarZoomOut()}
                onClick={() => zoomControlsRef.current?.zoomOut()}
              >
                <ZoomOut />
              </Button>
              <span className="w-10 text-center text-xs text-muted-foreground tabular-nums">
                {zoomPercent}%
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label={m.studioToolbarZoomIn()}
                onClick={() => zoomControlsRef.current?.zoomIn()}
              >
                <ZoomIn />
              </Button>
            </div>
          )}
        </div>

        {/* Below `lg`, the canvas can't afford to lose 320px to a pushed-in sidebar — it floats
         * over the canvas instead (own shadow + z-index), same collapse toggle either way. */}
        {!isDesktopLayout && !sidebarCollapsed && (
          <button
            type="button"
            aria-label={m.studioHideSidebar()}
            className="absolute inset-0 z-10 bg-black/40"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        <div
          className={cn(
            "h-full shrink-0 overflow-hidden border-l bg-background transition-[width] duration-200 ease-out",
            "max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-20 max-lg:border-l-0 max-lg:shadow-2xl",
            sidebarCollapsed ? "w-0 border-transparent" : "w-[320px]"
          )}
        >
          {/* Fixed inner width keeps Layers/Inspect content from reflowing while the
           * outer wrapper's width animates closed/open. */}
          <div className="flex h-full w-[320px] flex-col">
            <Tabs
              value={sidebarTab}
              onValueChange={(value) =>
                setSidebarTab(
                  value as "layers" | "inspect" | "files" | "history"
                )
              }
              className="h-full gap-0"
            >
              <TabsList
                variant="line"
                className="shrink-0 overflow-x-auto px-2 pt-1.5"
              >
                <TabsTrigger value="layers" className="shrink-0">
                  {m.studioSidebarLayers()} ({layers.length})
                </TabsTrigger>
                <TabsTrigger value="inspect" className="shrink-0">
                  {m.studioSidebarInspect()}
                </TabsTrigger>
                <TabsTrigger value="files" className="shrink-0">
                  {m.studioSidebarFiles()}
                </TabsTrigger>
                <TabsTrigger value="history" className="shrink-0">
                  {m.studioSidebarHistory()}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="layers" className="min-h-0 flex-1">
                <LayerTreePanel
                  layers={layers}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  onSelect={handleSelect}
                  onHoverChange={setHoveredId}
                  onToggleVisibility={(srcmapId, hidden) =>
                    commitRef.current?.({
                      type: "toggleVisibility",
                      srcmapId,
                      hidden
                    })
                  }
                  onRename={(srcmapId, name) =>
                    commitRef.current?.({
                      type: "renameLayer",
                      srcmapId,
                      name
                    })
                  }
                  onReorder={(srcmapId, beforeSrcmapId) =>
                    commitRef.current?.({
                      type: "moveBefore",
                      srcmapId,
                      beforeSrcmapId
                    })
                  }
                  footer={
                    layers.length > LAYER_TREE_VIRTUALIZE_THRESHOLD
                      ? m.studioLayersDragDisabledHint({
                          threshold: LAYER_TREE_VIRTUALIZE_THRESHOLD
                        })
                      : m.studioLayersFooterHint()
                  }
                />
              </TabsContent>
              <TabsContent value="inspect" className="min-h-0 flex-1">
                {mode === "edit" && selectedId && selectedValues ? (
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
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                    {m.studioInspectEmpty()}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="files" className="min-h-0 flex-1">
                <DesignFilesPanel
                  landingPageId={landingPage.id}
                  fileName={fileName}
                />
              </TabsContent>
              <TabsContent value="history" className="min-h-0 flex-1">
                <VersionHistoryPanel
                  landingPageId={landingPage.id}
                  currentVersionId={currentVersionId}
                  highlightVersionId={highlightVersionId}
                  onHighlightVersionIdHandled={() =>
                    setHighlightVersionId(null)
                  }
                  onViewChat={handleViewChatMessage}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );

  const workArea = (
    <WorkArea
      landingPageId={landingPage.id}
      layers={layers}
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
      dirty={dirty}
      saving={manualSaveMutation.isPending}
      onSave={() => saveControlsRef.current?.save()}
      lastSavedAt={lastSavedAt}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
    >
      {canvasArea}
    </WorkArea>
  );

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <StudioTopBar
        landingPage={landingPage}
        html={html}
        onCapturePng={async () =>
          (await exportControlsRef.current?.capturePng()) ?? null
        }
        chatCollapsed={chatCollapsed}
        onToggleChat={() => setChatCollapsed((v) => !v)}
      />
      {funnelGaps && (
        <Alert className="m-3 mb-0">
          <Sparkles />
          <AlertTitle>{m.studioFunnelGapsTitle()}</AlertTitle>
          <AlertDescription>
            {funnelGaps.missingLeadForm && funnelGaps.missingSeoMeta
              ? m.studioFunnelGapsBothDescription()
              : funnelGaps.missingLeadForm
                ? m.studioFunnelGapsFormDescription()
                : m.studioFunnelGapsSeoDescription()}
          </AlertDescription>
          <AlertAction className="static mt-1 flex justify-end gap-2 pe-0">
            <Button variant="ghost" size="sm" onClick={onFunnelGapsHandled}>
              {m.studioFunnelGapsDismiss()}
            </Button>
            <Button size="sm" onClick={handleFunnelGapsFix}>
              {m.studioFunnelGapsFixButton()}
            </Button>
          </AlertAction>
        </Alert>
      )}
      <div className="min-h-0 min-w-0 flex-1">
        {html === null ? (
          // Chat only makes sense once there's a version to edit — the endpoint behind it
          // 400s without one. Rather than mount it disabled/unreachable, just don't show the
          // split until real content exists.
          workArea
        ) : isDesktopLayout ? (
          <ResizablePanelGroup
            id={`studio-panels:${userId}`}
            defaultLayout={defaultLayout}
            onLayoutChanged={onLayoutChanged}
          >
            <ResizablePanel
              id="chat"
              panelRef={chatPanelRef}
              defaultSize="22"
              minSize="20"
              maxSize="45"
              collapsible
              collapsedSize={0}
              className="min-w-0"
            >
              <div className="h-full overflow-hidden">
                <div ref={chatContentRef} className="h-full w-full">
                  <ChatPanel
                    landingPageId={landingPage.id}
                    onApplyPatch={handleApplyAiPatch}
                    onFullHtmlApplied={handleFullHtmlApplied}
                    autoPrompt={chatAutoPrompt}
                    onViewVersion={handleViewVersion}
                    scrollToMessageId={scrollToChatMessageId}
                    onScrollToMessageHandled={() =>
                      setScrollToChatMessageId(null)
                    }
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="work-area" defaultSize="78" className="min-w-0">
              {workArea}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          // Below `lg` there's no room to split the canvas with a drag-resizable chat pane —
          // it floats as a dismissible drawer instead (backdrop click, like the Layers/Inspect
          // sidebar's overlay below), and drag-resize (`ResizablePanelGroup`) isn't mounted at
          // all here rather than trying to make it behave like an overlay.
          <div className="relative h-full min-w-0">
            {workArea}
            {!chatCollapsed && (
              <>
                <button
                  type="button"
                  aria-label={m.studioHideChat()}
                  className="absolute inset-0 z-10 bg-black/40"
                  onClick={() => setChatCollapsed(true)}
                />
                <div className="absolute inset-y-0 left-0 z-20 w-[320px] max-w-[85vw] overflow-hidden border-r bg-background shadow-2xl">
                  <ChatPanel
                    landingPageId={landingPage.id}
                    onApplyPatch={handleApplyAiPatch}
                    onFullHtmlApplied={handleFullHtmlApplied}
                    autoPrompt={chatAutoPrompt}
                    onViewVersion={handleViewVersion}
                    scrollToMessageId={scrollToChatMessageId}
                    onScrollToMessageHandled={() =>
                      setScrollToChatMessageId(null)
                    }
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <CommentDialog
        target={commentTarget}
        landingPageId={landingPage.id}
        captureScreenshot={(srcmapId) =>
          commentScreenshotControlsRef.current?.capture(srcmapId) ??
          Promise.resolve(null)
        }
        onOpenChange={(open) => {
          if (!open) setCommentTarget(null);
        }}
      />
    </div>
  );
}
