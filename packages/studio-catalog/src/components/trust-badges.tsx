import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const trustBadgesVariantValues = [
  "security",
  "certification",
  "guarantee"
] as const;

const trustBadgeItemSchema = z.object({
  badgeImage: imagePropsSchema.optional(),
  label: z.string(),
  /** sensitive when variant="guarantee" — carries a legal/refund claim (`component-library.md`). */
  claim: z.string().optional()
});

export const trustBadgesPropsSchema = z.object({
  items: z.array(trustBadgeItemSchema).min(1).max(6),
  variant: z.enum(trustBadgesVariantValues)
});
export type TrustBadgesProps = z.infer<typeof trustBadgesPropsSchema>;

export function TrustBadgesRender({
  props
}: BaseComponentProps<TrustBadgesProps>) {
  return (
    <section
      data-lp-component="trust_badges"
      data-lp-variant={props.variant}
      className="flex flex-wrap items-center justify-center gap-6 px-6 py-10 md:px-12"
    >
      {props.items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-1 text-center"
        >
          {item.badgeImage ? (
            <img
              src={item.badgeImage.src}
              alt={item.badgeImage.alt}
              className="h-10 w-auto"
            />
          ) : null}
          <span className="text-sm font-medium text-[var(--lp-color-foreground)]">
            {item.label}
          </span>
          {item.claim ? (
            <span className="text-xs text-[var(--lp-color-muted)]">
              {item.claim}
            </span>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export const trustBadgesMeta: ComponentMeta = {
  componentId: "trust_badges",
  category: "Trust",
  variants: trustBadgesVariantValues,
  purpose: ["risk_reduction"],
  trackingEvents: [],
  sensitiveProps: ["items[].claim"]
};
