// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";

const navLinkSchema = z.object({ label: z.string(), href: z.string() });

export const navCenteredLinksPropsSchema = z.object({
  logoText: z.string(),
  logoImage: imagePropsSchema.optional(),
  links: z.array(navLinkSchema).max(4),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional()
});
export type NavCenteredLinksProps = z.infer<typeof navCenteredLinksPropsSchema>;

export function NavCenteredLinksRender({
  props
}: BaseComponentProps<NavCenteredLinksProps>) {
  return (
    <header
      data-lp-component="nav_centered_links"
      className="flex flex-col flex-wrap items-center p-5 md:flex-row"
    >
      <div className="mb-4 flex items-center font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)] md:mb-0">
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
      <nav className="flex flex-wrap items-center justify-center text-base md:mr-auto md:ml-auto">
        {props.links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="mr-5 text-[var(--lp-color-foreground)] hover:text-[var(--lp-color-primary)]"
          >
            {link.label}
          </a>
        ))}
      </nav>
      {props.ctaLabel && props.ctaHref ? (
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
      ) : null}
    </header>
  );
}

export const navCenteredLinksMeta: ComponentMeta = {
  componentId: "nav_centered_links",
  category: "Nav",
  variants: [],
  purpose: ["understanding"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
