import type { DesignTokens } from "@dv/contracts";
import { DEFAULT_DESIGN_TOKENS, GOOGLE_FONTS } from "@dv/studio-catalog";
import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@dv/ui/components/shadcn/sheet";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

const colorFields: { key: keyof DesignTokens; label: () => string }[] = [
  { key: "colorPrimary", label: m.studioTokensColorPrimaryLabel },
  {
    key: "colorPrimaryForeground",
    label: m.studioTokensColorPrimaryForegroundLabel
  },
  { key: "colorAccent", label: m.studioTokensColorAccentLabel },
  {
    key: "colorAccentForeground",
    label: m.studioTokensColorAccentForegroundLabel
  },
  { key: "colorSurface", label: m.studioTokensColorSurfaceLabel },
  { key: "colorForeground", label: m.studioTokensColorForegroundLabel },
  { key: "colorMuted", label: m.studioTokensColorMutedLabel },
  { key: "colorBorder", label: m.studioTokensColorBorderLabel }
];

const fontFields: { key: "fontHeading" | "fontBody"; label: () => string }[] = [
  { key: "fontHeading", label: m.studioTokensFontHeadingLabel },
  { key: "fontBody", label: m.studioTokensFontBodyLabel }
];

/**
 * Design tokens tab — edits the `DesignTokens` fields (`packages/contracts/src/studio.ts`) that
 * back every `--lp-*` CSS var a catalog component renders with (`designTokensToCss`), plus which
 * Google Font (if any) `packages/studio-render`'s `renderPageArtifact` loads on the published
 * page (`googleFontsHref`). Same pattern as `SeoPanel`: edits land in the in-memory document
 * only, the Studio's own Save button persists them with the rest of the page — no mutation of
 * its own. Per-page, not a shared org-level token set: `tokens` already lives on
 * `pageVersions.spec`, one page can look different from another by design.
 */
export function DesignTokensPanel({
  open,
  onOpenChange,
  tokens,
  onChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: DesignTokens;
  onChange: (next: DesignTokens) => void;
}) {
  function patch(fields: Partial<DesignTokens>) {
    onChange({ ...tokens, ...fields });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{m.studioTokensPanelTitle()}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => onChange(DEFAULT_DESIGN_TOKENS)}
          >
            <RotateCcw /> {m.studioTokensResetButton()}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            {colorFields.map(({ key, label }) => (
              <TokenColorField
                // Remounts (fresh `draft` seeded from the new `value`) whenever the token
                // changes from outside this field's own commit — e.g. "Reset to default" —
                // instead of a prop-mirroring effect (`react-doctor/no-mirror-prop-effect`).
                // A commit through `onCommit` updates `tokens[key]` to the exact value `draft`
                // already holds, so this never remounts mid-typing, only after a commit lands.
                key={`${key}:${tokens[key]}`}
                id={`token-${key}`}
                label={label()}
                value={tokens[key]}
                onCommit={(value) => patch({ [key]: value })}
              />
            ))}
          </div>

          {fontFields.map(({ key, label }) => (
            <TokenFontField
              key={`${key}:${tokens[key]}`}
              id={`token-${key}`}
              label={label()}
              value={tokens[key]}
              onCommit={(value) => patch({ [key]: value })}
            />
          ))}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="token-radius">{m.studioTokensRadiusLabel()}</Label>
            <Input
              id="token-radius"
              value={tokens.radius}
              onChange={(e) => patch({ radius: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              {m.studioTokensRadiusHint()}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function TokenColorField({
  id,
  label,
  value,
  onCommit
}: {
  id: string;
  label: string;
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          value={hexColorPattern.test(draft) ? draft : "#000000"}
          onChange={(e) => {
            setDraft(e.target.value);
            onCommit(e.target.value);
          }}
          className="h-8 w-9 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
        />
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (hexColorPattern.test(draft)) onCommit(draft);
            else setDraft(value);
          }}
        />
      </div>
    </div>
  );
}

const CUSTOM_FONT_VALUE = "__custom__";

/** First segment of a CSS font stack, e.g. `"Playfair Display, serif"` → `"Playfair Display"`. */
function fontFamilyName(fontStack: string): string {
  return (fontStack.split(",")[0] ?? "").trim();
}

/**
 * Curated Google Font picker with a "Khác" (custom) escape hatch to the full free-text stack —
 * matches `googleFontsHref`'s own allowlist (`packages/studio-catalog/src/tokens.ts`) 1:1, so
 * every option this dropdown offers is guaranteed to actually load on the published page.
 */
function TokenFontField({
  id,
  label,
  value,
  onCommit
}: {
  id: string;
  label: string;
  value: string;
  onCommit: (value: string) => void;
}) {
  const currentFamily = fontFamilyName(value);
  const isCurated = (GOOGLE_FONTS as readonly string[]).includes(currentFamily);
  const [customMode, setCustomMode] = useState(!isCurated);
  const [draft, setDraft] = useState(value);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <NativeSelect
        id={id}
        value={customMode ? CUSTOM_FONT_VALUE : currentFamily}
        onChange={(e) => {
          if (e.target.value === CUSTOM_FONT_VALUE) {
            setCustomMode(true);
            return;
          }
          setCustomMode(false);
          onCommit(`${e.target.value}, sans-serif`);
        }}
      >
        {GOOGLE_FONTS.map((font) => (
          <NativeSelectOption key={font} value={font}>
            {font}
          </NativeSelectOption>
        ))}
        <NativeSelectOption value={CUSTOM_FONT_VALUE}>
          {m.studioTokensFontCustomOption()}
        </NativeSelectOption>
      </NativeSelect>
      {customMode ? (
        <Input
          value={draft}
          placeholder="Georgia, serif"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onCommit(draft)}
        />
      ) : null}
    </div>
  );
}
