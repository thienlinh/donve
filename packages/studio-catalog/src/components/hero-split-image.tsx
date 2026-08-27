// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

export const heroSplitImageVariantValues = [
  "image_right",
  "image_left"
] as const;

export const heroSplitImagePropsSchema = z.object({
  headline: z.string().max(80),
  subheadline: z.string().max(240),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  secondaryCtaLabel: z.string().optional(),
  image: imagePropsSchema,
  variant: z.enum(heroSplitImageVariantValues)
});
export type HeroSplitImageProps = z.infer<typeof heroSplitImagePropsSchema>;

export function HeroSplitImageRender({
  props
}: BaseComponentProps<HeroSplitImageProps>) {
  const reversed = props.variant === "image_left";
  return (
    <section
      data-lp-component="hero_split_image"
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
        <div className="flex justify-center gap-4">
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
      <img
        src={props.image.src}
        alt={props.image.alt}
        className="w-5/6 rounded-[var(--lp-radius)] object-cover md:w-1/2 lg:w-full lg:max-w-lg"
      />
    </section>
  );
}

export const heroSplitImageMeta: ComponentMeta = {
  componentId: "hero_split_image",
  category: "Hero",
  variants: heroSplitImageVariantValues,
  purpose: ["understanding", "action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
