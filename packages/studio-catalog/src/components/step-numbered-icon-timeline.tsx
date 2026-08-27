// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

const stepNumberedIconTimelineStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconName: z.string().optional()
});

export const stepNumberedIconTimelinePropsSchema = z.object({
  steps: z.array(stepNumberedIconTimelineStepSchema).min(2).max(6)
});
export type StepNumberedIconTimelineProps = z.infer<
  typeof stepNumberedIconTimelinePropsSchema
>;

export function StepNumberedIconTimelineRender({
  props
}: BaseComponentProps<StepNumberedIconTimelineProps>) {
  return (
    <section
      data-lp-component="step_numbered_icon_timeline"
      className="px-6 py-16 md:px-12"
    >
      <div className="mx-auto flex flex-wrap md:w-2/3">
        {props.steps.map((step, index) => {
          const isLast = index === props.steps.length - 1;
          return (
            <div
              key={index}
              className={`relative flex w-full pt-6 sm:items-center ${isLast ? "pb-6" : "pb-16"}`}
            >
              {isLast ? null : (
                <div className="absolute inset-y-0 left-3 flex w-1 items-center justify-center">
                  <div className="h-full w-px bg-[var(--lp-color-border)]" />
                </div>
              )}
              <div className="relative z-10 mt-4 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--lp-color-primary)] font-[family-name:var(--lp-font-heading)] text-sm font-medium text-[var(--lp-color-primary-foreground)] sm:mt-0">
                {index + 1}
              </div>
              <div className="flex flex-grow flex-col items-start pl-6 sm:flex-row sm:items-center md:pl-8">
                <div className="inline-flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-[var(--lp-color-accent)] text-[var(--lp-color-accent-foreground)]">
                  <span aria-hidden="true" className="text-3xl">
                    {step.iconName ?? "✦"}
                  </span>
                </div>
                <div className="mt-6 flex-grow sm:mt-0 sm:pl-6">
                  <h3 className="mb-1 font-[family-name:var(--lp-font-heading)] text-xl font-medium text-[var(--lp-color-foreground)]">
                    {step.title}
                  </h3>
                  <p className="font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-muted)]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const stepNumberedIconTimelineMeta: ComponentMeta = {
  componentId: "step_numbered_icon_timeline",
  category: "Process",
  variants: [],
  purpose: ["risk_reduction"],
  trackingEvents: [],
  sensitiveProps: []
};
