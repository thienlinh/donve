import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const comparisonTableVariantValues = [
  "vs_competitor",
  "vs_alternative"
] as const;

const comparisonRowSchema = z.object({
  feature: z.string(),
  us: z.union([z.boolean(), z.string()]),
  them: z.union([z.boolean(), z.string()])
});

export const comparisonTablePropsSchema = z.object({
  heading: z.string().optional(),
  usLabel: z.string(),
  themLabel: z.string(),
  rows: z.array(comparisonRowSchema).min(2).max(12),
  variant: z.enum(comparisonTableVariantValues)
});
export type ComparisonTableProps = z.infer<typeof comparisonTablePropsSchema>;

function cell(value: boolean | string) {
  if (typeof value === "boolean") return value ? "✓" : "—";
  return value;
}

export function ComparisonTableRender({
  props
}: BaseComponentProps<ComparisonTableProps>) {
  return (
    <section
      data-lp-component="comparison_table"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.heading}
        </h2>
      ) : null}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--lp-color-border)]">
            <th className="py-3" />
            <th className="py-3 text-[var(--lp-color-primary)]">
              {props.usLabel}
            </th>
            <th className="py-3 text-[var(--lp-color-muted)]">
              {props.themLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, index) => (
            <tr
              key={index}
              className="border-b border-[var(--lp-color-border)]"
            >
              <td className="py-3 text-[var(--lp-color-foreground)]">
                {row.feature}
              </td>
              <td className="py-3">{cell(row.us)}</td>
              <td className="py-3 text-[var(--lp-color-muted)]">
                {cell(row.them)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export const comparisonTableMeta: ComponentMeta = {
  componentId: "comparison_table",
  category: "Comparison",
  variants: comparisonTableVariantValues,
  purpose: ["desire"],
  trackingEvents: [],
  sensitiveProps: []
};
