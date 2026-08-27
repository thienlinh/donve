import { XIcon } from "lucide-react";
import * as React from "react";

import { formatViNumber, parseViNumber } from "../lib/vi-number";

/**
 * Keys are literal CSS properties — matches `studio-core`'s `setStyle(srcmapId, prop, value)`
 * payload 1:1 so the consumer can forward a commit straight into an op.
 */
export type InspectorValues = Partial<{
  "font-family": string;
  "font-size": number;
  "font-weight": string;
  color: string;
  "text-align": string;
  "text-transform": string;
  "font-style": string;
  "text-decoration": string;
  "line-height": number;
  "letter-spacing": number;
  width: number;
  height: number;
  "max-width": number;
  "min-height": number;
  opacity: number;
  overflow: string;
  padding: number;
  margin: number;
  "border-width": number;
  "border-color": string;
  "border-radius": number;
  "background-color": string;
  "box-shadow": string;
  display: string;
}>;

export type InspectorProp = keyof InspectorValues;

export type InspectorPanelProps = {
  values: InspectorValues;
  /** Fired on blur/Enter only — never per keystroke (studio-builder-spec.md §5). */
  onCommit: (prop: InspectorProp, value: string | number | null) => void;
  onClose?: () => void;
};

function FieldBox({
  label,
  hint,
  children
}: {
  label: string;
  /** Shown as the native browser tooltip on hover — what this CSS property does and how it
   * shows up on the canvas. Keeps the field row itself uncluttered (no extra icon/affordance)
   * while still answering "what does this do" for someone new to the panel. */
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      title={hint}
      className="flex h-10 items-center justify-between gap-2 rounded-lg border border-input px-2.5 text-sm"
    >
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function TextValue({
  value,
  onCommit,
  suffix
}: {
  value: string | undefined;
  onCommit: (value: string) => void;
  suffix?: string;
}) {
  const [draft, setDraft] = React.useState(value ?? "");

  function commit() {
    if (draft !== (value ?? "")) onCommit(draft);
  }

  return (
    <span className="flex min-w-0 items-center gap-1">
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className="w-full min-w-0 truncate bg-transparent text-end outline-none"
      />
      {suffix && (
        <span className="shrink-0 text-muted-foreground">{suffix}</span>
      )}
    </span>
  );
}

function NumberValue({
  value,
  onCommit,
  suffix = "px"
}: {
  value: number | undefined;
  /**
   * Emits the CSS-ready value: `${n}${suffix}` when this field has a unit
   * (e.g. "400px"), or the bare number when it's a unitless CSS value like
   * `opacity`/`line-height` (those pass `suffix=""`). `setStyle` writes
   * whatever it's given straight into `style.setProperty` — a bare number
   * for a length property (e.g. "400") is an invalid CSS value and gets
   * silently dropped by the browser, so the unit must be attached here.
   */
  onCommit: (value: string | number) => void;
  suffix?: string;
}) {
  const [draft, setDraft] = React.useState(
    value !== undefined ? formatViNumber(value) : ""
  );

  function commit() {
    const parsed = parseViNumber(draft);
    if (parsed !== null && parsed !== value) {
      onCommit(suffix ? `${parsed}${suffix}` : parsed);
    } else {
      setDraft(value !== undefined ? formatViNumber(value) : "");
    }
  }

  return (
    <span className="flex min-w-0 items-center gap-1">
      <input
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className="w-full min-w-0 bg-transparent text-end outline-none"
      />
      {suffix && (
        <span className="shrink-0 text-muted-foreground">{suffix}</span>
      )}
    </span>
  );
}

function SelectValue({
  value,
  options,
  onCommit
}: {
  value: string | undefined;
  options: readonly string[];
  onCommit: (value: string) => void;
}) {
  return (
    <select
      value={value ?? options[0]}
      onChange={(e) => onCommit(e.target.value)}
      className="min-w-0 bg-transparent text-end outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Reading an inline color style back off the DOM never returns what was written: the
// browser's CSSOM canonicalizes `style.color = "#dc2626"` to `rgb(220, 38, 38)` (and
// `readInspectorValues` reads that canonical form) — but the native `<input type="color">`
// rejects anything that isn't `#rrggbb`, silently resetting its swatch to black. Convert
// on the way in; the hex text field next to it is unaffected since it's a plain text input.
function toHexColor(value: string | undefined): string {
  if (!value) return "#000000";
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  const rgb = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!rgb) return "#000000";
  return `#${rgb
    .slice(1, 4)
    .map((c) => Number(c).toString(16).padStart(2, "0"))
    .join("")}`;
}

function ColorValue({
  value,
  onCommit
}: {
  value: string | undefined;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = React.useState(value ?? "");

  function commit() {
    if (draft && draft !== value) onCommit(draft);
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <input
        type="color"
        value={toHexColor(value)}
        onChange={(e) => onCommit(e.target.value)}
        className="size-4 shrink-0 cursor-pointer rounded-sm border border-input bg-transparent p-0"
      />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className="w-full min-w-0 bg-transparent text-end outline-none"
      />
    </span>
  );
}

// Same curated allowlist as `packages/studio-catalog/src/tokens.ts`'s `GOOGLE_FONTS` (kept as a
// literal copy, not an import: `@dv/studio-catalog` already depends on `@dv/studio-ui` for
// `InspectorValues`, so importing back would be a package cycle). This list rarely changes: if
// it does, update both. Only fonts already loaded site-wide via the page's design tokens
// (`fontHeading`/`fontBody`) actually render as chosen here — picking a curated font that isn't
// one of those two loads no stylesheet of its own, same pre-existing gap the free-text field had.
const CURATED_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Work Sans",
  "Nunito",
  "DM Sans",
  "Space Grotesk",
  "Playfair Display",
  "Merriweather"
] as const;
const CUSTOM_FONT_OPTION = "__custom__";

function fontFamilyName(fontStack: string): string {
  return (fontStack.split(",")[0] ?? "").trim();
}

/** Font-family field — a curated dropdown with a "Khác…" escape hatch to free text, matching the
 * same field pattern the "Nội dung" content blocks already use for font pickers (Design tokens
 * panel's `TokenFontField`), so both tabs feel like one consistent editor. */
function FontValue({
  value,
  onCommit
}: {
  value: string | undefined;
  onCommit: (value: string) => void;
}) {
  const currentFamily = fontFamilyName(value ?? "");
  const isCurated = (CURATED_FONTS as readonly string[]).includes(
    currentFamily
  );
  const [customMode, setCustomMode] = React.useState(
    Boolean(value) && !isCurated
  );
  const [draft, setDraft] = React.useState(value ?? "");

  if (customMode) {
    return (
      <span className="flex min-w-0 items-center gap-1">
        <input
          value={draft}
          placeholder="Georgia, serif"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft !== (value ?? "")) onCommit(draft);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-full min-w-0 truncate bg-transparent text-end outline-none"
        />
      </span>
    );
  }

  return (
    <select
      value={isCurated ? currentFamily : ""}
      onChange={(e) => {
        if (e.target.value === CUSTOM_FONT_OPTION) {
          setCustomMode(true);
          setDraft(value ?? "");
          return;
        }
        onCommit(e.target.value);
      }}
      className="min-w-0 bg-transparent text-end outline-none"
    >
      <option value="" disabled>
        {" "}
      </option>
      {CURATED_FONTS.map((font) => (
        <option key={font} value={font}>
          {font}
        </option>
      ))}
      <option value={CUSTOM_FONT_OPTION}>Khác…</option>
    </select>
  );
}

const ALIGN_OPTIONS = ["left", "center", "right", "justify"] as const;
const CASE_OPTIONS = ["none", "uppercase", "lowercase", "capitalize"] as const;
const STYLE_OPTIONS = ["normal", "italic"] as const;
const DECORATION_OPTIONS = ["none", "underline", "line-through"] as const;
const OVERFLOW_OPTIONS = ["visible", "hidden", "auto", "scroll"] as const;
const WEIGHT_OPTIONS = ["normal", "medium", "semibold", "bold"] as const;
const DISPLAY_OPTIONS = ["block", "none"] as const;

/**
 * Edit-mode inspector — grouped TYPOGRAPHY/SIZE/BOX fields (studio-builder-spec.md §5, screenshot #3).
 * Fields hold local draft state and only call `onCommit` on blur/Enter. When the selected element
 * changes, render with `key={selectedSrcmapId}` so React remounts (and re-seeds) every field at once.
 */
export function InspectorPanel({
  values,
  onCommit,
  onClose
}: InspectorPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Edit
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Typography
        </h3>
        <FieldBox
          label="Font"
          hint="Phông chữ của khối. Chỉ hiển thị đúng nếu phông đã được tải sẵn cho trang (theo Design tokens) — chọn phông khác có thể không đổi giao diện."
        >
          <FontValue
            value={values["font-family"]}
            onCommit={(v) => onCommit("font-family", v)}
          />
        </FieldBox>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox label="Size" hint="Cỡ chữ, tính bằng px.">
            <NumberValue
              value={values["font-size"]}
              onCommit={(v) => onCommit("font-size", v)}
            />
          </FieldBox>
          <FieldBox label="Weight" hint="Độ đậm của chữ.">
            <SelectValue
              value={values["font-weight"]}
              options={WEIGHT_OPTIONS}
              onCommit={(v) => onCommit("font-weight", v)}
            />
          </FieldBox>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox label="Color" hint="Màu chữ.">
            <ColorValue
              value={values.color}
              onCommit={(v) => onCommit("color", v)}
            />
          </FieldBox>
          <FieldBox
            label="Align"
            hint="Căn lề văn bản (trái/giữa/phải/đều hai bên)."
          >
            <SelectValue
              value={values["text-align"]}
              options={ALIGN_OPTIONS}
              onCommit={(v) => onCommit("text-align", v)}
            />
          </FieldBox>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox
            label="Case"
            hint="Chuyển chữ hoa/thường tự động khi hiển thị, không đổi nội dung đã nhập."
          >
            <SelectValue
              value={values["text-transform"]}
              options={CASE_OPTIONS}
              onCommit={(v) => onCommit("text-transform", v)}
            />
          </FieldBox>
          <FieldBox label="Style" hint="Chữ nghiêng (italic) hay chữ đứng.">
            <SelectValue
              value={values["font-style"]}
              options={STYLE_OPTIONS}
              onCommit={(v) => onCommit("font-style", v)}
            />
          </FieldBox>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox label="Decoration" hint="Gạch chân hoặc gạch ngang chữ.">
            <SelectValue
              value={values["text-decoration"]}
              options={DECORATION_OPTIONS}
              onCommit={(v) => onCommit("text-decoration", v)}
            />
          </FieldBox>
          <FieldBox
            label="Line"
            hint="Chiều cao dòng — khoảng cách giữa các dòng văn bản, tính theo bội số cỡ chữ (ví dụ 1.5)."
          >
            <NumberValue
              value={values["line-height"]}
              onCommit={(v) => onCommit("line-height", v)}
              suffix=""
            />
          </FieldBox>
        </div>
        <FieldBox
          label="Tracking"
          hint="Khoảng cách giữa các ký tự (letter-spacing), tính bằng px."
        >
          <NumberValue
            value={values["letter-spacing"]}
            onCommit={(v) => onCommit("letter-spacing", v)}
          />
        </FieldBox>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Size
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox
            label="Width"
            hint="Chiều rộng cố định của khối, tính bằng px."
          >
            <NumberValue
              value={values.width}
              onCommit={(v) => onCommit("width", v)}
            />
          </FieldBox>
          <FieldBox
            label="Height"
            hint="Chiều cao cố định của khối, tính bằng px."
          >
            <NumberValue
              value={values.height}
              onCommit={(v) => onCommit("height", v)}
            />
          </FieldBox>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox
            label="Max width"
            hint="Chiều rộng tối đa — khối không nới rộng quá giá trị này dù màn hình rộng hơn."
          >
            <NumberValue
              value={values["max-width"]}
              onCommit={(v) => onCommit("max-width", v)}
            />
          </FieldBox>
          <FieldBox
            label="Min height"
            hint="Chiều cao tối thiểu — khối không co lại thấp hơn giá trị này."
          >
            <NumberValue
              value={values["min-height"]}
              onCommit={(v) => onCommit("min-height", v)}
            />
          </FieldBox>
        </div>
        <FieldBox
          label="Display"
          hint="'none' ẩn hoàn toàn khối này khỏi trang (vẫn còn trong nội dung, chỉ không hiển thị)."
        >
          <SelectValue
            value={values.display}
            options={DISPLAY_OPTIONS}
            onCommit={(v) => onCommit("display", v)}
          />
        </FieldBox>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Box
        </h3>
        <FieldBox
          label="Opacity"
          hint="Độ trong suốt của khối, từ 0 (ẩn) đến 1 (hiện rõ hoàn toàn)."
        >
          <NumberValue
            value={values.opacity}
            onCommit={(v) => onCommit("opacity", v)}
            suffix=""
          />
        </FieldBox>
        <FieldBox
          label="Overflow"
          hint="Nội dung tràn ra ngoài khối sẽ bị cắt, cuộn, hay vẫn hiển thị ra ngoài."
        >
          <SelectValue
            value={values.overflow}
            options={OVERFLOW_OPTIONS}
            onCommit={(v) => onCommit("overflow", v)}
          />
        </FieldBox>
        <FieldBox label="Background" hint="Màu nền của khối.">
          <ColorValue
            value={values["background-color"]}
            onCommit={(v) => onCommit("background-color", v)}
          />
        </FieldBox>
        <FieldBox
          label="Padding"
          hint="Khoảng đệm bên trong khối, giữa viền và nội dung."
        >
          <NumberValue
            value={values.padding}
            onCommit={(v) => onCommit("padding", v)}
          />
        </FieldBox>
        <FieldBox
          label="Margin"
          hint="Khoảng cách bên ngoài khối, với các khối xung quanh."
        >
          <NumberValue
            value={values.margin}
            onCommit={(v) => onCommit("margin", v)}
          />
        </FieldBox>
        <div className="grid grid-cols-2 gap-2">
          <FieldBox label="Border" hint="Độ dày viền, tính bằng px.">
            <NumberValue
              value={values["border-width"]}
              onCommit={(v) => onCommit("border-width", v)}
            />
          </FieldBox>
          <FieldBox label="BColor" hint="Màu viền.">
            <ColorValue
              value={values["border-color"]}
              onCommit={(v) => onCommit("border-color", v)}
            />
          </FieldBox>
        </div>
        <FieldBox label="Radius" hint="Độ bo góc, tính bằng px.">
          <NumberValue
            value={values["border-radius"]}
            onCommit={(v) => onCommit("border-radius", v)}
          />
        </FieldBox>
        <FieldBox
          label="Shadow"
          hint={
            'Đổ bóng cho khối — nhập nguyên giá trị CSS box-shadow, ví dụ "0 4px 12px rgba(0,0,0,0.15)".'
          }
        >
          <TextValue
            value={values["box-shadow"]}
            onCommit={(v) => onCommit("box-shadow", v)}
          />
        </FieldBox>
      </section>
    </div>
  );
}
