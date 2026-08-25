import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const metricProofVariantValues = ["counter_row", "stat_cards"] as const;

const metricItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  evidenceRef: z.string()
});

export const metricProofPropsSchema = z.object({
  metrics: z.array(metricItemSchema).min(2).max(5),
  variant: z.enum(metricProofVariantValues)
});
export type MetricProofProps = z.infer<typeof metricProofPropsSchema>;

export function MetricProofRender({
  props
}: BaseComponentProps<MetricProofProps>) {
  return (
    <section
      data-lp-component="metric_proof"
      data-lp-variant={props.variant}
      className="grid grid-cols-2 gap-6 px-6 py-12 md:grid-cols-4 md:px-12"
    >
      {props.metrics.map((metric, index) => (
        <div key={index} className="text-center">
          <p className="text-3xl font-bold text-[var(--lp-color-primary)]">
            {metric.value}
          </p>
          <p className="text-sm text-[var(--lp-color-muted)]">{metric.label}</p>
        </div>
      ))}
    </section>
  );
}

export const metricProofMeta: ComponentMeta = {
  componentId: "metric_proof",
  category: "Social proof",
  variants: metricProofVariantValues,
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
