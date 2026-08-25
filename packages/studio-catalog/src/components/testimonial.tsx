import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const testimonialVariantValues = [
  "single_quote",
  "grid",
  "video",
  "case_study"
] as const;

const testimonialItemSchema = z.object({
  quote: z.string().max(400),
  authorName: z.string(),
  authorTitle: z.string(),
  authorAvatar: imagePropsSchema.optional(),
  /** points to a verified source — testimonial, số liệu, tài liệu import (`strategy-brief.md`). */
  evidenceRef: z.string(),
  videoUrl: z.string().optional()
});

export const testimonialPropsSchema = z.object({
  heading: z.string().optional(),
  items: z.array(testimonialItemSchema).min(1).max(6),
  variant: z.enum(testimonialVariantValues)
});
export type TestimonialProps = z.infer<typeof testimonialPropsSchema>;

export function TestimonialRender({
  props
}: BaseComponentProps<TestimonialProps>) {
  return (
    <section
      data-lp-component="testimonial"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--lp-color-foreground)]">
          {props.heading}
        </h2>
      ) : null}
      <div
        className={
          props.variant === "grid"
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "mx-auto max-w-2xl"
        }
      >
        {props.items.map((item, index) => (
          <figure
            key={index}
            className="rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] p-6"
          >
            <blockquote className="text-[var(--lp-color-foreground)]">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              {item.authorAvatar ? (
                <img
                  src={item.authorAvatar.src}
                  alt={item.authorAvatar.alt}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : null}
              <div>
                <p className="font-medium text-[var(--lp-color-foreground)]">
                  {item.authorName}
                </p>
                <p className="text-sm text-[var(--lp-color-muted)]">
                  {item.authorTitle}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export const testimonialMeta: ComponentMeta = {
  componentId: "testimonial",
  category: "Social proof",
  variants: testimonialVariantValues,
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
