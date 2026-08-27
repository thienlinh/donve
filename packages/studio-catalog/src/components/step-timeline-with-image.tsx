// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

const stepTimelineWithImageStepSchema = z.object({
  label: z.string(),
  description: z.string(),
  iconName: z.string().optional()
});

export const stepTimelineWithImagePropsSchema = z.object({
  heading: z.string().optional(),
  steps: z.array(stepTimelineWithImageStepSchema).min(2).max(6),
  image: imagePropsSchema
});
export type StepTimelineWithImageProps = z.infer<
  typeof stepTimelineWithImagePropsSchema
>;

export function StepTimelineWithImageRender({
  props
}: BaseComponentProps<StepTimelineWithImageProps>) {
  return (
    <section
      data-lp-component="step_timeline_with_image"
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      <div className="flex flex-wrap gap-10 lg:flex-nowrap">
        <ol className="flex w-full flex-col lg:w-2/5">
          {props.steps.map((step, index) => {
            const isLast = index === props.steps.length - 1;
            return (
              <li key={index} className="relative flex pb-10">
                {isLast ? null : (
                  <div className="absolute inset-y-0 left-5 flex w-1 items-center justify-center">
                    <div className="h-full w-px bg-[var(--lp-color-border)]" />
                  </div>
                )}
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--lp-color-primary)] text-[var(--lp-color-primary-foreground)]">
                  <span aria-hidden="true">{step.iconName ?? "✓"}</span>
                </div>
                <div className="flex-grow pl-4">
                  <h3 className="mb-1 font-[family-name:var(--lp-font-heading)] text-sm font-medium tracking-wider text-[var(--lp-color-foreground)]">
                    {step.label}
                  </h3>
                  <p className="font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-muted)]">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <img
          className="mt-4 w-full rounded-[var(--lp-radius)] object-cover object-center lg:mt-0 lg:w-3/5"
          src={props.image.src}
          alt={props.image.alt}
        />
      </div>
    </section>
  );
}

export const stepTimelineWithImageMeta: ComponentMeta = {
  componentId: "step_timeline_with_image",
  category: "Process",
  variants: [],
  purpose: ["risk_reduction"],
  trackingEvents: [],
  sensitiveProps: []
};
