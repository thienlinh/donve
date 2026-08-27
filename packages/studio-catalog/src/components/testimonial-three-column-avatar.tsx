// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const testimonialThreeColumnAvatarVariantValues = [
  "three_column_avatar"
] as const;

const testimonialItemSchema = z.object({
  quote: z.string().max(400),
  authorName: z.string(),
  authorTitle: z.string(),
  authorAvatar: imagePropsSchema,
  /** points to a verified source — testimonial, số liệu, tài liệu import (`strategy-brief.md`). */
  evidenceRef: z.string()
});

export const testimonialThreeColumnAvatarPropsSchema = z.object({
  items: z.array(testimonialItemSchema).min(1).max(3),
  variant: z.enum(testimonialThreeColumnAvatarVariantValues)
});
export type TestimonialThreeColumnAvatarProps = z.infer<
  typeof testimonialThreeColumnAvatarPropsSchema
>;

export function TestimonialThreeColumnAvatarRender({
  props
}: BaseComponentProps<TestimonialThreeColumnAvatarProps>) {
  return (
    <section
      data-lp-component="testimonial-three-column-avatar"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap gap-6">
        {props.items.map((item, index) => (
          <div
            key={index}
            className="flex-1 basis-full text-center lg:basis-[calc(33.333%-1rem)]"
          >
            <img
              src={item.authorAvatar.src}
              alt={item.authorAvatar.alt}
              className="mb-6 inline-block h-20 w-20 rounded-full border-2 border-[var(--lp-color-border)] bg-[var(--lp-color-surface)] object-cover object-center"
            />
            <p className="font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-foreground)]">
              {item.quote}
            </p>
            <span className="mt-4 mb-3 inline-block h-1 w-10 rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)]" />
            <h2 className="font-[family-name:var(--lp-font-heading)] text-sm font-medium tracking-wider text-[var(--lp-color-foreground)]">
              {item.authorName}
            </h2>
            <p className="text-[var(--lp-color-muted)]">{item.authorTitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export const testimonialThreeColumnAvatarMeta: ComponentMeta = {
  componentId: "testimonial_three_column_avatar",
  category: "Social proof",
  variants: testimonialThreeColumnAvatarVariantValues,
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
