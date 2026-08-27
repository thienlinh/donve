import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

export const heroVariantValues = [
  "saas",
  "leadgen",
  "product",
  "ecommerce",
  "personal_brand",
  "event"
] as const;

export const heroPropsSchema = z.object({
  headline: z.string().max(80),
  subheadline: z.string().max(160),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  secondaryCtaLabel: z.string().optional(),
  // Optional (not paired 1:1 with `secondaryCtaLabel`) so existing content saved before this
  // field existed still renders — see `HeroRender`'s fallback to plain, unstyled text below.
  secondaryCtaHref: z.string().optional(),
  image: imagePropsSchema,
  variant: z.enum(heroVariantValues)
});
export type HeroProps = z.infer<typeof heroPropsSchema>;

export function HeroRender({ props }: BaseComponentProps<HeroProps>) {
  return (
    <section
      data-lp-component="hero"
      data-lp-variant={props.variant}
      className="grid gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:px-12 md:py-24"
    >
      <div className="flex flex-col gap-4">
        <h1 className="font-[family-name:var(--lp-font-heading)] text-3xl font-bold text-[var(--lp-color-foreground)] md:text-5xl">
          {props.headline}
        </h1>
        <p className="font-[family-name:var(--lp-font-body)] text-lg text-[var(--lp-color-muted)]">
          {props.subheadline}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={props.ctaHref}
            {...trackAttr("cta_clicked")}
            className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-6 py-3 font-medium text-[var(--lp-color-primary-foreground)]"
          >
            {props.ctaLabel}
          </a>
          {props.secondaryCtaLabel && props.secondaryCtaHref ? (
            <a
              href={props.secondaryCtaHref}
              {...trackAttr("cta_clicked")}
              className="rounded-[var(--lp-radius)] border border-[var(--lp-color-accent)] px-6 py-3 font-medium text-[var(--lp-color-accent)]"
            >
              {props.secondaryCtaLabel}
            </a>
          ) : props.secondaryCtaLabel ? (
            <span className="px-6 py-3 font-medium">
              {props.secondaryCtaLabel}
            </span>
          ) : null}
        </div>
      </div>
      <img
        src={props.image.src}
        alt={props.image.alt}
        className="w-full rounded-[var(--lp-radius)] object-cover"
      />
    </section>
  );
}

export const heroMeta: ComponentMeta = {
  componentId: "hero",
  category: "Hero",
  variants: heroVariantValues,
  purpose: ["understanding", "action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
