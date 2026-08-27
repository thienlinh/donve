import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const pricingTableVariantValues = [
  "2_tier",
  "3_tier",
  "single_plan",
  "with_comparison"
] as const;

const pricingPlanSchema = z.object({
  name: z.string(),
  /** sensitive: price — patch blocked without `humanApproved` (`component-library.md`). */
  price: z.string(),
  period: z.string().optional(),
  features: z.array(z.string()).min(1),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  highlighted: z.boolean().default(false)
});

export const pricingTablePropsSchema = z.object({
  heading: z.string().optional(),
  plans: z.array(pricingPlanSchema).min(1).max(4),
  variant: z.enum(pricingTableVariantValues)
});
export type PricingTableProps = z.infer<typeof pricingTablePropsSchema>;

/** `pricing_viewed` fires via `apps/landing-runtime/src/tracking.ts`'s `bindViewportTracking`
 * (IntersectionObserver, once this `<section>` is ≥50% visible). */
export function PricingTableRender({
  props
}: BaseComponentProps<PricingTableProps>) {
  return (
    <section
      data-lp-component="pricing_table"
      data-lp-variant={props.variant}
      {...trackAttr("pricing_viewed")}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      <div className="grid gap-6 md:grid-cols-3">
        {props.plans.map((plan, planIndex) => (
          <div
            key={planIndex}
            data-highlighted={plan.highlighted}
            className="relative rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] p-6 data-[highlighted=true]:border-[var(--lp-color-accent)]"
          >
            {plan.highlighted ? (
              <span className="absolute -top-3 left-6 rounded-[var(--lp-radius)] bg-[var(--lp-color-accent)] px-3 py-1 text-xs font-medium text-[var(--lp-color-accent-foreground)]">
                Phổ biến nhất
              </span>
            ) : null}
            <h3 className="font-medium text-[var(--lp-color-foreground)]">
              {plan.name}
            </h3>
            <p className="mt-2 text-3xl font-bold text-[var(--lp-color-foreground)]">
              {plan.price}
              {plan.period ? (
                <span className="text-sm font-normal text-[var(--lp-color-muted)]">
                  /{plan.period}
                </span>
              ) : null}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--lp-color-muted)]">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
            <a
              href={plan.ctaHref}
              {...trackAttr("cta_clicked")}
              className="mt-6 block rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-4 py-2 text-center font-medium text-[var(--lp-color-primary-foreground)]"
            >
              {plan.ctaLabel}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export const pricingTableMeta: ComponentMeta = {
  componentId: "pricing_table",
  category: "Pricing",
  variants: pricingTableVariantValues,
  purpose: ["desire", "action"],
  trackingEvents: ["cta_clicked", "pricing_viewed"],
  sensitiveProps: ["plans[].price"]
};
