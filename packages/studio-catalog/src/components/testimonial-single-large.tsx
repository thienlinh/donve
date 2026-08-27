// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const testimonialSingleLargeVariantValues = ["single_large"] as const;

export const testimonialSingleLargePropsSchema = z.object({
  quote: z.string().max(600),
  authorName: z.string(),
  authorTitle: z.string(),
  /** points to a verified source — testimonial, số liệu, tài liệu import (`strategy-brief.md`). */
  evidenceRef: z.string(),
  variant: z.enum(testimonialSingleLargeVariantValues)
});
export type TestimonialSingleLargeProps = z.infer<
  typeof testimonialSingleLargePropsSchema
>;

export function TestimonialSingleLargeRender({
  props
}: BaseComponentProps<TestimonialSingleLargeProps>) {
  return (
    <section
      data-lp-component="testimonial_single_large"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      <div className="mx-auto w-full text-center lg:w-3/4 xl:w-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="mb-8 inline-block h-8 w-8 text-[var(--lp-color-muted)]"
          viewBox="0 0 975.036 975.036"
        >
          <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z" />
        </svg>
        <p className="font-[family-name:var(--lp-font-body)] text-lg leading-relaxed text-[var(--lp-color-foreground)]">
          {props.quote}
        </p>
        <span className="mt-8 mb-6 inline-block h-1 w-10 rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)]" />
        <h2 className="font-[family-name:var(--lp-font-heading)] text-sm font-medium tracking-wider text-[var(--lp-color-foreground)]">
          {props.authorName}
        </h2>
        <p className="text-[var(--lp-color-muted)]">{props.authorTitle}</p>
      </div>
    </section>
  );
}

export const testimonialSingleLargeMeta: ComponentMeta = {
  componentId: "testimonial_single_large",
  category: "Social proof",
  variants: testimonialSingleLargeVariantValues,
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
