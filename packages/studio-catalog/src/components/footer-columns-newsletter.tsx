// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

const footerColumnsNewsletterLinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const footerColumnsNewsletterGroupSchema = z.object({
  title: z.string(),
  links: z.array(footerColumnsNewsletterLinkSchema).min(2).max(6)
});

export const footerColumnsNewsletterPropsSchema = z.object({
  groups: z.array(footerColumnsNewsletterGroupSchema).min(2).max(6),
  newsletterLabel: z.string(),
  newsletterPlaceholder: z.string(),
  newsletterButtonLabel: z.string(),
  newsletterNote: z.string(),
  socialLinks: z.array(footerColumnsNewsletterLinkSchema).max(4).optional(),
  copyrightText: z.string(),
  tagline: z.string().optional()
});
export type FooterColumnsNewsletterProps = z.infer<
  typeof footerColumnsNewsletterPropsSchema
>;

export function FooterColumnsNewsletterRender({
  props
}: BaseComponentProps<FooterColumnsNewsletterProps>) {
  return (
    <footer
      data-lp-component="footer_columns_newsletter"
      className="text-[var(--lp-color-muted)]"
    >
      <div className="mx-auto px-5 py-16">
        <div className="-mx-4 -mb-10 flex flex-wrap text-center md:text-left">
          {props.groups.map((group, groupIndex) => (
            <div key={groupIndex} className="w-full px-4 sm:w-1/2 lg:w-1/6">
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
      <div className="border-t border-[var(--lp-color-border)]">
        <div className="mx-auto flex flex-wrap items-center px-5 py-8">
          <form
            data-dv-form="newsletter"
            className="flex flex-wrap items-end justify-center gap-2 md:justify-start"
          >
            <div className="relative w-40 sm:w-64">
              <label
                htmlFor="footer-newsletter-field"
                className="text-sm leading-7"
              >
                {props.newsletterLabel}
              </label>
              <input
                type="email"
                id="footer-newsletter-field"
                name="email"
                className="w-full rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] bg-[var(--lp-color-surface)] px-3 py-1 leading-8 text-[var(--lp-color-foreground)] outline-none"
                placeholder={props.newsletterPlaceholder}
              />
            </div>
            <button
              type="submit"
              className="inline-flex rounded-[var(--lp-radius)] border-0 bg-[var(--lp-color-primary)] px-6 py-2 text-[var(--lp-color-primary-foreground)]"
            >
              {props.newsletterButtonLabel}
            </button>
            <p className="text-center text-sm sm:ml-4 sm:text-left">
              {props.newsletterNote}
            </p>
          </form>
          {props.socialLinks && props.socialLinks.length > 0 ? (
            <span className="mt-6 inline-flex w-full justify-center gap-3 lg:mt-0 lg:ml-auto lg:w-auto lg:justify-start">
              {props.socialLinks.map((link, index) => (
                <a key={index} href={link.href} className="text-sm">
                  {link.label}
                </a>
              ))}
            </span>
          ) : null}
        </div>
      </div>
      <div className="bg-[var(--lp-color-surface)]">
        <div className="mx-auto flex flex-col flex-wrap px-5 py-4 sm:flex-row">
          <p className="text-center text-sm sm:text-left">
            {props.copyrightText}
          </p>
          {props.tagline ? (
            <span className="mt-2 text-center text-sm sm:mt-0 sm:ml-auto sm:w-auto sm:text-left">
              {props.tagline}
            </span>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export const footerColumnsNewsletterMeta: ComponentMeta = {
  componentId: "footer_columns_newsletter",
  category: "Footer",
  variants: [],
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
