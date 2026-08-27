// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const testimonialTwoColumnCardsVariantValues = [
  "two_column_cards"
] as const;

const testimonialItemSchema = z.object({
  quote: z.string().max(400),
  authorName: z.string(),
  authorTitle: z.string(),
  authorAvatar: imagePropsSchema.optional(),
  /** points to a verified source — testimonial, số liệu, tài liệu import (`strategy-brief.md`). */
  evidenceRef: z.string()
});

export const testimonialTwoColumnCardsPropsSchema = z.object({
  heading: z.string().optional(),
  items: z.array(testimonialItemSchema).min(1).max(2),
  variant: z.enum(testimonialTwoColumnCardsVariantValues)
});
export type TestimonialTwoColumnCardsProps = z.infer<
  typeof testimonialTwoColumnCardsPropsSchema
>;

export function TestimonialTwoColumnCardsRender({
  props
}: BaseComponentProps<TestimonialTwoColumnCardsProps>) {
  return (
    <section
      data-lp-component="testimonial-two-column-cards"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-12 text-center font-[family-name:var(--lp-font-heading)] text-2xl font-bold text-[var(--lp-color-foreground)]">
          {props.heading}
        </h2>
      ) : null}
      <div className="mx-auto flex max-w-5xl flex-wrap gap-6">
        {props.items.map((item, index) => (
          <div
            key={index}
            className="h-full flex-1 basis-full rounded-[var(--lp-radius)] bg-[var(--lp-color-surface)] p-8 md:basis-[calc(50%-0.75rem)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="mb-4 block h-5 w-5 text-[var(--lp-color-muted)]"
              viewBox="0 0 975.036 975.036"
            >
              <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z" />
            </svg>
            <p className="mb-6 font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-foreground)]">
              {item.quote}
            </p>
            <div className="inline-flex items-center">
              {item.authorAvatar ? (
                <img
                  src={item.authorAvatar.src}
                  alt={item.authorAvatar.alt}
                  className="h-12 w-12 flex-shrink-0 rounded-full object-cover object-center"
                />
              ) : null}
              <span className="flex flex-grow flex-col pl-4">
                <span className="font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)]">
                  {item.authorName}
                </span>
                <span className="text-sm text-[var(--lp-color-muted)]">
                  {item.authorTitle}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const testimonialTwoColumnCardsMeta: ComponentMeta = {
  componentId: "testimonial_two_column_cards",
  category: "Social proof",
  variants: testimonialTwoColumnCardsVariantValues,
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
