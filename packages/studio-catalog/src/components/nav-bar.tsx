import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const navBarVariantValues = [
  "simple",
  "mega_menu",
  "sticky_cta"
] as const;

const navLinkSchema = z.object({ label: z.string(), href: z.string() });

export const navBarPropsSchema = z.object({
  logoText: z.string(),
  logoImage: z.object({ src: z.string(), alt: z.string() }).optional(),
  links: z.array(navLinkSchema).max(6),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  variant: z.enum(navBarVariantValues)
});
export type NavBarProps = z.infer<typeof navBarPropsSchema>;

export function NavBarRender({ props }: BaseComponentProps<NavBarProps>) {
  return (
    <nav
      data-lp-component="nav_bar"
      data-lp-variant={props.variant}
      className="flex items-center justify-between px-6 py-4 md:px-12"
    >
      <div className="flex items-center gap-2 font-[family-name:var(--lp-font-heading)] text-lg font-bold text-[var(--lp-color-foreground)]">
        {props.logoImage ? (
          <img
            src={props.logoImage.src}
            alt={props.logoImage.alt}
            className="h-8 w-auto"
          />
        ) : null}
        {props.logoText}
      </div>
      <div className="hidden items-center gap-6 md:flex">
        {props.links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-[var(--lp-color-foreground)]"
          >
            {link.label}
          </a>
        ))}
      </div>
      {props.ctaLabel && props.ctaHref ? (
        <a
          href={props.ctaHref}
          {...trackAttr("cta_clicked")}
          className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-4 py-2 text-sm font-medium text-[var(--lp-color-primary-foreground)]"
        >
          {props.ctaLabel}
        </a>
      ) : null}
    </nav>
  );
}

export const navBarMeta: ComponentMeta = {
  componentId: "nav_bar",
  category: "Nav",
  variants: navBarVariantValues,
  purpose: ["understanding"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
