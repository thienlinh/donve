import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const howItWorksVariantValues = ["numbered_steps", "timeline"] as const;

const stepSchema = z.object({
  title: z.string(),
  description: z.string()
});

export const howItWorksPropsSchema = z.object({
  heading: z.string().optional(),
  steps: z.array(stepSchema).min(2).max(6),
  variant: z.enum(howItWorksVariantValues)
});
export type HowItWorksProps = z.infer<typeof howItWorksPropsSchema>;

export function HowItWorksRender({
  props
}: BaseComponentProps<HowItWorksProps>) {
  return (
    <section
      data-lp-component="how_it_works"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      <ol
        className={
          props.variant === "timeline"
            ? "flex flex-col gap-6 border-l border-[var(--lp-color-border)] pl-6"
            : "grid gap-6 md:grid-cols-3"
        }
      >
        {props.steps.map((step, index) => (
          <li key={index}>
            <span className="text-sm font-bold text-[var(--lp-color-primary)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-medium text-[var(--lp-color-foreground)]">
              {step.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--lp-color-muted)]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const howItWorksMeta: ComponentMeta = {
  componentId: "how_it_works",
  category: "Process",
  variants: howItWorksVariantValues,
  purpose: ["risk_reduction"],
  trackingEvents: [],
  sensitiveProps: []
};
