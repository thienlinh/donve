import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const faqAccordionVariantValues = [
  "single_column",
  "two_column"
] as const;

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string()
});

export const faqAccordionPropsSchema = z.object({
  heading: z.string().optional(),
  items: z.array(faqItemSchema).min(2).max(12),
  variant: z.enum(faqAccordionVariantValues)
});
export type FaqAccordionProps = z.infer<typeof faqAccordionPropsSchema>;

export function FaqAccordionRender({
  props
}: BaseComponentProps<FaqAccordionProps>) {
  return (
    <section
      data-lp-component="faq_accordion"
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
          props.variant === "two_column" ? "columns-1 gap-6 md:columns-2" : ""
        }
      >
        {props.items.map((item, index) => (
          <details
            key={index}
            {...trackAttr("faq_opened")}
            className="mb-3 break-inside-avoid rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] p-4"
          >
            <summary className="cursor-pointer font-medium text-[var(--lp-color-foreground)]">
              {item.question}
            </summary>
            <p className="mt-2 text-sm text-[var(--lp-color-muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export const faqAccordionMeta: ComponentMeta = {
  componentId: "faq_accordion",
  category: "Objection",
  variants: faqAccordionVariantValues,
  purpose: ["risk_reduction"],
  trackingEvents: ["faq_opened"],
  sensitiveProps: []
};
