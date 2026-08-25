import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const featureBentoVariantValues = ["2x2", "3x2"] as const;

const featureBentoItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: imagePropsSchema.optional()
});

export const featureBentoPropsSchema = z.object({
  heading: z.string().optional(),
  items: z.array(featureBentoItemSchema).min(4).max(6),
  variant: z.enum(featureBentoVariantValues)
});
export type FeatureBentoProps = z.infer<typeof featureBentoPropsSchema>;

export function FeatureBentoRender({
  props
}: BaseComponentProps<FeatureBentoProps>) {
  return (
    <section
      data-lp-component="feature_bento"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      <div
        className={
          props.variant === "3x2"
            ? "grid gap-4 md:grid-cols-3"
            : "grid gap-4 md:grid-cols-2"
        }
      >
        {props.items.map((item, index) => (
          <div
            key={index}
            className="rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] p-6"
          >
            {item.image ? (
              <img
                src={item.image.src}
                alt={item.image.alt}
                className="mb-4 h-32 w-full rounded-[var(--lp-radius)] object-cover"
              />
            ) : null}
            <h3 className="font-medium text-[var(--lp-color-foreground)]">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--lp-color-muted)]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export const featureBentoMeta: ComponentMeta = {
  componentId: "feature_bento",
  category: "Features",
  variants: featureBentoVariantValues,
  purpose: ["desire"],
  trackingEvents: [],
  sensitiveProps: []
};
