import type { DrawTool } from "@dv/studio-ui";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@dv/ui/components/shadcn/popover";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import {
  ArrowUpRight,
  Pencil,
  Send,
  Square,
  Trash2,
  Undo2
} from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

const TOOL_ICONS: Record<
  DrawTool,
  React.ComponentType<{ className?: string }>
> = {
  pen: Pencil,
  arrow: ArrowUpRight,
  rect: Square
};

const TOOL_LABELS: Record<DrawTool, () => string> = {
  pen: m.studioDrawToolPen,
  arrow: m.studioDrawToolArrow,
  rect: m.studioDrawToolRect
};

/**
 * FR-B-14 sub-toolbar — shown by WorkArea in place of the zoom controls while draw mode is
 * active. Tool/color/undo state is lifted to StudioEditor because `Canvas` owns the actual
 * draw canvas and needs the same values.
 */
export function DrawToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  canUndo,
  onUndo,
  onClear,
  defaultPrompt,
  onSend,
  sending
}: {
  tool: DrawTool;
  onToolChange: (tool: DrawTool) => void;
  color: string;
  onColorChange: (color: string) => void;
  canUndo: boolean;
  onUndo: () => void;
  onClear: () => void;
  defaultPrompt: string;
  onSend: (text: string) => void;
  sending: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");

  return (
    <div className="flex items-center gap-1">
      {(["pen", "arrow", "rect"] as const).map((t) => {
        const Icon = TOOL_ICONS[t];
        return (
          <Button
            key={t}
            variant={tool === t ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label={TOOL_LABELS[t]()}
            onClick={() => onToolChange(t)}
          >
            <Icon />
          </Button>
        );
      })}

      <label className="ms-1 flex items-center gap-1">
        <span className="sr-only">{m.studioDrawColorLabel()}</span>
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </label>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={m.studioDrawUndo()}
        disabled={!canUndo}
        onClick={onUndo}
      >
        <Undo2 />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={m.studioDrawClear()}
        disabled={!canUndo}
        onClick={onClear}
      >
        <Trash2 />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="default"
              size="sm"
              className="ms-2"
              disabled={sending}
            >
              <Send />{" "}
              {sending ? m.studioDrawSending() : m.studioDrawSendButton()}
            </Button>
          }
        />
        <PopoverContent align="end">
          <Textarea
            placeholder={defaultPrompt}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
          <Button
            className="self-end"
            disabled={sending}
            onClick={() => {
              onSend(text.trim());
              setText("");
              setOpen(false);
            }}
          >
            {sending ? m.studioDrawSending() : m.studioDrawSendButton()}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
