// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

const footerMinimalSocialLinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

export const footerMinimalSocialPropsSchema = z.object({
  logoText: z.string(),
  copyrightText: z.string(),
  socialLinks: z.array(footerMinimalSocialLinkSchema).max(4).optional()
});
export type FooterMinimalSocialProps = z.infer<
  typeof footerMinimalSocialPropsSchema
>;

export function FooterMinimalSocialRender({
  props
}: BaseComponentProps<FooterMinimalSocialProps>) {
  return (
    <footer
      data-lp-component="footer_minimal_social"
      className="flex flex-col items-center px-5 py-8 text-[var(--lp-color-muted)] sm:flex-row"
    >
      <div className="flex items-center justify-center font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)] md:justify-start">
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
        <span className="ml-3 text-xl">{props.logoText}</span>
      </div>
      <p className="mt-4 border-[var(--lp-color-border)] py-2 text-sm sm:mt-0 sm:ml-4 sm:border-l-2 sm:pl-4">
        {props.copyrightText}
      </p>
      {props.socialLinks && props.socialLinks.length > 0 ? (
        <span className="mt-4 inline-flex justify-center gap-3 sm:mt-0 sm:ml-auto sm:justify-start">
          {props.socialLinks.map((link, index) => (
            <a key={index} href={link.href} className="text-sm">
              {link.label}
            </a>
          ))}
        </span>
      ) : null}
    </footer>
  );
}

export const footerMinimalSocialMeta: ComponentMeta = {
  componentId: "footer_minimal_social",
  category: "Footer",
  variants: [],
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
