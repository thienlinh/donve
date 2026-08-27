import type { StyleProps } from "@dv/studio-catalog";
import type { InspectorProp, InspectorValues } from "@dv/studio-ui";
import { InspectorPanel } from "@dv/studio-ui";
import { createUsePuck } from "@puckeditor/core";
import { InfoIcon } from "lucide-react";

// A bare `usePuck()` subscribes to the whole app state (re-rendering on every pointer move),
// same reasoning as `studio-native-page.tsx`'s own `useTypedPuck` — this only ever needs the
// three methods below, not live state.
const useTypedPuck = createUsePuck();

/** Matches `Overrides["fields"]`'s `itemSelector` prop shape — not imported from
 * `@puckeditor/core` directly since that internal `ItemSelector` type isn't part of the
 * package's public export list (only `PuckApi`'s methods that consume/produce it are). */
type FieldsItemSelector = { index: number; zone?: string };

/** `StyleProps` (stored) keeps whatever CSS-ready value `InspectorPanel.onCommit` produced (a
 * unit-suffixed string like `"16px"` for most numeric fields — see `NumberValue`'s own doc
 * comment). `InspectorValues` (display, what `values` re-seeds each field's draft from) expects
 * the bare number back for those same fields, or `NumberValue`'s `formatViNumber` gets a string
 * and renders garbage. Only the numeric-with-unit fields need stripping — `opacity`/`line-height`
 * already come back as bare numbers (their `NumberValue` uses `suffix=""`), and every other field
 * is already a plain string in both directions. */
const UNIT_SUFFIXED_KEYS = new Set<keyof InspectorValues>([
  "font-size",
  "letter-spacing",
  "width",
  "height",
  "max-width",
  "min-height",
  "padding",
  "margin",
  "border-width",
  "border-radius"
]);

function toDisplayValues(style: StyleProps): InspectorValues {
  const display: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined) continue;
    if (UNIT_SUFFIXED_KEYS.has(key as keyof InspectorValues)) {
      const parsed =
        typeof value === "number" ? value : Number.parseFloat(value);
      if (!Number.isNaN(parsed)) display[key] = parsed;
    } else {
      display[key] = value;
    }
  }
  return display;
}

/** One-line orientation for a tab that's new and has no other explanation anywhere in the UI —
 * kept to a single always-visible line (no dismiss state) since `SettingsTab` itself remounts on
 * every field commit (see the `fieldsTab` comment in `studio-native-page.tsx`); a "dismissed"
 * flag here would need lifting to that same parent for the same reason and isn't worth it for
 * one line of text. Per-field guidance instead lives as a hover tooltip on each field
 * (`InspectorPanel`'s `FieldBox` `hint` prop). */
function SettingsGuide() {
  return (
    <div className="flex shrink-0 items-start gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
      <span>
        Chỉnh style CSS cho khối đang chọn — thay đổi áp dụng ngay trên canvas
        và được lưu cùng nội dung trang. Di chuột vào từng nhãn để xem thuộc
        tính đó làm gì.
      </span>
    </div>
  );
}

/**
 * "Cài đặt" tab body — the Settings-tab counterpart to Puck's own auto-generated "Nội dung"
 * fields (see `overrides.fields` in `studio-native-page.tsx`). Reuses `InspectorPanel` as-is
 * (`@dv/studio-ui`, the same GrapesJS-style panel the legacy srcmap editor already uses) rather
 * than building a second one — it was already fully decoupled from srcmap internals.
 */
export function SettingsTab({
  itemSelector
}: {
  itemSelector: FieldsItemSelector | null;
}) {
  const getItemBySelector = useTypedPuck((s) => s.getItemBySelector);
  const getSelectorForId = useTypedPuck((s) => s.getSelectorForId);
  const dispatch = useTypedPuck((s) => s.dispatch);
  const item = itemSelector ? getItemBySelector(itemSelector) : undefined;

  if (!item) {
    return (
      <div className="flex h-full flex-col">
        <SettingsGuide />
        <p className="p-4 text-sm text-muted-foreground">
          Chọn một khối trên canvas để chỉnh cài đặt.
        </p>
      </div>
    );
  }

  const style = (item.props.style ?? {}) as StyleProps;

  function onCommit(prop: InspectorProp, value: string | number | null) {
    if (!item) return;
    const selector = getSelectorForId(item.props.id);
    if (!selector) return;
    const nextStyle: StyleProps = { ...style, [prop]: value ?? undefined };
    dispatch({
      type: "replace",
      destinationIndex: selector.index,
      destinationZone: selector.zone,
      data: { ...item, props: { ...item.props, style: nextStyle } }
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SettingsGuide />
      <div className="min-h-0 flex-1">
        <InspectorPanel
          key={item.props.id}
          values={toDisplayValues(style)}
          onCommit={onCommit}
        />
      </div>
    </div>
  );
}
