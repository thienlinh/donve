// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

const stepTabNavigatorTabSchema = z.object({
  label: z.string(),
  iconName: z.string().optional()
});

export const stepTabNavigatorPropsSchema = z.object({
  tabs: z.array(stepTabNavigatorTabSchema).min(2).max(6),
  activeIndex: z.number().int().min(0).default(0),
  image: imagePropsSchema,
  heading: z.string(),
  description: z.string()
});
export type StepTabNavigatorProps = z.infer<typeof stepTabNavigatorPropsSchema>;

export function StepTabNavigatorRender({
  props
}: BaseComponentProps<StepTabNavigatorProps>) {
  return (
    <section
      data-lp-component="step_tab_navigator"
      className="flex flex-col flex-wrap px-6 py-16 md:px-12"
    >
      <div className="mx-auto mb-16 flex flex-wrap">
        {props.tabs.map((tab, index) => (
          <span
            key={index}
            className={
              index === props.activeIndex
                ? "inline-flex w-1/2 items-center justify-center rounded-t-[var(--lp-radius)] border-b-2 border-[var(--lp-color-primary)] bg-[var(--lp-color-surface)] px-4 py-3 font-[family-name:var(--lp-font-heading)] text-sm font-medium tracking-wider text-[var(--lp-color-primary)] sm:w-auto sm:px-6"
                : "inline-flex w-1/2 items-center justify-center border-b-2 border-[var(--lp-color-border)] px-4 py-3 font-[family-name:var(--lp-font-heading)] text-sm font-medium tracking-wider text-[var(--lp-color-muted)] sm:w-auto sm:px-6"
            }
          >
            {tab.iconName ? (
              <span aria-hidden="true" className="mr-3">
                {tab.iconName}
              </span>
            ) : null}
            {tab.label}
          </span>
        ))}
      </div>
      <img
        className="mx-auto mb-10 block w-2/3 rounded-[var(--lp-radius)] object-cover object-center md:w-1/2 xl:w-1/4"
        src={props.image.src}
        alt={props.image.alt}
      />
      <div className="flex w-full flex-col text-center">
        <h2 className="mb-4 font-[family-name:var(--lp-font-heading)] text-xl font-medium text-[var(--lp-color-foreground)]">
          {props.heading}
        </h2>
        <p className="mx-auto font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-muted)] lg:w-2/3">
          {props.description}
        </p>
      </div>
    </section>
  );
}

export const stepTabNavigatorMeta: ComponentMeta = {
  componentId: "step_tab_navigator",
  category: "Process",
  variants: [],
  purpose: ["risk_reduction"],
  trackingEvents: [],
  sensitiveProps: []
};
