import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const ctaStickyVariantValues = [
  "bottom_bar",
  "floating_button"
] as const;

export const ctaStickyPropsSchema = z.object({
  label: z.string(),
  ctaHref: z.string(),
  variant: z.enum(ctaStickyVariantValues)
});
export type CtaStickyProps = z.infer<typeof ctaStickyPropsSchema>;

export function CtaStickyRender({ props }: BaseComponentProps<CtaStickyProps>) {
  return (
    <a
      href={props.ctaHref}
      data-lp-component="cta_sticky"
      data-lp-variant={props.variant}
      {...trackAttr("cta_clicked")}
      className={
        props.variant === "bottom_bar"
          ? "fixed inset-x-0 bottom-0 z-40 flex justify-center bg-[var(--lp-color-primary)] px-6 py-3 font-medium text-[var(--lp-color-primary-foreground)]"
          : "fixed right-6 bottom-6 z-40 rounded-full bg-[var(--lp-color-primary)] px-5 py-3 font-medium text-[var(--lp-color-primary-foreground)] shadow-lg"
      }
    >
      {props.label}
    </a>
  );
}

export const ctaStickyMeta: ComponentMeta = {
  componentId: "cta_sticky",
  category: "CTA",
  variants: ctaStickyVariantValues,
  purpose: ["action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
