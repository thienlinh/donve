import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

export const ctaBannerVariantValues = ["centered", "split_image"] as const;

export const ctaBannerPropsSchema = z.object({
  headline: z.string().max(100),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  image: imagePropsSchema.optional(),
  variant: z.enum(ctaBannerVariantValues)
});
export type CtaBannerProps = z.infer<typeof ctaBannerPropsSchema>;

export function CtaBannerRender({ props }: BaseComponentProps<CtaBannerProps>) {
  return (
    <section
      data-lp-component="cta_banner"
      data-lp-variant={props.variant}
      className={
        props.variant === "split_image"
          ? "grid gap-8 bg-[var(--lp-color-primary)] px-6 py-16 md:grid-cols-2 md:items-center md:px-12"
          : "flex flex-col items-center gap-4 bg-[var(--lp-color-primary)] px-6 py-16 text-center md:px-12"
      }
    >
      <h2 className="text-2xl font-bold text-[var(--lp-color-primary-foreground)] md:text-3xl">
        {props.headline}
      </h2>
      <a
        href={props.ctaHref}
        {...trackAttr("cta_clicked")}
        className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary-foreground)] px-6 py-3 font-medium text-[var(--lp-color-primary)]"
      >
        {props.ctaLabel}
      </a>
      {props.variant === "split_image" && props.image ? (
        <img
          src={props.image.src}
          alt={props.image.alt}
          className="w-full rounded-[var(--lp-radius)] object-cover"
        />
      ) : null}
    </section>
  );
}

export const ctaBannerMeta: ComponentMeta = {
  componentId: "cta_banner",
  category: "CTA",
  variants: ctaBannerVariantValues,
  purpose: ["action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
