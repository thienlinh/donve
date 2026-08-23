import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

import { updateOrgSettings } from "../api";
import { orgSettingsKeys } from "../query-keys";

/** FR-B-24 — the four brand tokens fed into `packages/studio-ai`'s prompt compiler
 * (key-agnostic, just serialized as `key: value` lines), kept deliberately minimal
 * since the target user reasons in "our colors + our fonts", not a full token system. */
const brandKitDefaults = {
  primaryColor: "#2563eb",
  secondaryColor: "#7c3aed",
  headingFont: "Inter",
  bodyFont: "Inter"
};

/** Curated, professional, Google-Fonts-safe names — the AI only needs the font
 * name as a token to reference in generated CSS, not an actual loaded font. */
const brandKitFontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Merriweather",
  "Playfair Display",
  "Nunito"
];

export function BrandKitCard({
  designTokens
}: {
  designTokens: Record<string, string>;
}) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (next: Record<string, string>) =>
      updateOrgSettings({ designTokens: next }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orgSettingsKeys.all() }),
    onError: () =>
      toast.add({ title: m.settingsSaveErrorToast(), type: "error" })
  });

  const primaryColor =
    designTokens.primaryColor ?? brandKitDefaults.primaryColor;
  const secondaryColor =
    designTokens.secondaryColor ?? brandKitDefaults.secondaryColor;
  const headingFont = designTokens.headingFont ?? brandKitDefaults.headingFont;
  const bodyFont = designTokens.bodyFont ?? brandKitDefaults.bodyFont;

  // Settings PATCH replaces `designTokens` wholesale rather than deep-merging
  // (see organizations/routes.ts), so every field save must resend all four keys.
  const save = (key: string, value: string) =>
    update.mutate({
      primaryColor,
      secondaryColor,
      headingFont,
      bodyFont,
      [key]: value
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.settingsBrandKitTitle()}</CardTitle>
        <CardDescription>{m.settingsBrandKitDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <BrandColorField
            key={`primary-${primaryColor}`}
            id="brand-primary-color"
            label={m.settingsBrandPrimaryColorLabel()}
            value={primaryColor}
            disabled={update.isPending}
            onCommit={(v) => save("primaryColor", v)}
          />
          <BrandColorField
            key={`secondary-${secondaryColor}`}
            id="brand-secondary-color"
            label={m.settingsBrandSecondaryColorLabel()}
            value={secondaryColor}
            disabled={update.isPending}
            onCommit={(v) => save("secondaryColor", v)}
          />
          <BrandFontField
            id="brand-heading-font"
            label={m.settingsBrandHeadingFontLabel()}
            value={headingFont}
            disabled={update.isPending}
            onChange={(v) => save("headingFont", v)}
          />
          <BrandFontField
            id="brand-body-font"
            label={m.settingsBrandBodyFontLabel()}
            value={bodyFont}
            disabled={update.isPending}
            onChange={(v) => save("bodyFont", v)}
          />
        </div>

        <BrandKitPreview
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          headingFont={headingFont}
          bodyFont={bodyFont}
        />
      </CardContent>
    </Card>
  );
}

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function BrandColorField({
  id,
  label,
  value,
  disabled,
  onCommit
}: {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          value={draft}
          disabled={disabled}
          onChange={(e) => {
            setDraft(e.target.value);
            onCommit(e.target.value);
          }}
          className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
        />
        <Input
          value={draft}
          disabled={disabled}
          className="max-w-28"
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

function BrandFontField({
  id,
  label,
  value,
  disabled,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <NativeSelect
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {brandKitFontOptions.map((font) => (
          <NativeSelectOption key={font} value={font}>
            {font}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

function BrandKitPreview({
  primaryColor,
  secondaryColor,
  headingFont,
  bodyFont
}: {
  primaryColor: string;
  secondaryColor: string;
  headingFont: string;
  bodyFont: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="flex gap-1">
        <div
          className="size-8 rounded-md"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="size-8 rounded-md"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>
      <div className="text-sm">
        <p className="font-semibold" style={{ fontFamily: headingFont }}>
          {headingFont}
        </p>
        <p className="text-muted-foreground" style={{ fontFamily: bodyFont }}>
          {bodyFont}
        </p>
      </div>
    </div>
  );
}
