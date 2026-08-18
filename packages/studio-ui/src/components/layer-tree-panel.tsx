import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@dv/ui/components/shadcn/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@dv/ui/components/shadcn/collapsible";
import { cn } from "@dv/ui/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  PencilIcon
} from "lucide-react";
import * as React from "react";

export type LayerKind = "text" | "image" | "section";

export type LayerNode = {
  srcmapId: string;
  name: string;
  kind: LayerKind;
  hidden?: boolean;
  /** Only for `kind: "image"` layers — real thumbnail instead of the `T` glyph. */
  thumbnailUrl?: string;
};

export type LayerTreePanelProps = {
  layers: LayerNode[];
  selectedId?: string | null;
  hoveredId?: string | null;
  onSelect?: (srcmapId: string) => void;
  onHoverChange?: (srcmapId: string | null) => void;
  onToggleVisibility?: (srcmapId: string, hidden: boolean) => void;
  onRename?: (srcmapId: string, name: string) => void;
  /** Drag-reorder within the same DOM parent (FR-B-19). `beforeSrcmapId` is `null` to append. */
  onReorder?: (srcmapId: string, beforeSrcmapId: string | null) => void;
  footer?: React.ReactNode;
};

// LayerTree virtualizes past this threshold (studio-builder-spec.md §11).
const VIRTUALIZE_THRESHOLD = 100;
const ROW_HEIGHT = 30;

function LayerIcon({ layer }: { layer: LayerNode }) {
  if (layer.kind === "image" && layer.thumbnailUrl) {
    return (
      <img
        src={layer.thumbnailUrl}
        alt=""
        className="size-5 shrink-0 rounded-sm object-cover"
      />
    );
  }
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-muted text-xs font-medium text-muted-foreground">
      {layer.kind === "text" ? "T" : layer.kind === "image" ? "I" : "S"}
    </span>
  );
}

type DragHandleProps = {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
};

function LayerRow({
  layer,
  isSelected,
  isHovered,
  onSelect,
  onHoverChange,
  onToggleVisibility,
  onRename,
  dragHandleProps
}: {
  layer: LayerNode;
  isSelected: boolean;
  isHovered: boolean;
  onSelect?: (id: string) => void;
  onHoverChange?: (id: string | null) => void;
  onToggleVisibility?: (id: string, hidden: boolean) => void;
  onRename?: (id: string, name: string) => void;
  dragHandleProps?: DragHandleProps;
}) {
  const [editingName, setEditingName] = React.useState<string | null>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);

  // FR-B-09: selecting on the canvas scrolls the matching LayerTree row into view.
  React.useEffect(() => {
    if (isSelected) rowRef.current?.scrollIntoView({ block: "nearest" });
  }, [isSelected]);

  function commitRename() {
    if (
      editingName !== null &&
      editingName.trim() &&
      editingName !== layer.name
    ) {
      onRename?.(layer.srcmapId, editingName.trim());
    }
    setEditingName(null);
  }

  return (
    <div
      ref={rowRef}
      className={cn(
        "group/layer-row flex items-center gap-2 rounded-md px-1.5 py-1 text-sm",
        isSelected && "bg-accent text-accent-foreground",
        isHovered && !isSelected && "bg-muted"
      )}
      onMouseEnter={() => onHoverChange?.(layer.srcmapId)}
      onMouseLeave={() => onHoverChange?.(null)}
    >
      {dragHandleProps && (
        <button
          type="button"
          aria-label="Reorder layer"
          className="shrink-0 cursor-grab touch-none text-muted-foreground opacity-0 group-hover/layer-row:opacity-100 hover:text-foreground active:cursor-grabbing"
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
        >
          <GripVerticalIcon className="size-3.5" />
        </button>
      )}

      <button
        type="button"
        aria-label={layer.hidden ? "Show layer" : "Hide layer"}
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => onToggleVisibility?.(layer.srcmapId, !layer.hidden)}
      >
        {layer.hidden ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>

      <LayerIcon layer={layer} />

      {editingName !== null ? (
        <input
          ref={(el) => el?.focus()}
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") setEditingName(null);
          }}
          className="w-full min-w-0 flex-1 rounded-sm bg-background px-1 ring-1 ring-ring outline-none"
        />
      ) : (
        <button
          type="button"
          className={cn(
            "min-w-0 flex-1 truncate text-start",
            layer.hidden && "text-muted-foreground line-through"
          )}
          onClick={() => onSelect?.(layer.srcmapId)}
          onDoubleClick={() => setEditingName(layer.name)}
        >
          {layer.name}
        </button>
      )}

      {onRename && editingName === null && (
        <button
          type="button"
          aria-label="Rename layer"
          className="shrink-0 text-muted-foreground opacity-0 group-hover/layer-row:opacity-100 hover:text-foreground"
          onClick={() => setEditingName(layer.name)}
        >
          <PencilIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

type RowListProps = {
  layers: LayerNode[];
  selectedId?: string | null;
  hoveredId?: string | null;
  onSelect?: (id: string) => void;
  onHoverChange?: (id: string | null) => void;
  onToggleVisibility?: (id: string, hidden: boolean) => void;
  onRename?: (id: string, name: string) => void;
};

function SortableLayerRow({
  layer,
  ...rest
}: { layer: LayerNode } & Omit<RowListProps, "layers">) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: layer.srcmapId });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "z-10 opacity-50")}
    >
      <LayerRow
        layer={layer}
        isSelected={layer.srcmapId === rest.selectedId}
        isHovered={layer.srcmapId === rest.hoveredId}
        onSelect={rest.onSelect}
        onHoverChange={rest.onHoverChange}
        onToggleVisibility={rest.onToggleVisibility}
        onRename={rest.onRename}
        dragHandleProps={{ attributes, listeners }}
      />
    </div>
  );
}

/** Drag-reorder path (FR-B-19) — only reachable below the virtualize threshold. */
function ReorderableLayerList({
  layers,
  onReorder,
  ...rest
}: RowListProps & {
  onReorder: (id: string, beforeId: string | null) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const itemIds = React.useMemo(() => layers.map((l) => l.srcmapId), [layers]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = layers.findIndex((l) => l.srcmapId === active.id);
    const newIndex = layers.findIndex((l) => l.srcmapId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(layers, oldIndex, newIndex);
    const draggedIndex = reordered.findIndex((l) => l.srcmapId === active.id);
    // The panel lists layers topmost-first (paint order), the reverse of DOM sibling
    // order — so the new DOM predecessor is whichever layer now sits just *above* it here.
    const beforeSrcmapId = reordered[draggedIndex - 1]?.srcmapId ?? null;
    onReorder(String(active.id), beforeSrcmapId);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {layers.map((layer) => (
          <SortableLayerRow key={layer.srcmapId} layer={layer} {...rest} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function PlainLayerList({ layers, ...rest }: RowListProps) {
  return (
    <>
      {layers.map((layer) => (
        <LayerRow
          key={layer.srcmapId}
          layer={layer}
          isSelected={layer.srcmapId === rest.selectedId}
          isHovered={layer.srcmapId === rest.hoveredId}
          onSelect={rest.onSelect}
          onHoverChange={rest.onHoverChange}
          onToggleVisibility={rest.onToggleVisibility}
          onRename={rest.onRename}
        />
      ))}
    </>
  );
}

// ponytail: drag-reorder is skipped past the virtualize threshold — combining dnd-kit
// sortable with a virtualized window is real complexity for a case (500+ layer pages)
// this product doesn't have yet. Upgrade when that combination is actually requested.
function VirtualizedLayerList({ layers, ...rest }: RowListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: layers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12
  });

  // `LayerRow`'s own scrollIntoView effect only fires for rows the virtualizer
  // currently renders — selecting an off-screen element on the canvas would
  // otherwise never scroll a >100-layer tree to it.
  const selectedId = rest.selectedId;
  React.useEffect(() => {
    if (!selectedId) return;
    const index = layers.findIndex((l) => l.srcmapId === selectedId);
    if (index !== -1) virtualizer.scrollToIndex(index, { align: "auto" });
  }, [selectedId, layers, virtualizer]);

  return (
    <div ref={parentRef} className="min-h-0 flex-1 overflow-y-auto px-1.5">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const layer = layers[virtualRow.index]!;
          return (
            <div
              key={layer.srcmapId}
              className="absolute inset-x-0"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <LayerRow
                layer={layer}
                isSelected={layer.srcmapId === rest.selectedId}
                isHovered={layer.srcmapId === rest.hoveredId}
                onSelect={rest.onSelect}
                onHoverChange={rest.onHoverChange}
                onToggleVisibility={rest.onToggleVisibility}
                onRename={rest.onRename}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Flat layer list synced with the canvas selection/hover state (studio-builder-spec.md §8). */
export function LayerTreePanel({
  layers,
  selectedId,
  hoveredId,
  onSelect,
  onHoverChange,
  onToggleVisibility,
  onRename,
  onReorder,
  footer
}: LayerTreePanelProps) {
  const virtualized = layers.length > VIRTUALIZE_THRESHOLD;
  const rowListProps = {
    layers,
    selectedId,
    hoveredId,
    onSelect,
    onHoverChange,
    onToggleVisibility,
    onRename
  };

  return (
    <Collapsible defaultOpen className="flex h-full flex-col">
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Layers
          </span>
          <Badge variant="secondary">{layers.length}</Badge>
        </div>
        <CollapsibleTrigger className="text-muted-foreground hover:text-foreground">
          <ChevronDownIcon className="size-4" />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="flex min-h-0 flex-1 flex-col">
        {virtualized ? (
          <VirtualizedLayerList {...rowListProps} />
        ) : (
          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-1.5">
            {onReorder ? (
              <ReorderableLayerList {...rowListProps} onReorder={onReorder} />
            ) : (
              <PlainLayerList {...rowListProps} />
            )}
          </div>
        )}
        {footer && (
          <div className="border-t px-2 py-1.5 text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
