// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const ctaInlinePropsSchema = z.object({
  headline: z.string().max(120),
  ctaLabel: z.string(),
  ctaHref: z.string()
});
export type CtaInlineProps = z.infer<typeof ctaInlinePropsSchema>;

export function CtaInlineRender({ props }: BaseComponentProps<CtaInlineProps>) {
  return (
    <section
      data-lp-component="cta_inline"
      className="bg-[var(--lp-color-surface)] px-6 py-16 md:px-12"
    >
      <div className="mx-auto flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center lg:w-2/3">
        <h1 className="flex-grow font-[family-name:var(--lp-font-heading)] text-2xl font-medium text-[var(--lp-color-foreground)] sm:pr-16">
          {props.headline}
        </h1>
        <a
          href={props.ctaHref}
          {...trackAttr("cta_clicked")}
          className="shrink-0 rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-8 py-2 text-lg font-medium text-[var(--lp-color-primary-foreground)]"
        >
          {props.ctaLabel}
        </a>
      </div>
    </section>
  );
}

export const ctaInlineMeta: ComponentMeta = {
  componentId: "cta_inline",
  category: "CTA",
  variants: [],
  purpose: ["action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
