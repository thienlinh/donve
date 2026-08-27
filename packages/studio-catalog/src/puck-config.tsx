import { Dropzone, useUpload } from "@dv/ui/components/upload";
import type { BaseComponentProps } from "@json-render/react";
import type { Config } from "@puckeditor/core";
import type { ReactNode } from "react";

import { applyElementStyle } from "./apply-element-style.js";
import { catalog } from "./catalog.js";
import { AnnouncementBarRender } from "./components/announcement-bar.js";
import { ComparisonTableRender } from "./components/comparison-table.js";
import { CountdownTimerRender } from "./components/countdown-timer.js";
import { CtaBannerRender } from "./components/cta-banner.js";
import { CtaStickyRender } from "./components/cta-sticky.js";
import { DividerRender } from "./components/divider.js";
import { FaqAccordionRender } from "./components/faq-accordion.js";
import { FeatureBentoRender } from "./components/feature-bento.js";
import { FeatureGridRender } from "./components/feature-grid.js";
import { FeatureTabsRender } from "./components/feature-tabs.js";
import { FooterRender } from "./components/footer.js";
import { GalleryRender } from "./components/gallery.js";
import { HeroRender } from "./components/hero.js";
import { HowItWorksRender } from "./components/how-it-works.js";
import { LeadFormRender } from "./components/lead-form.js";
import { LogoWallRender } from "./components/logo-wall.js";
import { MediaRender } from "./components/media.js";
import { MetricProofRender } from "./components/metric-proof.js";
import { NavBarRender } from "./components/nav-bar.js";
import { PricingTableRender } from "./components/pricing-table.js";
import { ProblemStatementRender } from "./components/problem-statement.js";
import { RawHtmlBlockRender } from "./components/raw-html-block.js";
import { RichTextBlockRender } from "./components/rich-text-block.js";
import { SolutionOverviewRender } from "./components/solution-overview.js";
import { SpacerRender } from "./components/spacer.js";
import { TeamGridRender } from "./components/team-grid.js";
import { TestimonialRender } from "./components/testimonial.js";
import { TrustBadgesRender } from "./components/trust-badges.js";
import { exampleProps } from "./example-props.js";
import {
  categoryLabelVi,
  componentLabelVi,
  fieldLabelVi
} from "./field-labels.js";
import { componentMetadata } from "./metadata.js";
import {
  arrayElementSchema,
  enumOptions,
  objectShape,
  unwrapField
} from "./zod-fields.js";

/**
 * Puck's `Field`/`Config` generics are keyed off statically-known component prop types, but
 * this whole module builds both from a runtime walk of each component's Zod schema (same
 * traversal `zod-fields.ts` was already doing for the old hand-built Inspector) — there is no
 * static per-field type to satisfy those generics against, so this file treats Puck's field/
 * config shapes as structurally-typed `any`, same rationale as `zod-fields.ts`'s own header.
 */
// oxlint-disable no-explicit-any -- see file header
type AnyField = any;

const RENDER_BY_ID: Record<
  string,
  (ctx: BaseComponentProps<any>) => ReactNode
> = {
  hero: HeroRender,
  nav_bar: NavBarRender,
  logo_wall: LogoWallRender,
  testimonial: TestimonialRender,
  metric_proof: MetricProofRender,
  problem_statement: ProblemStatementRender,
  solution_overview: SolutionOverviewRender,
  feature_bento: FeatureBentoRender,
  feature_grid: FeatureGridRender,
  feature_tabs: FeatureTabsRender,
  how_it_works: HowItWorksRender,
  pricing_table: PricingTableRender,
  comparison_table: ComparisonTableRender,
  faq_accordion: FaqAccordionRender,
  trust_badges: TrustBadgesRender,
  lead_form: LeadFormRender,
  cta_banner: CtaBannerRender,
  cta_sticky: CtaStickyRender,
  rich_text_block: RichTextBlockRender,
  gallery: GalleryRender,
  media: MediaRender,
  countdown_timer: CountdownTimerRender,
  team_grid: TeamGridRender,
  footer: FooterRender,
  divider: DividerRender,
  spacer: SpacerRender,
  announcement_bar: AnnouncementBarRender,
  raw_html_block: RawHtmlBlockRender
};

/** Puck calls `render` with every prop flattened at the top level (plus an injected `id` and
 * `puck` helper key) — our catalog components expect the json-render `{ props }` wrapper shape
 * instead, so this adapts the call signature once, generically, rather than touching any of the
 * 26 component files. */
function toPuckRender(Render: (ctx: BaseComponentProps<any>) => ReactNode) {
  return function PuckRenderAdapter(allProps: AnyField): ReactNode {
    const { id: _id, puck: _puck, editMode: _editMode, ...props } = allProps;
    // Published/edited markup is static SSR-first output — no component reads `emit`/`on`, but
    // BaseComponentProps requires them, so these are unused no-op stubs.
    const rendered = Render({
      props,
      emit: () => undefined,
      on: () => ({}) as AnyField
    });
    return applyElementStyle(rendered, props.style);
  };
}

/** Keeps the existing comma-separated-string UX for `string[]` props (nav links' hrefs aside —
 * those are arrays of objects and go through the native `array` field below) — Puck has no
 * built-in field for a bare array of primitives, so this is a small custom field, not a gap. */
function stringArrayField(label: string): AnyField {
  return {
    type: "custom",
    label,
    render: ({
      value,
      onChange
    }: {
      value: string[] | undefined;
      onChange: (next: string[]) => void;
    }) => (
      <input
        type="text"
        defaultValue={(value ?? []).join(", ")}
        placeholder="Ngăn cách bằng dấu phẩy"
        onBlur={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        }
      />
    )
  };
}

/**
 * Uploads one picked file and returns where it can be read back from. Injected by the Studio
 * page shell (`buildPuckConfig({ uploadAsset })`) rather than imported: this package has no
 * `landingPageId`, no API client and no session — it only knows the field shape. Threading it
 * as an option (not React context) keeps `buildPuckConfig` the single place the editor is
 * configured, and Puck already re-reads `config` when it changes identity.
 */
export type UploadAssetFn = (
  file: File
) => Promise<{ url: string; posterUrl?: string }>;

export interface PuckConfigOptions {
  /** Omitted → image/video props degrade to the plain URL text inputs they were before. */
  uploadAsset?: UploadAssetFn;
}

interface AssetValue {
  src?: string;
  alt?: string;
  poster?: string;
}

/** Body of `assetField` — a `<Dropzone>` bound to one `{src, alt}`/`{src, poster}` prop. */
function AssetUploadField({
  value,
  onChange,
  accept,
  uploadAsset,
  withAlt
}: {
  value: AssetValue | undefined;
  onChange: (next: AssetValue) => void;
  accept: string;
  uploadAsset: UploadAssetFn;
  withAlt: boolean;
}) {
  const { upload, isPending, error } = useUpload(uploadAsset, (result) =>
    onChange({
      ...value,
      src: result.url,
      ...(result.posterUrl ? { poster: result.posterUrl } : {})
    })
  );

  return (
    <div className="flex flex-col gap-2">
      <Dropzone
        accept={accept}
        disabled={isPending}
        label={isPending ? "Đang tải lên…" : "Chọn tệp"}
        description="Hoặc kéo thả tệp vào đây"
        onFiles={([file]) => {
          if (file) void upload(file);
        }}
      >
        {value?.src ? (
          <img
            src={value.src}
            alt={value.alt ?? ""}
            // Draft assets are served from the authenticated API origin, not the CDN — the
            // publish pipeline rewrites these URLs to bundled `/assets/*` files.
            crossOrigin="use-credentials"
            className="max-h-32 rounded object-contain"
          />
        ) : null}
      </Dropzone>
      {error ? (
        <p className="text-xs text-destructive">Tải lên thất bại</p>
      ) : null}
      {withAlt ? (
        <input
          type="text"
          defaultValue={value?.alt ?? ""}
          placeholder="Mô tả ảnh (alt)"
          onBlur={(e) => onChange({ ...value, alt: e.target.value })}
        />
      ) : null}
    </div>
  );
}

/** `imagePropsSchema`/`videoPropsSchema`-shaped props — without this they fall through to the
 * generic `object` walker below, which renders raw `src`/`alt` text boxes nobody can fill in
 * by hand (`architecture-and-data-model.md` §Media/Asset point 2). */
function assetField(
  label: string,
  accept: string,
  uploadAsset: UploadAssetFn,
  withAlt: boolean
): AnyField {
  return {
    type: "custom",
    label,
    render: (props: {
      value: AssetValue | undefined;
      onChange: (next: AssetValue) => void;
    }) => (
      <AssetUploadField
        {...props}
        accept={accept}
        uploadAsset={uploadAsset}
        withAlt={withAlt}
      />
    )
  };
}

/** `z.iso.datetime()` props (`countdown_timer.endsAt`) — a raw ISO string typed by hand is
 * unusable, and the browser already has a picker for exactly this. */
function dateTimeField(label: string): AnyField {
  return {
    type: "custom",
    label,
    render: ({
      value,
      onChange
    }: {
      value: string | undefined;
      onChange: (next: string) => void;
    }) => (
      <input
        type="datetime-local"
        defaultValue={toLocalDateTimeValue(value)}
        onChange={(e) => {
          const parsed = new Date(e.target.value);
          if (!Number.isNaN(parsed.getTime())) onChange(parsed.toISOString());
        }}
      />
    )
  };
}

/** ISO instant → the `YYYY-MM-DDTHH:mm` local-time string `datetime-local` expects. */
function toLocalDateTimeValue(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const localMs = date.getTime() - date.getTimezoneOffset() * 60_000;
  return new Date(localMs).toISOString().slice(0, 16);
}

/** Fallback for shapes this walker can't turn into a proper Puck field (e.g. an array of
 * non-object, non-string elements) — same "raw JSON, don't block editing" behavior the old
 * Inspector fell back to. */
function jsonField(label: string): AnyField {
  return {
    type: "custom",
    label: `${label} (JSON)`,
    render: ({
      value,
      onChange
    }: {
      value: unknown;
      onChange: (next: unknown) => void;
    }) => (
      <textarea
        rows={4}
        defaultValue={JSON.stringify(value ?? null, null, 2)}
        onBlur={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // invalid JSON mid-edit — leave the last valid value untouched
          }
        }}
      />
    )
  };
}

function fieldForSchema(
  fieldSchema: AnyField,
  rawKey: string,
  options: PuckConfigOptions
): AnyField {
  const { schema, kind } = unwrapField(fieldSchema);
  const label = fieldLabelVi(rawKey);
  const lowerKey = rawKey.toLowerCase();

  if (kind === "string") {
    if (schema.def?.format === "datetime") return dateTimeField(label);
    const isLong =
      lowerKey.includes("body") ||
      lowerKey.includes("description") ||
      lowerKey.includes("html");
    return { type: isLong ? "textarea" : "text", label };
  }

  if (kind === "number") {
    return { type: "number", label };
  }

  if (kind === "boolean") {
    return {
      type: "radio",
      label,
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false }
      ]
    };
  }

  if (kind === "enum") {
    const options = enumOptions(schema);
    return {
      type: "select",
      label,
      options: options.map((option) => ({ label: option, value: option }))
    };
  }

  if (kind === "object") {
    const shape = objectShape(schema);
    if (!shape) return jsonField(label);
    const assetKind = options.uploadAsset ? assetShapeKind(shape) : null;
    if (assetKind && options.uploadAsset) {
      return assetField(
        label,
        assetKind === "image" ? "image/*" : "video/mp4,video/webm",
        options.uploadAsset,
        assetKind === "image"
      );
    }
    return {
      type: "object",
      label,
      objectFields: buildPuckFields(shape, options)
    };
  }

  if (kind === "array") {
    const elementSchema = arrayElementSchema(schema);
    const elementKind = elementSchema ? unwrapField(elementSchema).kind : null;
    if (elementKind === "string") return stringArrayField(label);
    const elementShape = elementSchema ? objectShape(elementSchema) : null;
    if (!elementShape) return jsonField(label);
    return {
      type: "array",
      label,
      arrayFields: buildPuckFields(elementShape, options)
    };
  }

  return jsonField(label);
}

/** Recognises `imagePropsSchema` (`{src, alt}`) / `videoPropsSchema` (`{src, poster}`) by shape
 * rather than by prop name, so every component reusing them (hero, gallery, logo_wall,
 * team_grid, media, …) gets the upload field without a per-key allowlist to maintain. */
function assetShapeKind(
  shape: Record<string, AnyField>
): "image" | "video" | null {
  const keys = Object.keys(shape).toSorted().join(",");
  if (keys === "alt,src") return "image";
  if (keys === "poster,src") return "video";
  return null;
}

/** Walks a Zod object shape (e.g. a component's props schema, or a nested object/array-item
 * schema) into a Puck `fields` config — the same kind-dispatch the old Inspector's
 * `InspectorField` used, retargeted to emit field descriptors instead of React inputs. */
export function buildPuckFields(
  shape: Record<string, AnyField>,
  options: PuckConfigOptions = {}
): Record<string, AnyField> {
  const fields: Record<string, AnyField> = {};
  for (const [key, fieldSchema] of Object.entries(shape)) {
    fields[key] = fieldForSchema(fieldSchema, key, options);
  }
  return fields;
}

/** Builds a Puck `Config` from the same catalog/registry/metadata every other Studio surface
 * already reads — one source of truth, no separate Puck-only component list to drift. */
export function buildPuckConfig(options: PuckConfigOptions = {}): Config {
  const metaById = new Map(
    componentMetadata.map((meta) => [meta.componentId, meta])
  );
  const components: Record<string, AnyField> = {};
  const categories: Record<string, { components: string[]; title: string }> =
    {};

  for (const componentId of catalog.componentNames) {
    if (componentId === "page_root") continue;
    const render = RENDER_BY_ID[componentId];
    const entry = (catalog.data as AnyField).components[componentId];
    if (!render || !entry) continue;

    components[componentId] = {
      label: componentLabelVi(componentId),
      fields: buildPuckFields(entry.props.shape, options),
      defaultProps: { ...exampleProps[componentId] },
      render: toPuckRender(render)
    };

    const categoryKey = metaById.get(componentId)?.category ?? "Khác";
    categories[categoryKey] ??= {
      components: [],
      title: categoryLabelVi(categoryKey)
    };
    categories[categoryKey].components.push(componentId);
  }

  // Puck's built-in root defaults to a `title` text field — this app's PageSpec has no concept
  // of a root-level field at all (`puckDataToPageSpec` never reads `data.root`, see
  // `puck-adapter.ts`), so that default would render as a dead control that silently does
  // nothing when edited. Declaring an empty root config removes it instead of leaving it there.
  return { components, categories, root: { fields: {} } } as Config;
}
