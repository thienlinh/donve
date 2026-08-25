import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const featureTabsVariantValues = [
  "horizontal_tabs",
  "vertical_tabs"
] as const;

const featureTabItemSchema = z.object({
  tabLabel: z.string(),
  title: z.string(),
  description: z.string(),
  image: imagePropsSchema.optional()
});

export const featureTabsPropsSchema = z.object({
  heading: z.string().optional(),
  tabs: z.array(featureTabItemSchema).min(2).max(6),
  variant: z.enum(featureTabsVariantValues)
});
export type FeatureTabsProps = z.infer<typeof featureTabsPropsSchema>;

/** Publish-time: all tabs render statically; tab switching is a `landing-runtime` behavior. */
export function FeatureTabsRender({
  props
}: BaseComponentProps<FeatureTabsProps>) {
  return (
    <section
      data-lp-component="feature_tabs"
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
          props.variant === "vertical_tabs"
            ? "grid gap-6 md:grid-cols-[200px_1fr]"
            : "flex flex-col gap-6"
        }
      >
        <div
          role="tablist"
          className={
            props.variant === "vertical_tabs"
              ? "flex flex-col gap-2"
              : "flex gap-2 overflow-x-auto"
          }
        >
          {props.tabs.map((tab, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === 0}
              className="rounded-[var(--lp-radius)] px-4 py-2 text-sm text-[var(--lp-color-foreground)] data-[active=true]:bg-[var(--lp-color-primary)]"
            >
              {tab.tabLabel}
            </button>
          ))}
        </div>
        <div>
          {props.tabs.map((tab, index) => (
            <div key={index} role="tabpanel" hidden={index !== 0}>
              <h3 className="font-medium text-[var(--lp-color-foreground)]">
                {tab.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--lp-color-muted)]">
                {tab.description}
              </p>
              {tab.image ? (
                <img
                  src={tab.image.src}
                  alt={tab.image.alt}
                  className="mt-3 w-full rounded-[var(--lp-radius)] object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const featureTabsMeta: ComponentMeta = {
  componentId: "feature_tabs",
  category: "Features",
  variants: featureTabsVariantValues,
  purpose: ["desire"],
  trackingEvents: [],
  sensitiveProps: []
};
