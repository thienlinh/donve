// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const featureIconListVariantValues = [
  "left_aligned",
  "centered"
] as const;

const featureIconListItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconName: z.string().optional(),
  linkLabel: z.string().optional(),
  linkHref: z.string().optional()
});

export const featureIconListPropsSchema = z.object({
  heading: z.string().optional(),
  subheading: z.string().optional(),
  items: z.array(featureIconListItemSchema).min(2).max(4),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  variant: z.enum(featureIconListVariantValues)
});
export type FeatureIconListProps = z.infer<typeof featureIconListPropsSchema>;

export function FeatureIconListRender({
  props
}: BaseComponentProps<FeatureIconListProps>) {
  const centered = props.variant === "centered";
  return (
    <section
      data-lp-component="feature_icon_list"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <div className={centered ? "mb-12 text-center" : "mb-12"}>
          <h2 className="text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
            {props.heading}
          </h2>
          {props.subheading ? (
            <p
              className={
                centered
                  ? "mx-auto mt-3 max-w-2xl text-base text-[var(--lp-color-muted)]"
                  : "mt-3 max-w-2xl text-base text-[var(--lp-color-muted)]"
              }
            >
              {props.subheading}
            </p>
          ) : null}
          {centered ? (
            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[var(--lp-color-primary)]" />
          ) : null}
        </div>
      ) : null}
      <div
        className={
          centered
            ? "grid gap-8 text-center md:grid-cols-3"
            : "grid gap-8 md:grid-cols-3"
        }
      >
        {props.items.map((item, index) => (
          <div
            key={index}
            className={
              centered ? "flex flex-col items-center" : "flex items-start"
            }
          >
            <div
              className={
                (centered ? "mb-5 h-16 w-16" : "mr-6 h-12 w-12 flex-shrink-0") +
                " inline-flex items-center justify-center rounded-full bg-[var(--lp-color-accent)] text-[var(--lp-color-accent-foreground)]"
              }
            >
              <span aria-hidden="true">{item.iconName ?? "✦"}</span>
            </div>
            <div>
              <h3 className="mb-2 font-[family-name:var(--lp-font-heading)] text-lg font-medium text-[var(--lp-color-foreground)]">
                {item.title}
              </h3>
              <p className="font-[family-name:var(--lp-font-body)] text-base text-[var(--lp-color-muted)]">
                {item.description}
              </p>
              {item.linkHref ? (
                <a
                  href={item.linkHref}
                  {...trackAttr("cta_clicked")}
                  className="mt-3 inline-flex items-center text-[var(--lp-color-primary)]"
                >
                  {item.linkLabel ?? "Tìm hiểu thêm"}
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {centered && props.ctaHref ? (
        <div className="mt-16 flex justify-center">
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

export const featureIconListMeta: ComponentMeta = {
  componentId: "feature_icon_list",
  category: "Features",
  variants: featureIconListVariantValues,
  purpose: ["desire"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
