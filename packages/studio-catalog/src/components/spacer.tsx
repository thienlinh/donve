import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const spacerSizeValues = ["sm", "md", "lg", "xl"] as const;

export const spacerPropsSchema = z.object({
  size: z.enum(spacerSizeValues).default("md")
});
export type SpacerProps = z.infer<typeof spacerPropsSchema>;

const sizeClass: Record<(typeof spacerSizeValues)[number], string> = {
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
  xl: "h-24"
};

export function SpacerRender({ props }: BaseComponentProps<SpacerProps>) {
  return <div data-lp-component="spacer" className={sizeClass[props.size]} />;
}

export const spacerMeta: ComponentMeta = {
  componentId: "spacer",
  category: "Utility",
  variants: [],
  purpose: [],
  trackingEvents: [],
  sensitiveProps: []
};
