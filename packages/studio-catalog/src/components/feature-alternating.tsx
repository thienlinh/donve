// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const featureAlternatingVariantValues = [
  "with_divider",
  "no_divider"
] as const;

const featureAlternatingItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconName: z.string().optional()
});

export const featureAlternatingPropsSchema = z.object({
  items: z.array(featureAlternatingItemSchema).min(2).max(5),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  variant: z.enum(featureAlternatingVariantValues)
});
export type FeatureAlternatingProps = z.infer<
  typeof featureAlternatingPropsSchema
>;

export function FeatureAlternatingRender({
  props
}: BaseComponentProps<FeatureAlternatingProps>) {
  const withDivider = props.variant === "with_divider";
  return (
    <section
      data-lp-component="feature_alternating"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      <div className="mx-auto flex max-w-3xl flex-col">
        {props.items.map((item, index) => {
          const iconOnRight = index % 2 === 1;
          return (
            <div
              key={index}
              className={
                (withDivider && index < props.items.length - 1
                  ? "mb-10 border-b border-[var(--lp-color-border)] pb-10 "
                  : "mb-10 ") +
                "flex flex-col items-center sm:flex-row sm:items-center"
              }
            >
              <div
                className={
                  (iconOnRight
                    ? "order-first sm:order-none sm:ml-10"
                    : "sm:mr-10") +
                  " h-20 w-20 flex-shrink-0 rounded-full bg-[var(--lp-color-accent)] text-[var(--lp-color-accent-foreground)] sm:h-32 sm:w-32"
                }
              >
                <span
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center text-2xl"
                >
                  {item.iconName ?? "✦"}
                </span>
              </div>
              <div className="mt-6 flex-grow text-center sm:mt-0 sm:text-left">
                <h3 className="mb-2 font-[family-name:var(--lp-font-heading)] text-lg font-medium text-[var(--lp-color-foreground)]">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--lp-font-body)] text-base text-[var(--lp-color-muted)]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {props.ctaHref ? (
        <div className="mt-6 flex justify-center">
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

export const featureAlternatingMeta: ComponentMeta = {
  componentId: "feature_alternating",
  category: "Features",
  variants: featureAlternatingVariantValues,
  purpose: ["desire"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
