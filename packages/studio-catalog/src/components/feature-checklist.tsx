// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const featureChecklistVariantValues = [
  "two_column",
  "three_column"
] as const;

const featureChecklistItemSchema = z.object({
  label: z.string()
});

export const featureChecklistPropsSchema = z.object({
  heading: z.string().optional(),
  subheading: z.string().optional(),
  items: z.array(featureChecklistItemSchema).min(4).max(8),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  variant: z.enum(featureChecklistVariantValues)
});
export type FeatureChecklistProps = z.infer<typeof featureChecklistPropsSchema>;

export function FeatureChecklistRender({
  props
}: BaseComponentProps<FeatureChecklistProps>) {
  return (
    <section
      data-lp-component="feature_checklist"
      data-lp-variant={props.variant}
      className="px-6 py-16 text-center md:px-12"
    >
      {props.heading ? (
        <h2 className="text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      {props.subheading ? (
        <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--lp-color-muted)]">
          {props.subheading}
        </p>
      ) : null}
      <div
        className={
          (props.variant === "three_column"
            ? "sm:grid-cols-3 "
            : "sm:grid-cols-2 ") +
          "mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 text-left"
        }
      >
        {props.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-[var(--lp-radius)] bg-[var(--lp-color-surface)] p-4"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[var(--lp-color-primary)]"
            >
              ✓
            </span>
            <span className="font-[family-name:var(--lp-font-body)] font-medium text-[var(--lp-color-foreground)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {props.ctaHref ? (
        <div className="mt-16">
          <a
            href={props.ctaHref}
            {...trackAttr("cta_clicked")}
            className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-8 py-2 text-lg text-[var(--lp-color-primary-foreground)]"
          >
            {props.ctaLabel ?? "Khám phá ngay"}
          </a>
        </div>
      ) : null}
    </section>
  );
}

export const featureChecklistMeta: ComponentMeta = {
  componentId: "feature_checklist",
  category: "Features",
  variants: featureChecklistVariantValues,
  purpose: ["desire"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
