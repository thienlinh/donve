import { useStudioMode } from "@dv/studio-ui";
import type { DrawTool, LayerNode } from "@dv/studio-ui";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@dv/ui/components/shadcn/tooltip";
import { cn } from "@dv/ui/lib/utils";
import {
  Loader2,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  PenTool,
  RefreshCw,
  Save,
  SquarePen,
  Wand2
} from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import { CommentQueue } from "./comment-queue";
import { DrawToolbar } from "./draw-toolbar";

const savedTimeFormat = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit"
});

export function WorkArea({
  landingPageId,
  layers,
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
  dirty,
  saving,
  onSave,
  lastSavedAt,
  sidebarCollapsed,
  onToggleSidebar,
  children
}: {
  landingPageId: string;
  layers: LayerNode[];
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
  /** Unsaved edits pending an explicit save. */
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  lastSavedAt: Date | null;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  children: React.ReactNode;
}) {
  const { mode, setMode } = useStudioMode();

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex shrink-0 flex-nowrap items-center gap-1 overflow-x-auto border-b px-2 py-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label={m.studioToolbarRefresh()}
          onClick={onRefresh}
        >
          <RefreshCw />
        </Button>
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="shrink-0">
                <Button
                  variant={dirty ? "default" : "ghost"}
                  size="sm"
                  disabled={saving || !dirty}
                  onClick={onSave}
                >
                  {saving ? <Loader2 className="animate-spin" /> : <Save />}
                  {saving ? m.studioAutosaveSaving() : m.studioSaveButton()}
                </Button>
              </span>
            }
          />
          <TooltipContent>{m.studioSaveShortcutHint()}</TooltipContent>
        </Tooltip>
        {!dirty && !saving && lastSavedAt && (
          <span className="shrink-0 px-1 text-xs whitespace-nowrap text-muted-foreground">
            {m.studioAutosaveSaved({
              time: savedTimeFormat.format(lastSavedAt)
            })}
          </span>
        )}
        <Tooltip>
          <TooltipTrigger
            render={
              <span className="shrink-0">
                <Button variant="ghost" size="sm" disabled>
                  <Wand2 /> {m.studioToolbarTweaks()}
                </Button>
              </span>
            }
          />
          <TooltipContent>{m.studioComingSoon()}</TooltipContent>
        </Tooltip>

        <div className="ms-2 flex shrink-0 items-center gap-0.5 rounded-md border p-0.5">
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
        </div>
        <CommentQueue landingPageId={landingPageId} layers={layers} />

        {mode === "draw" && (
          <div className="ms-auto shrink-0">
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
        )}

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn("shrink-0", mode !== "draw" && "ms-auto")}
                aria-label={
                  sidebarCollapsed
                    ? m.studioShowSidebar()
                    : m.studioHideSidebar()
                }
                onClick={onToggleSidebar}
              >
                {sidebarCollapsed ? <PanelRightOpen /> : <PanelRightClose />}
              </Button>
            }
          />
          <TooltipContent>
            {sidebarCollapsed ? m.studioShowSidebar() : m.studioHideSidebar()}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="min-h-0 min-w-0 flex-1">{children}</div>
    </div>
  );
}
