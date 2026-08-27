// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

export const heroSplitSignupVariantValues = [
  "image_right",
  "image_left"
] as const;

const storeBadgeSchema = z.object({
  label: z.string(),
  sublabel: z.string(),
  href: z.string()
});

export const heroSplitSignupPropsSchema = z.object({
  headline: z.string().max(80),
  subheadline: z.string().max(240),
  inputLabel: z.string(),
  inputPlaceholder: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  helperText: z.string().optional(),
  storeBadges: z.array(storeBadgeSchema).max(2).optional(),
  image: imagePropsSchema,
  variant: z.enum(heroSplitSignupVariantValues)
});
export type HeroSplitSignupProps = z.infer<typeof heroSplitSignupPropsSchema>;

export function HeroSplitSignupRender({
  props
}: BaseComponentProps<HeroSplitSignupProps>) {
  const reversed = props.variant === "image_left";
  return (
    <section
      data-lp-component="hero_split_signup"
      data-lp-variant={props.variant}
      className={`flex flex-col items-center gap-10 px-6 py-16 md:px-12 md:py-24 ${
        reversed ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <h1 className="font-[family-name:var(--lp-font-heading)] text-3xl font-medium text-[var(--lp-color-foreground)] md:text-4xl">
          {props.headline}
        </h1>
        <p className="font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-muted)]">
          {props.subheadline}
        </p>
        <div className="flex w-full items-end justify-center gap-4 md:justify-start">
          <label className="flex flex-1 flex-col gap-1 text-left text-sm text-[var(--lp-color-muted)]">
            {props.inputLabel}
            <input
              type="text"
              placeholder={props.inputPlaceholder}
              className="rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] px-3 py-2 text-[var(--lp-color-foreground)] outline-none focus:border-[var(--lp-color-primary)]"
            />
          </label>
          <a
            href={props.ctaHref}
            {...trackAttr("cta_clicked")}
            className="inline-flex rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-6 py-2 text-lg font-medium text-[var(--lp-color-primary-foreground)]"
          >
            {props.ctaLabel}
          </a>
        </div>
        {props.helperText ? (
          <p className="text-sm text-[var(--lp-color-muted)]">
            {props.helperText}
          </p>
        ) : null}
        {props.storeBadges && props.storeBadges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {props.storeBadges.map((badge, index) => (
              <a
                key={index}
                href={badge.href}
                {...trackAttr("cta_clicked")}
                className="flex flex-col items-start rounded-[var(--lp-radius)] bg-[var(--lp-color-surface)] px-5 py-3 leading-none"
              >
                <span className="mb-1 text-xs text-[var(--lp-color-muted)]">
                  {badge.label}
                </span>
                <span className="font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)]">
                  {badge.sublabel}
                </span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <img
        src={props.image.src}
        alt={props.image.alt}
        className="w-5/6 rounded-[var(--lp-radius)] object-cover md:w-1/2 lg:w-full lg:max-w-lg"
      />
    </section>
  );
}

export const heroSplitSignupMeta: ComponentMeta = {
  componentId: "hero_split_signup",
  category: "Hero",
  variants: heroSplitSignupVariantValues,
  purpose: ["understanding", "action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
