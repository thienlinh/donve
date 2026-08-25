import type { NativePageDocument, Template } from "@dv/contracts";
import {
  buildPuckConfig,
  designTokensToCss,
  pageSpecToPuckData,
  puckDataToPageSpec
} from "@dv/studio-catalog";
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
import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { useSidebar } from "@dv/ui/components/shadcn/sidebar";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { toast } from "@dv/ui/components/shadcn/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@dv/ui/components/shadcn/tooltip";
import type { Spec } from "@json-render/core";
import type { Data, Plugin, PuckAction } from "@puckeditor/core";

import "@puckeditor/core/puck.css";
import { createUsePuck, Puck } from "@puckeditor/core";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Gauge,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Redo2,
  Save,
  Search,
  TrendingUp,
  Undo2,
  Upload
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { compressToWebp } from "@/lib/image-compress";
import * as m from "@/paraglide/messages.js";

import {
  assetFileUrl,
  assetPosterUrl,
  fetchLandingPage,
  fetchTemplates,
  renameLandingPage,
  updateLandingPageSpec,
  uploadAsset
} from "../../studio/api";
import { PublishDialog } from "../../studio/components/publish-dialog";
import {
  extractVideoPoster,
  MAX_VIDEO_BYTES,
  VIDEO_MIME_TYPES
} from "../../studio/lib/video-poster";
import { landingKeys } from "../../studio/query-keys";
import { createAiPlugin } from "../lib/ai-plugin";
import { puckDictionaryVi, puckViewportsVi } from "../lib/puck-dictionary";
import { OptimizationPanel } from "./optimization-panel";
import { QualityPanel } from "./quality-panel";
import { SaveAsTemplateDialog } from "./save-as-template-dialog";
import { SeoPanel } from "./seo-panel";

/**
 * In-memory editing shape — `pageSpec` typed as `@json-render/core`'s own `Spec` (what the
 * PageSpec ⇄ Puck adapter needs), not `@dv/contracts`'s `NativePageDocument["pageSpec"]`.
 * The two are structurally close but not identical (contracts' `visible` is `unknown` for
 * envelope-only validation; json-render's is `VisibilityCondition`) — casting once at the API
 * boundary (`toEditable`/`saveMutation`) is simpler than fighting that mismatch everywhere.
 */
interface EditableDocument {
  pageSpec: Spec;
  tokens: NativePageDocument["tokens"];
  seo?: NativePageDocument["seo"];
}

const EMPTY_SPEC: Spec = {
  root: "page-root",
  elements: { "page-root": { type: "page_root", props: {}, children: [] } }
};

const DEFAULT_TOKENS: NativePageDocument["tokens"] = {
  colorPrimary: "#111827",
  colorPrimaryForeground: "#ffffff",
  colorSurface: "#ffffff",
  colorForeground: "#111827",
  colorMuted: "#6b7280",
  colorBorder: "#e5e7eb",
  fontHeading: "Inter, sans-serif",
  fontBody: "Inter, sans-serif",
  radius: "0.5rem"
};

function toEditable(spec: unknown): EditableDocument {
  if (
    spec &&
    typeof spec === "object" &&
    "pageSpec" in spec &&
    "tokens" in spec
  ) {
    return spec as EditableDocument;
  }
  return { pageSpec: EMPTY_SPEC, tokens: DEFAULT_TOKENS };
}

// Almost config-free: everything but the asset-upload callback comes from the catalog/registry
// and is identical across editing sessions. `uploadAsset` is the one per-page binding (Puck's
// image/video fields upload into THIS page's `pageAssets`), so the config is memoized per
// `landingPageId` in the component below rather than built once at module scope.
function buildConfigFor(landingPageId: string) {
  return buildPuckConfig({
    uploadAsset: async (file) => {
      if (VIDEO_MIME_TYPES.has(file.type)) {
        if (file.size > MAX_VIDEO_BYTES) throw new Error("video_too_large");
        // FR-B-29: no client transcode — only the poster is derived, same as Design Files.
        const poster = await extractVideoPoster(file).catch(() => undefined);
        const asset = await uploadAsset(landingPageId, file, file.name, poster);
        return {
          url: assetFileUrl(landingPageId, asset.id),
          posterUrl: asset.posterKey
            ? assetPosterUrl(landingPageId, asset.id)
            : undefined
        };
      }
      const { blob, fileName } = await compressToWebp(file);
      const asset = await uploadAsset(landingPageId, blob, fileName);
      return { url: assetFileUrl(landingPageId, asset.id) };
    }
  });
}

// `usePuck()` with no selector subscribes to the whole app state (UI state included, which
// changes on nearly every pointer move) — a typed selector-based hook only re-renders
// `HeaderActions` when the 2 fields it actually reads change.
const useTypedPuck = createUsePuck();

const iconButtonClass =
  "flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50";

/**
 * Replaces Puck's default header (`overrides.header`) — Puck bundles the back/title/undo-redo/
 * sidebar-toggles into one opaque `children` node with no way to reposition them individually, so
 * this rebuilds it from scratch. A single, in-flow row: `_PuckLayout-header` (the grid cell this
 * renders into) sets `overflow: auto` whenever the left sidebar is visible, which silently clips
 * anything positioned outside the row's own box — an earlier version floated the sidebar toggles
 * below the row via `absolute top-full` to sit nearer the canvas, and that clipping hid them
 * entirely. Kept simple instead: back → left-sidebar toggle → editable title → actions (now
 * including undo/redo, moved here so the title has room) → right-sidebar toggle, all one row.
 * `leftSideBarVisible`/`rightSideBarVisible` are the same public `ui` slice `usePuck()` exposes
 * elsewhere in this file (`handleSelectElement`'s `setUi` dispatch).
 *
 * The right sidebar (fields panel) additionally auto-follows selection: hidden while nothing is
 * selected on the canvas, opens as soon as an element is — a fields panel with nothing to show is
 * just empty chrome. The manual toggle still works in between selection changes.
 */
function StudioHeader({
  landingPage,
  actions
}: {
  landingPage: { id: string; name: string };
  actions: ReactNode;
}) {
  const queryClient = useQueryClient();
  const dispatch = useTypedPuck((s) => s.dispatch);
  const leftSideBarVisible = useTypedPuck(
    (s) => s.appState.ui.leftSideBarVisible
  );
  const rightSideBarVisible = useTypedPuck(
    (s) => s.appState.ui.rightSideBarVisible
  );
  const itemSelector = useTypedPuck((s) => s.appState.ui.itemSelector);

  useEffect(() => {
    dispatch({
      type: "setUi",
      ui: { rightSideBarVisible: itemSelector !== null }
    });
  }, [itemSelector, dispatch]);

  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(landingPage.name);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) renameInputRef.current?.focus();
  }, [isRenaming]);

  const renameMutation = useMutation({
    mutationFn: (name: string) => renameLandingPage(landingPage.id, name),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: landingKeys.detail(landingPage.id)
      }),
    onError: () =>
      toast.add({ title: m.studioRenameErrorToast(), type: "error" })
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
    <header className="flex h-12 shrink-0 items-center gap-1 overflow-x-auto border-b border-border px-2">
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              to="/landings"
              aria-label={m.commonBack()}
              className={iconButtonClass}
            >
              <ArrowLeft className="size-4" />
            </Link>
          }
        />
        <TooltipContent>{m.commonBack()}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label="Khối"
              onClick={() =>
                dispatch({
                  type: "setUi",
                  ui: { leftSideBarVisible: !leftSideBarVisible }
                })
              }
              className={iconButtonClass}
            >
              {leftSideBarVisible ? (
                <PanelLeftClose className="size-4" />
              ) : (
                <PanelLeftOpen className="size-4" />
              )}
            </button>
          }
        />
        <TooltipContent>Khối</TooltipContent>
      </Tooltip>

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
          className="h-7 max-w-xs min-w-32 flex-1 shrink"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setNameDraft(landingPage.name);
            setIsRenaming(true);
          }}
          aria-label={m.commonEdit()}
          className="group flex max-w-xs min-w-32 flex-1 shrink items-center justify-between gap-1.5 rounded-md border border-transparent px-2 py-1 text-left text-sm font-semibold hover:border-input hover:bg-background"
        >
          <span className="truncate">{landingPage.name}</span>
          <Pencil className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
        </button>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label="Trang"
              onClick={() =>
                dispatch({
                  type: "setUi",
                  ui: { rightSideBarVisible: !rightSideBarVisible }
                })
              }
              className={iconButtonClass}
            >
              {rightSideBarVisible ? (
                <PanelRightClose className="size-4" />
              ) : (
                <PanelRightOpen className="size-4" />
              )}
            </button>
          }
        />
        <TooltipContent>Trang</TooltipContent>
      </Tooltip>
    </header>
  );
}

/**
 * Replaces Puck's default header actions (`overrides.headerActions` — `renderHeaderActions` is
 * deprecated). Hoisted to module scope so it's a stable component type across renders (an
 * inline closure re-created per render would force Puck to remount it every time). `usePuck()`
 * only works here because Puck renders this inside its own provider tree; `dispatch`/live `data`
 * are mirrored into refs each render so code outside that tree (`QualityPanel`'s "click finding
 * → highlight element") can still drive selection.
 */
function HeaderActions({
  id,
  activeDoc,
  saveMutation,
  setQualityOpen,
  setOptimizationOpen,
  setSeoOpen,
  setPublishOpen,
  puckDispatchRef,
  puckDataRef
}: {
  id: string;
  activeDoc: EditableDocument;
  saveMutation: UseMutationResult<unknown, unknown, EditableDocument>;
  setQualityOpen: (open: boolean) => void;
  setOptimizationOpen: (open: boolean) => void;
  setSeoOpen: (open: boolean) => void;
  setPublishOpen: (open: boolean) => void;
  puckDispatchRef: React.RefObject<((action: PuckAction) => void) | null>;
  puckDataRef: React.RefObject<Data | null>;
}) {
  const dispatch = useTypedPuck((s) => s.dispatch);
  const data = useTypedPuck((s) => s.appState.data);
  const canUndo = useTypedPuck((s) => s.history.hasPast);
  const canRedo = useTypedPuck((s) => s.history.hasFuture);
  const historyBack = useTypedPuck((s) => s.history.back);
  const historyForward = useTypedPuck((s) => s.history.forward);
  puckDispatchRef.current = dispatch;
  puckDataRef.current = data;

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              disabled={!canUndo}
              aria-label={m.commonUndo()}
              onClick={historyBack}
              className={iconButtonClass}
            >
              <Undo2 className="size-4" />
            </button>
          }
        />
        <TooltipContent>{m.commonUndo()}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              disabled={!canRedo}
              aria-label={m.commonRedo()}
              onClick={historyForward}
              className={iconButtonClass}
            >
              <Redo2 className="size-4" />
            </button>
          }
        />
        <TooltipContent>{m.commonRedo()}</TooltipContent>
      </Tooltip>
      <Button
        variant="outline"
        size="sm"
        disabled={saveMutation.isPending}
        onClick={() => saveMutation.mutate(activeDoc)}
      >
        <Save /> {m.commonSave()}
      </Button>
      <Button variant="outline" size="sm" onClick={() => setQualityOpen(true)}>
        <Gauge /> Chất lượng
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOptimizationOpen(true)}
      >
        <TrendingUp /> Tối ưu hoá
      </Button>
      <Button variant="outline" size="sm" onClick={() => setSeoOpen(true)}>
        <Search /> {m.studioSeoPanelTitle()}
      </Button>
      <SaveAsTemplateDialog landingPageId={id} document={activeDoc} />
      <Button size="sm" onClick={() => setPublishOpen(true)}>
        <Upload /> {m.studioPublishButton()}
      </Button>
    </div>
  );
}

/**
 * Left-nav "Mẫu" (Templates) tab, alongside Puck's own built-in "Khối"/"Cấu trúc" tabs
 * (`plugins` prop below — Puck appends any custom plugin after its own defaults, see
 * `chunk-55V3NZVF.mjs`'s `pluginItems` composition, so this doesn't need to reimplement those).
 * Reuses the same `/templates` gallery the landing-page-creation `TemplatePickerDialog` reads
 * (`saveLandingPageAsTemplate` in `../../studio/api`). Unlike that creation-time picker, this one
 * edits an *existing* page: picking a template here activates it as this page's entire content
 * — one active template at a time, replacing whatever sections were there before, not appending —
 * so the user lands on the full picked layout and only needs to edit copy/add-remove individual
 * sections from there (exactly what a "choose a template" step means, distinct from "insert a
 * few extra sections"). Destructive (discards unsaved section edits), so it's gated behind a
 * confirm dialog, same convention as `custom-import-page.tsx`'s "Convert sang native" button.
 */
function TemplatesPluginPanel() {
  const dispatch = useTypedPuck((s) => s.dispatch);
  const { data: templates, isPending } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates
  });
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);

  function applyTemplate(template: Template) {
    const templateData = pageSpecToPuckData(
      template.pageSpec as unknown as Spec
    );
    dispatch({
      type: "setData",
      data: (prev) => ({ ...prev, content: templateData.content })
    });
    setActiveTemplateId(template.id);
    setPendingTemplate(null);
    toast.add({ title: `Đã áp dụng mẫu "${template.name}"`, type: "success" });
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-sm text-muted-foreground">
        Chọn một mẫu để dùng làm toàn bộ nội dung trang này. Nội dung hiện tại
        sẽ được thay thế — sau đó bạn có thể chỉnh sửa hoặc thêm/xoá từng
        section trong tab Khối.
      </p>
      {isPending ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : !templates || templates.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có mẫu nào.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setPendingTemplate(template)}
              data-active={template.id === activeTemplateId}
              className="flex flex-col gap-0.5 rounded-md border border-border p-3 text-left hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent data-[active=true]:ring-1 data-[active=true]:ring-primary"
            >
              <span className="text-sm font-medium">{template.name}</span>
              <span className="text-xs text-muted-foreground">
                {template.industry}
              </span>
            </button>
          ))}
        </div>
      )}

      <AlertDialog
        open={pendingTemplate !== null}
        onOpenChange={(open) => {
          if (!open) setPendingTemplate(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Áp dụng mẫu?</AlertDialogTitle>
            <AlertDialogDescription>
              Toàn bộ nội dung hiện tại của trang sẽ được thay thế bằng mẫu
              &quot;{pendingTemplate?.name}&quot;. Thao tác này không thể hoàn
              tác bằng nút Hoàn tác sau khi lưu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingTemplate && applyTemplate(pendingTemplate)}
            >
              Áp dụng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const templatesPlugin: Plugin = {
  name: "templates",
  label: "Mẫu",
  icon: <LayoutTemplate size={16} />,
  render: () => <TemplatesPluginPanel />
};

/**
 * Manual-creation Studio (`roadmap.md` §Studio UI — "Điều kiện xong: user tạo 1 trang hoàn
 * chỉnh, chất lượng cao, hoàn toàn không cần AI"). Distinct route from the legacy srcmap
 * `/studio` — this one edits `pageVersions.spec` directly, no HTML/srcmap involved at all.
 *
 * The canvas/layers/inspector/add-section quadrant is Puck (`@puckeditor/core`) — PageSpec stays
 * the canonical, DB-persisted, AI-facing shape (every agent still reads/writes it unchanged);
 * Puck only ever sees a derived view via `pageSpecToPuckData`/`puckDataToPageSpec`
 * (`@dv/studio-catalog`). `data` is fed once per server version (keyed by `currentVersion.id`)
 * rather than on every render — Puck owns its own live editing/history state between saves.
 */
export function StudioNativePage() {
  const { id } = useParams({
    from: "/_authenticated/landings/$id/studio-native"
  });
  const queryClient = useQueryClient();
  const { data: landingPage, isPending } = useQuery({
    queryKey: landingKeys.detail(id),
    queryFn: () => fetchLandingPage(id)
  });

  const puckConfig = useMemo(() => buildConfigFor(id), [id]);

  // The live document envelope the AI chat patches against (`ai/agent-pipeline.md` §Quyết định
  // đã chốt #1 — patches apply to what the user is looking at, not the last saved version).
  // A ref rather than a prop so canvas edits don't rebuild the plugin list on every keystroke.
  const activeDocRef = useRef<NativePageDocument | null>(null);

  // Memoized for the same reason `puckConfig` is: a fresh array every render would defeat
  // Puck's own memoization of its plugin list.
  const puckPlugins = useMemo(
    () => [
      createAiPlugin({ landingPageId: id, documentRef: activeDocRef }),
      templatesPlugin
    ],
    [id]
  );

  const [doc, setDoc] = useState<EditableDocument | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [optimizationOpen, setOptimizationOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);

  // The builder canvas needs the width the main nav sidebar otherwise eats — collapse it on
  // entry, restore whatever the user had on exit rather than forcing it back open.
  const { open: sidebarWasOpen, setOpen: setSidebarOpen } = useSidebar();
  useEffect(() => {
    setSidebarOpen(false);
    return () => setSidebarOpen(sidebarWasOpen);
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- collapse once on mount, restore once on unmount; re-running on every sidebarWasOpen/setSidebarOpen render would fight the user's own toggle clicks while the builder is open
  }, []);

  const activeDoc =
    doc ?? (landingPage ? toEditable(landingPage.currentVersion?.spec) : null);
  activeDocRef.current = activeDoc;

  // Captured from `HeaderActions` (rendered inside Puck's own tree via `overrides.headerActions`)
  // so code outside that tree (QualityPanel's "click finding → highlight element") can still
  // drive selection — `usePuck()` only works for components Puck itself renders.
  const puckDispatchRef = useRef<((action: PuckAction) => void) | null>(null);
  const puckDataRef = useRef<Data | null>(null);

  // Puck's iframe copies the parent document's own `<style>`/`<link>` tags (its own
  // MutationObserver-backed "AutoFrame" mechanism) — real design tokens are needed there too
  // so editing preview matches the published page, not just the SSR/publish-time renderer
  // (`packages/studio-render`) which was the only consumer of `designTokensToCss` before Puck.
  // `#frame-root` only exists inside Puck's own iframe (never in this parent document), so
  // resetting its background/text color here is a no-op in the dashboard itself but overrides
  // the dashboard's own (possibly dark-mode) `body` background once copied into the iframe —
  // a real published page has no dark mode, it always renders on `--lp-color-surface`.
  useEffect(() => {
    if (!activeDoc) return;
    let styleEl = document.getElementById(
      "lp-design-tokens"
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "lp-design-tokens";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `${designTokensToCss(activeDoc.tokens)}#frame-root{background-color:var(--lp-color-surface);color:var(--lp-color-foreground);min-height:100vh;}`;
  }, [activeDoc]);

  const saveMutation = useMutation({
    mutationFn: (next: EditableDocument) =>
      updateLandingPageSpec(id, next as NativePageDocument),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
      toast.add({ title: "Đã lưu", type: "success" });
    },
    onError: () => toast.add({ title: "Lưu thất bại", type: "error" })
  });

  const initialPuckData = useMemo(
    () => (activeDoc ? pageSpecToPuckData(activeDoc.pageSpec) : null),
    // Recompute only when the server hands us a genuinely new version (AI regenerate/auto-fix/
    // convert-to-native) — see the `key` on `<Puck>` below, which forces the remount this reads.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [landingPage?.currentVersion?.id]
  );

  if (isPending || !landingPage || !activeDoc || !initialPuckData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  function handlePuckChange(data: Data) {
    puckDataRef.current = data;
    setDoc({
      ...activeDoc!,
      pageSpec: puckDataToPageSpec(data, activeDoc!.pageSpec)
    });
  }

  function handleSelectElement(elementId: string) {
    const data = puckDataRef.current;
    if (!data) return;
    const index = data.content.findIndex((item) => item.props.id === elementId);
    if (index === -1) return;
    puckDispatchRef.current?.({
      type: "setUi",
      ui: { itemSelector: { index } }
    });
  }

  const hasLeadForm = Object.values(activeDoc.pageSpec.elements).some(
    (el) => el.type === "lead_form"
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Puck
        key={landingPage.currentVersion?.id ?? "empty"}
        config={puckConfig}
        data={initialPuckData}
        onChange={handlePuckChange}
        // Puck's own root layout is hard-coded to `height: 100dvh` in its CSS (only overridable
        // via this prop, applied as an inline style) — without it, Puck ignores that this app
        // already has its own top bar above the canvas and overflows past the viewport bottom.
        // "100%" resolves against this wrapping div, which is itself sized by the app shell's
        // own flex layout (`h-full` on a `flex-1` ancestor — see app-shell.tsx), not the raw
        // viewport, so the canvas correctly fills exactly what's left below the header.
        height="100%"
        dictionary={puckDictionaryVi}
        viewports={puckViewportsVi}
        plugins={puckPlugins}
        overrides={{
          header: ({ actions }) => (
            <StudioHeader
              landingPage={{ id, name: landingPage.name }}
              actions={actions}
            />
          ),
          headerActions: () => (
            <HeaderActions
              id={id}
              activeDoc={activeDoc}
              saveMutation={saveMutation}
              setQualityOpen={setQualityOpen}
              setOptimizationOpen={setOptimizationOpen}
              setSeoOpen={setSeoOpen}
              setPublishOpen={setPublishOpen}
              puckDispatchRef={puckDispatchRef}
              puckDataRef={puckDataRef}
            />
          )
        }}
      />

      <PublishDialog
        landingPage={landingPage}
        html={hasLeadForm ? 'data-dv-form="lead"' : null}
        open={publishOpen}
        onOpenChange={setPublishOpen}
      />
      <QualityPanel
        open={qualityOpen}
        onOpenChange={setQualityOpen}
        landingPageId={id}
        onSelectElement={handleSelectElement}
        onAutoFixApplied={() => {
          setDoc(null);
          queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
        }}
      />
      <OptimizationPanel
        open={optimizationOpen}
        onOpenChange={setOptimizationOpen}
        landingPageId={id}
      />
      <SeoPanel
        open={seoOpen}
        onOpenChange={setSeoOpen}
        landingPageId={id}
        pageName={landingPage.name}
        seo={activeDoc.seo}
        onChange={(seo) => setDoc({ ...activeDoc, seo })}
      />
    </div>
  );
}
