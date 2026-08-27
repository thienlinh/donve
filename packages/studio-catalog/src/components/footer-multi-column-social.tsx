// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const footerMultiColumnSocialVariantValues = [
  "logo_left",
  "logo_below"
] as const;

const footerMultiColumnSocialLinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const footerMultiColumnSocialGroupSchema = z.object({
  title: z.string(),
  links: z.array(footerMultiColumnSocialLinkSchema).min(2).max(6)
});

export const footerMultiColumnSocialPropsSchema = z.object({
  logoText: z.string(),
  description: z.string(),
  groups: z.array(footerMultiColumnSocialGroupSchema).min(2).max(4),
  copyrightText: z.string(),
  socialLinks: z.array(footerMultiColumnSocialLinkSchema).max(4).optional(),
  variant: z.enum(footerMultiColumnSocialVariantValues)
});
export type FooterMultiColumnSocialProps = z.infer<
  typeof footerMultiColumnSocialPropsSchema
>;

export function FooterMultiColumnSocialRender({
  props
}: BaseComponentProps<FooterMultiColumnSocialProps>) {
  const groupsFirst = props.variant === "logo_below";
  return (
    <footer
      data-lp-component="footer_multi_column_social"
      data-lp-variant={props.variant}
      className="text-[var(--lp-color-muted)]"
    >
      <div className="mx-auto flex flex-col flex-wrap items-center px-5 py-16 md:flex-row md:items-start">
        <div className="w-64 flex-shrink-0 text-center md:mx-0 md:text-left">
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
          <p className="mt-2 text-sm">{props.description}</p>
        </div>
        <div
          className={`-mb-10 flex flex-grow flex-wrap text-center md:pl-20 md:text-left ${groupsFirst ? "order-first" : "mt-10 md:mt-0"}`}
        >
          {props.groups.map((group, groupIndex) => (
            <div key={groupIndex} className="w-full px-4 md:w-1/2 lg:w-1/4">
              <h2 className="mb-3 text-sm font-medium tracking-widest text-[var(--lp-color-foreground)]">
                {group.title}
              </h2>
              <nav className="mb-10 flex flex-col gap-2">
                {group.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="hover:text-[var(--lp-color-foreground)]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-[var(--lp-color-surface)]">
        <div className="mx-auto flex flex-col flex-wrap items-center px-5 py-4 sm:flex-row">
          <p className="text-center text-sm sm:text-left">
            {props.copyrightText}
          </p>
          {props.socialLinks && props.socialLinks.length > 0 ? (
            <span className="mt-2 inline-flex justify-center gap-3 sm:mt-0 sm:ml-auto sm:justify-start">
              {props.socialLinks.map((link, index) => (
                <a key={index} href={link.href} className="text-sm">
                  {link.label}
                </a>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export const footerMultiColumnSocialMeta: ComponentMeta = {
  componentId: "footer_multi_column_social",
  category: "Footer",
  variants: footerMultiColumnSocialVariantValues,
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
