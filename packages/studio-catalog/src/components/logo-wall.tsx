import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const logoWallVariantValues = ["grid", "marquee"] as const;

export const logoWallPropsSchema = z.object({
  heading: z.string().optional(),
  logos: z.array(imagePropsSchema).min(3).max(12),
  variant: z.enum(logoWallVariantValues)
});
export type LogoWallProps = z.infer<typeof logoWallPropsSchema>;

export function LogoWallRender({ props }: BaseComponentProps<LogoWallProps>) {
  return (
    <section
      data-lp-component="logo_wall"
      data-lp-variant={props.variant}
      className="px-6 py-12 md:px-12"
    >
      {props.heading ? (
        <p className="mb-6 text-center text-sm text-[var(--lp-color-muted)]">
          {props.heading}
        </p>
      ) : null}
      <div
        className={
          props.variant === "marquee"
            ? "flex gap-10 overflow-x-auto"
            : "grid grid-cols-2 items-center gap-8 md:grid-cols-4"
        }
      >
        {props.logos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className="h-8 w-auto grayscale"
          />
        ))}
      </div>
    </section>
  );
}

export const logoWallMeta: ComponentMeta = {
  componentId: "logo_wall",
  category: "Social proof",
  variants: logoWallVariantValues,
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
