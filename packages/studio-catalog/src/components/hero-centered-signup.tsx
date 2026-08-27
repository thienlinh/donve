// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

const storeBadgeSchema = z.object({
  label: z.string(),
  sublabel: z.string(),
  href: z.string()
});

export const heroCenteredSignupPropsSchema = z.object({
  headline: z.string().max(80),
  subheadline: z.string().max(240),
  inputLabel: z.string(),
  inputPlaceholder: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  helperText: z.string().optional(),
  storeBadges: z.array(storeBadgeSchema).max(2).optional(),
  image: imagePropsSchema
});
export type HeroCenteredSignupProps = z.infer<
  typeof heroCenteredSignupPropsSchema
>;

export function HeroCenteredSignupRender({
  props
}: BaseComponentProps<HeroCenteredSignupProps>) {
  return (
    <section
      data-lp-component="hero_centered_signup"
      className="flex flex-col items-center px-6 py-16 text-center md:px-12 md:py-24"
    >
      <img
        src={props.image.src}
        alt={props.image.alt}
        className="mb-10 w-5/6 rounded-[var(--lp-radius)] object-cover md:w-3/5 lg:w-2/5"
      />
      <div className="flex w-full flex-col items-center md:w-2/3">
        <h1 className="font-[family-name:var(--lp-font-heading)] text-3xl font-medium text-[var(--lp-color-foreground)] md:text-4xl">
          {props.headline}
        </h1>
        <p className="mt-4 font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-muted)]">
          {props.subheadline}
        </p>
        <div className="mt-8 flex w-full max-w-md items-end justify-center gap-4">
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
          <p className="mt-2 text-sm text-[var(--lp-color-muted)]">
            {props.helperText}
          </p>
        ) : null}
        {props.storeBadges && props.storeBadges.length > 0 ? (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
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
    </section>
  );
}

export const heroCenteredSignupMeta: ComponentMeta = {
  componentId: "hero_centered_signup",
  category: "Hero",
  variants: [],
  purpose: ["understanding", "action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
