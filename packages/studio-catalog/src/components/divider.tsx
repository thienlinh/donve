import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const dividerPropsSchema = z.object({});
export type DividerProps = z.infer<typeof dividerPropsSchema>;

export function DividerRender(_ctx: BaseComponentProps<DividerProps>) {
  return (
    <hr
      data-lp-component="divider"
      className="border-[var(--lp-color-border)]"
    />
  );
}

export const dividerMeta: ComponentMeta = {
  componentId: "divider",
  category: "Utility",
  variants: [],
  purpose: [],
  trackingEvents: [],
  sensitiveProps: []
};
