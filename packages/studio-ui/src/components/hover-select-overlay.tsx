import { Badge } from "@dv/ui/components/shadcn/badge";
import { cn } from "@dv/ui/lib/utils";

export type OverlayTarget = {
  srcmapId: string;
  tag: string;
  /** Already-truncated label text, e.g. first 20 chars of the element's text. */
  text: string;
  /** Screen-space rect — the consumer measures `getBoundingClientRect() × canvas transform`. */
  rect: { top: number; left: number; width: number; height: number };
};

export type HoverSelectOverlayProps = {
  hover?: OverlayTarget | null;
  selected?: OverlayTarget | null;
};

function OverlayBox({
  target,
  variant
}: {
  target: OverlayTarget;
  variant: "hover" | "selected";
}) {
  return (
    <div
      className="absolute"
      style={{
        top: target.rect.top,
        left: target.rect.left,
        width: target.rect.width,
        height: target.rect.height
      }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[2px]",
          variant === "hover"
            ? "border-[1.5px] border-dashed border-primary"
            : "border-2 border-solid border-primary"
        )}
      />
      <Badge
        variant="secondary"
        className="absolute -top-6 left-0 max-w-full gap-1 truncate bg-popover text-popover-foreground shadow-sm"
      >
        {target.tag} [{target.srcmapId}] &ldquo;{target.text}&rdquo;
      </Badge>
    </div>
  );
}

/**
 * Renders hover/select boxes in a layer div outside the iframe (studio-builder-spec.md §4.1/4.3) —
 * this component only draws; the consumer owns hit-testing and rect measurement.
 */
export function HoverSelectOverlay({
  hover,
  selected
}: HoverSelectOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hover && hover.srcmapId !== selected?.srcmapId && (
        <OverlayBox target={hover} variant="hover" />
      )}
      {selected && <OverlayBox target={selected} variant="selected" />}
    </div>
  );
}
