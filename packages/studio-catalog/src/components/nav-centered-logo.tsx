// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

const navLinkSchema = z.object({ label: z.string(), href: z.string() });

export const navCenteredLogoPropsSchema = z.object({
  logoText: z.string(),
  logoImage: imagePropsSchema.optional(),
  links: z.array(navLinkSchema).max(4),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional()
});
export type NavCenteredLogoProps = z.infer<typeof navCenteredLogoPropsSchema>;

export function NavCenteredLogoRender({
  props
}: BaseComponentProps<NavCenteredLogoProps>) {
  return (
    <header
      data-lp-component="nav_centered_logo"
      className="flex flex-col flex-wrap items-center p-5 md:flex-row"
    >
      <nav className="flex flex-wrap items-center text-base md:ml-auto md:w-2/5">
        {props.links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="mr-5 text-[var(--lp-color-foreground)] last:mr-0 hover:text-[var(--lp-color-primary)]"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="order-first mb-4 flex items-center justify-center font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)] md:order-none md:mb-0 md:w-1/5">
        {props.logoImage ? (
          <img
            src={props.logoImage.src}
            alt={props.logoImage.alt}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lp-color-primary)] text-[var(--lp-color-primary-foreground)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-6 w-6"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
        )}
        <span className="ml-3 text-xl">{props.logoText}</span>
      </div>
      {props.ctaLabel && props.ctaHref ? (
        <div className="ml-5 inline-flex md:ml-0 md:w-2/5 md:justify-end">
          <a
            href={props.ctaHref}
            {...trackAttr("cta_clicked")}
            className="mt-4 inline-flex items-center rounded-[var(--lp-radius)] border-0 bg-[var(--lp-color-surface)] px-3 py-1 text-base text-[var(--lp-color-foreground)] hover:bg-[var(--lp-color-accent)] md:mt-0"
          >
            {props.ctaLabel}
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="ml-1 h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      ) : null}
    </header>
  );
}

export const navCenteredLogoMeta: ComponentMeta = {
  componentId: "nav_centered_logo",
  category: "Nav",
  variants: [],
  purpose: ["understanding"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
