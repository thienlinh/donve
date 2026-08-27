// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

const pricingToggleBillingPlanSchema = z.object({
  name: z.string(),
  /** sensitive: price — patch blocked without `humanApproved` (`component-library.md`). */
  price: z.string(),
  period: z.string().optional(),
  features: z.array(z.string()).min(1),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  highlighted: z.boolean().default(false)
});

export const pricingToggleBillingPropsSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  monthlyLabel: z.string().default("Hàng tháng"),
  annualLabel: z.string().default("Hàng năm"),
  plans: z.array(pricingToggleBillingPlanSchema).min(1).max(4)
});
export type PricingToggleBillingProps = z.infer<
  typeof pricingToggleBillingPropsSchema
>;

/** `pricing_viewed` fires via `apps/landing-runtime/src/tracking.ts`'s `bindViewportTracking`
 * (IntersectionObserver, once this `<section>` is ≥50% visible). */
export function PricingToggleBillingRender({
  props
}: BaseComponentProps<PricingToggleBillingProps>) {
  return (
    <section
      data-lp-component="pricing_toggle_billing"
      {...trackAttr("pricing_viewed")}
      className="px-6 py-16 md:px-12"
    >
      <div className="mb-10 flex flex-col items-center text-center">
        <h2 className="mb-2 font-[family-name:var(--lp-font-heading)] text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
        {props.subheading ? (
          <p className="max-w-2xl font-[family-name:var(--lp-font-body)] text-[var(--lp-color-muted)]">
            {props.subheading}
          </p>
        ) : null}
        <div className="mt-6 flex overflow-hidden rounded-[var(--lp-radius)] border border-[var(--lp-color-primary)]">
          <button
            type="button"
            className="bg-[var(--lp-color-primary)] px-4 py-1 text-sm font-medium text-[var(--lp-color-primary-foreground)]"
          >
            {props.monthlyLabel}
          </button>
          <button
            type="button"
            className="px-4 py-1 text-sm font-medium text-[var(--lp-color-foreground)]"
          >
            {props.annualLabel}
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {props.plans.map((plan, planIndex) => (
          <div
            key={planIndex}
            data-highlighted={plan.highlighted}
            className="relative flex h-full flex-col overflow-hidden rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] p-6 data-[highlighted=true]:border-[var(--lp-color-accent)]"
          >
            {plan.highlighted ? (
              <span className="absolute top-0 right-0 rounded-bl-[var(--lp-radius)] bg-[var(--lp-color-accent)] px-3 py-1 text-xs font-medium tracking-widest text-[var(--lp-color-accent-foreground)]">
                PHỔ BIẾN
              </span>
            ) : null}
            <h3 className="mb-1 text-sm font-medium tracking-widest text-[var(--lp-color-foreground)]">
              {plan.name}
            </h3>
            <p className="mb-4 flex items-center border-b border-[var(--lp-color-border)] pb-4 text-4xl leading-none text-[var(--lp-color-foreground)]">
              {plan.price}
              {plan.period ? (
                <span className="ml-1 text-lg font-normal text-[var(--lp-color-muted)]">
                  /{plan.period}
                </span>
              ) : null}
            </p>
            <ul className="mb-6 space-y-2 text-sm text-[var(--lp-color-muted)]">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <span className="mr-2 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--lp-color-primary)] text-[var(--lp-color-primary-foreground)]">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={plan.ctaHref}
              {...trackAttr("cta_clicked")}
              className="mt-auto block w-full rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-4 py-2 text-center font-medium text-[var(--lp-color-primary-foreground)]"
            >
              {plan.ctaLabel}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export const pricingToggleBillingMeta: ComponentMeta = {
  componentId: "pricing_toggle_billing",
  category: "Pricing",
  variants: [],
  purpose: ["desire", "action"],
  trackingEvents: ["cta_clicked", "pricing_viewed"],
  sensitiveProps: ["plans[].price"]
};
