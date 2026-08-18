import { useStudioMode } from "@dv/studio-ui";
import type { DrawTool, LayerNode } from "@dv/studio-ui";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@dv/ui/components/shadcn/tooltip";
import {
  Loader2,
  MessageSquare,
  PenTool,
  RefreshCw,
  SquarePen,
  Wand2,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import { CommentQueue } from "./comment-queue";
import { DesignFilesPanel } from "./design-files-panel";
import { DrawToolbar } from "./draw-toolbar";

export type StudioWorkAreaTab = "design-files" | "page";

const savedTimeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit"
});

export function WorkArea({
  fileName,
  landingPageId,
  currentVersionId,
  layers,
  activeTab,
  onActiveTabChange,
  zoomPercent,
  onZoomIn,
  onZoomOut,
  onRefresh,
  drawTool,
  onDrawToolChange,
  drawColor,
  onDrawColorChange,
  canUndoDraw,
  onUndoDraw,
  onClearDraw,
  drawDefaultPrompt,
  onSendDraw,
  sendingDraw,
  saving,
  lastSavedAt,
  children
}: {
  fileName: string;
  landingPageId: string;
  currentVersionId: string | null;
  layers: LayerNode[];
  activeTab: StudioWorkAreaTab;
  onActiveTabChange: (tab: StudioWorkAreaTab) => void;
  zoomPercent: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRefresh: () => void;
  drawTool: DrawTool;
  onDrawToolChange: (tool: DrawTool) => void;
  drawColor: string;
  onDrawColorChange: (color: string) => void;
  canUndoDraw: boolean;
  onUndoDraw: () => void;
  onClearDraw: () => void;
  drawDefaultPrompt: string;
  onSendDraw: (text: string) => void;
  sendingDraw: boolean;
  saving: boolean;
  lastSavedAt: Date | null;
  children: React.ReactNode;
}) {
  const { mode, setMode } = useStudioMode();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onActiveTabChange(value as StudioWorkAreaTab)}
      className="h-full gap-0"
    >
      <div className="flex shrink-0 items-center border-b px-2 pt-1.5">
        <TabsList variant="line">
          <TabsTrigger value="design-files">
            {m.studioTabDesignFiles()}
          </TabsTrigger>
          <TabsTrigger value="page">{fileName}</TabsTrigger>
        </TabsList>
      </div>

      {activeTab === "page" && (
        <div className="flex shrink-0 items-center gap-1 border-b px-2 py-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.studioToolbarRefresh()}
            onClick={onRefresh}
          >
            <RefreshCw />
          </Button>
          <span className="flex items-center gap-1 px-1 text-xs text-muted-foreground">
            {saving ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                {m.studioAutosaveSaving()}
              </>
            ) : (
              lastSavedAt && (
                <span>
                  {m.studioAutosaveSaved({
                    time: savedTimeFormat.format(lastSavedAt)
                  })}
                </span>
              )
            )}
          </span>
          <Tooltip>
            <TooltipTrigger
              render={
                <span>
                  <Button variant="ghost" size="sm" disabled>
                    <Wand2 /> {m.studioToolbarTweaks()}
                  </Button>
                </span>
              }
            />
            <TooltipContent>{m.studioComingSoon()}</TooltipContent>
          </Tooltip>

          <div className="ms-2 flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={mode === "comment" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setMode("comment")}
                  >
                    <MessageSquare /> {m.studioToolbarComment()}
                  </Button>
                }
              />
              <TooltipContent>
                {m.studioToolbarComment()} {m.studioShortcutComment()}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={mode === "edit" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setMode("edit")}
                  >
                    <SquarePen /> {m.studioToolbarEdit()}
                  </Button>
                }
              />
              <TooltipContent>
                {m.studioToolbarEdit()} {m.studioShortcutEdit()}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={mode === "draw" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setMode("draw")}
                  >
                    <PenTool /> {m.studioToolbarDraw()}
                  </Button>
                }
              />
              <TooltipContent>
                {m.studioToolbarDraw()} {m.studioShortcutDraw()}
              </TooltipContent>
            </Tooltip>
            <CommentQueue landingPageId={landingPageId} layers={layers} />
          </div>

          {mode === "draw" ? (
            <div className="ms-auto">
              <DrawToolbar
                tool={drawTool}
                onToolChange={onDrawToolChange}
                color={drawColor}
                onColorChange={onDrawColorChange}
                canUndo={canUndoDraw}
                onUndo={onUndoDraw}
                onClear={onClearDraw}
                defaultPrompt={drawDefaultPrompt}
                onSend={onSendDraw}
                sending={sendingDraw}
              />
            </div>
          ) : (
            <div className="ms-auto flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={m.studioToolbarZoomOut()}
                      onClick={onZoomOut}
                    >
                      <ZoomOut />
                    </Button>
                  }
                />
                <TooltipContent>
                  {m.studioToolbarZoomOut()} {m.studioShortcutZoomOut()}
                </TooltipContent>
              </Tooltip>
              <span className="w-10 text-center text-xs text-muted-foreground tabular-nums">
                {zoomPercent}%
              </span>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={m.studioToolbarZoomIn()}
                      onClick={onZoomIn}
                    >
                      <ZoomIn />
                    </Button>
                  }
                />
                <TooltipContent>
                  {m.studioToolbarZoomIn()} {m.studioShortcutZoomIn()}
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      )}

      <TabsContent value="design-files" className="min-h-0 flex-1">
        <DesignFilesPanel
          landingPageId={landingPageId}
          fileName={fileName}
          currentVersionId={currentVersionId}
          onOpenPage={() => onActiveTabChange("page")}
        />
      </TabsContent>

      <TabsContent value="page" className="min-h-0 flex-1">
        {children}
      </TabsContent>
    </Tabs>
  );
}
