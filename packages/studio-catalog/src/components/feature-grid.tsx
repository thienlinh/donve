import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const featureGridVariantValues = [
  "icon_grid",
  "screenshot_grid"
] as const;

const featureGridItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconName: z.string().optional(),
  screenshot: imagePropsSchema.optional()
});

export const featureGridPropsSchema = z.object({
  heading: z.string().optional(),
  items: z.array(featureGridItemSchema).min(3).max(9),
  variant: z.enum(featureGridVariantValues)
});
export type FeatureGridProps = z.infer<typeof featureGridPropsSchema>;

export function FeatureGridRender({
  props
}: BaseComponentProps<FeatureGridProps>) {
  return (
    <section
      data-lp-component="feature_grid"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      <div className="grid gap-6 md:grid-cols-3">
        {props.items.map((item, index) => (
          <div key={index}>
            {props.variant === "screenshot_grid" && item.screenshot ? (
              <img
                src={item.screenshot.src}
                alt={item.screenshot.alt}
                className="mb-3 w-full rounded-[var(--lp-radius)] object-cover"
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

export const featureGridMeta: ComponentMeta = {
  componentId: "feature_grid",
  category: "Features",
  variants: featureGridVariantValues,
  purpose: ["desire"],
  trackingEvents: [],
  sensitiveProps: []
};
