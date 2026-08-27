// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

export const heroCenteredPropsSchema = z.object({
  headline: z.string().max(80),
  subheadline: z.string().max(240),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  secondaryCtaLabel: z.string().optional(),
  image: imagePropsSchema
});
export type HeroCenteredProps = z.infer<typeof heroCenteredPropsSchema>;

export function HeroCenteredRender({
  props
}: BaseComponentProps<HeroCenteredProps>) {
  return (
    <section
      data-lp-component="hero_centered"
      className="flex flex-col items-center px-6 py-16 text-center md:px-12 md:py-24"
    >
      <img
        src={props.image.src}
        alt={props.image.alt}
        className="mb-10 w-5/6 rounded-[var(--lp-radius)] object-cover md:w-3/5 lg:w-2/5"
      />
      <div className="flex w-full flex-col items-center lg:w-2/3">
        <h1 className="font-[family-name:var(--lp-font-heading)] text-3xl font-medium text-[var(--lp-color-foreground)] md:text-4xl">
          {props.headline}
        </h1>
        <p className="mt-4 font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-muted)]">
          {props.subheadline}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href={props.ctaHref}
            {...trackAttr("cta_clicked")}
            className="inline-flex rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-6 py-2 text-lg font-medium text-[var(--lp-color-primary-foreground)]"
          >
            {props.ctaLabel}
          </a>
          {props.secondaryCtaLabel ? (
            <span className="inline-flex rounded-[var(--lp-radius)] bg-[var(--lp-color-surface)] px-6 py-2 text-lg text-[var(--lp-color-foreground)]">
              {props.secondaryCtaLabel}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export const heroCenteredMeta: ComponentMeta = {
  componentId: "hero_centered",
  category: "Hero",
  variants: [],
  purpose: ["understanding", "action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
