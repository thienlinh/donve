// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

export const featureWithScreenshotVariantValues = [
  "image_left",
  "image_right"
] as const;

const featureWithScreenshotItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconName: z.string().optional(),
  linkLabel: z.string().optional(),
  linkHref: z.string().optional()
});

export const featureWithScreenshotPropsSchema = z.object({
  screenshot: imagePropsSchema,
  items: z.array(featureWithScreenshotItemSchema).min(2).max(4),
  variant: z.enum(featureWithScreenshotVariantValues)
});
export type FeatureWithScreenshotProps = z.infer<
  typeof featureWithScreenshotPropsSchema
>;

export function FeatureWithScreenshotRender({
  props
}: BaseComponentProps<FeatureWithScreenshotProps>) {
  const imageRight = props.variant === "image_right";
  return (
    <section
      data-lp-component="feature_with_screenshot"
      data-lp-variant={props.variant}
      className="flex flex-col gap-10 px-6 py-16 md:px-12 lg:flex-row lg:items-center"
    >
      <div className={imageRight ? "lg:order-2 lg:w-1/2" : "lg:w-1/2"}>
        <img
          src={props.screenshot.src}
          alt={props.screenshot.alt}
          className="w-full rounded-[var(--lp-radius)] object-cover"
        />
      </div>
      <div
        className={
          (imageRight ? "lg:order-1 " : "") +
          "flex flex-col gap-8 text-center lg:w-1/2 lg:text-left"
        }
      >
        {props.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center lg:flex-row lg:items-start"
          >
            <div className="mb-4 h-12 w-12 flex-shrink-0 rounded-full bg-[var(--lp-color-accent)] text-[var(--lp-color-accent-foreground)] lg:mr-6 lg:mb-0">
              <span
                aria-hidden="true"
                className="flex h-full w-full items-center justify-center"
              >
                {item.iconName ?? "✦"}
              </span>
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
    </section>
  );
}

export const featureWithScreenshotMeta: ComponentMeta = {
  componentId: "feature_with_screenshot",
  category: "Features",
  variants: featureWithScreenshotVariantValues,
  purpose: ["desire"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
