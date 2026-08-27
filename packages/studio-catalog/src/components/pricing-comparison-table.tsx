// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

const pricingComparisonRowSchema = z.object({
  name: z.string(),
  speed: z.string(),
  storage: z.string(),
  /** sensitive: price — patch blocked without `humanApproved` (`component-library.md`). */
  price: z.string()
});

export const pricingComparisonTablePropsSchema = z.object({
  heading: z.string(),
  subheading: z.string().optional(),
  speedColumnLabel: z.string().default("Tốc độ"),
  storageColumnLabel: z.string().default("Dung lượng"),
  priceColumnLabel: z.string().default("Giá"),
  rows: z.array(pricingComparisonRowSchema).min(1).max(6),
  learnMoreLabel: z.string(),
  learnMoreHref: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string()
});
export type PricingComparisonTableProps = z.infer<
  typeof pricingComparisonTablePropsSchema
>;

/** `pricing_viewed` fires via `apps/landing-runtime/src/tracking.ts`'s `bindViewportTracking`
 * (IntersectionObserver, once this `<section>` is ≥50% visible). */
export function PricingComparisonTableRender({
  props
}: BaseComponentProps<PricingComparisonTableProps>) {
  return (
    <section
      data-lp-component="pricing_comparison_table"
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
      </div>
      <div className="mx-auto w-full overflow-auto lg:w-2/3">
        <table className="w-full table-auto text-left">
          <thead>
            <tr>
              <th className="rounded-l-[var(--lp-radius)] bg-[var(--lp-color-surface)] px-4 py-3 text-sm font-medium tracking-wider text-[var(--lp-color-foreground)]">
                Gói
              </th>
              <th className="bg-[var(--lp-color-surface)] px-4 py-3 text-sm font-medium tracking-wider text-[var(--lp-color-foreground)]">
                {props.speedColumnLabel}
              </th>
              <th className="bg-[var(--lp-color-surface)] px-4 py-3 text-sm font-medium tracking-wider text-[var(--lp-color-foreground)]">
                {props.storageColumnLabel}
              </th>
              <th className="rounded-r-[var(--lp-radius)] bg-[var(--lp-color-surface)] px-4 py-3 text-sm font-medium tracking-wider text-[var(--lp-color-foreground)]">
                {props.priceColumnLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border-t border-[var(--lp-color-border)] px-4 py-3 text-[var(--lp-color-foreground)]">
                  {row.name}
                </td>
                <td className="border-t border-[var(--lp-color-border)] px-4 py-3 text-[var(--lp-color-muted)]">
                  {row.speed}
                </td>
                <td className="border-t border-[var(--lp-color-border)] px-4 py-3 text-[var(--lp-color-muted)]">
                  {row.storage}
                </td>
                <td className="border-t border-[var(--lp-color-border)] px-4 py-3 text-lg text-[var(--lp-color-foreground)]">
                  {row.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mx-auto mt-6 flex w-full items-center lg:w-2/3">
        <a
          href={props.learnMoreHref}
          className="inline-flex items-center text-[var(--lp-color-primary)]"
        >
          {props.learnMoreLabel}
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="ml-2 h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href={props.ctaHref}
          {...trackAttr("cta_clicked")}
          className="ml-auto rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-6 py-2 font-medium text-[var(--lp-color-primary-foreground)]"
        >
          {props.ctaLabel}
        </a>
      </div>
    </section>
  );
}

export const pricingComparisonTableMeta: ComponentMeta = {
  componentId: "pricing_comparison_table",
  category: "Pricing",
  variants: [],
  purpose: ["desire", "action"],
  trackingEvents: ["cta_clicked", "pricing_viewed"],
  sensitiveProps: ["rows[].price"]
};
