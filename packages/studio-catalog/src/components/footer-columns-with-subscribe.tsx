// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

const footerColumnsWithSubscribeLinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const footerColumnsWithSubscribeGroupSchema = z.object({
  title: z.string(),
  links: z.array(footerColumnsWithSubscribeLinkSchema).min(2).max(6)
});

export const footerColumnsWithSubscribePropsSchema = z.object({
  logoText: z.string(),
  groups: z.array(footerColumnsWithSubscribeGroupSchema).min(1).max(3),
  subscribeHeading: z.string(),
  subscribePlaceholder: z.string(),
  subscribeButtonLabel: z.string(),
  subscribeNote: z.string(),
  copyrightText: z.string(),
  socialLinks: z.array(footerColumnsWithSubscribeLinkSchema).max(4).optional()
});
export type FooterColumnsWithSubscribeProps = z.infer<
  typeof footerColumnsWithSubscribePropsSchema
>;

export function FooterColumnsWithSubscribeRender({
  props
}: BaseComponentProps<FooterColumnsWithSubscribeProps>) {
  return (
    <footer
      data-lp-component="footer_columns_with_subscribe"
      className="text-[var(--lp-color-muted)]"
    >
      <div className="mx-auto px-5 py-16">
        <div className="flex flex-wrap text-center md:text-left">
          {props.groups.map((group, groupIndex) => (
            <div key={groupIndex} className="w-full px-4 sm:w-1/2 lg:w-1/4">
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
          <div className="w-full px-4 sm:w-1/2 lg:w-1/4">
            <h2 className="mb-3 text-sm font-medium tracking-widest text-[var(--lp-color-foreground)]">
              {props.subscribeHeading}
            </h2>
            <form
              data-dv-form="newsletter"
              className="flex flex-wrap items-end justify-center gap-2 md:justify-start"
            >
              <input
                type="email"
                name="email"
                className="w-40 rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] bg-[var(--lp-color-surface)] px-3 py-1 leading-8 text-[var(--lp-color-foreground)] outline-none sm:w-auto"
                placeholder={props.subscribePlaceholder}
              />
              <button
                type="submit"
                className="inline-flex flex-shrink-0 rounded-[var(--lp-radius)] border-0 bg-[var(--lp-color-primary)] px-6 py-2 text-[var(--lp-color-primary-foreground)]"
              >
                {props.subscribeButtonLabel}
              </button>
            </form>
            <p className="mt-2 text-center text-sm md:text-left">
              {props.subscribeNote}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[var(--lp-color-surface)]">
        <div className="mx-auto flex flex-col items-center px-5 py-6 sm:flex-row">
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
          <p className="mt-4 text-sm sm:mt-0 sm:ml-6">{props.copyrightText}</p>
          {props.socialLinks && props.socialLinks.length > 0 ? (
            <span className="mt-4 inline-flex justify-center gap-3 sm:mt-0 sm:ml-auto sm:justify-start">
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

export const footerColumnsWithSubscribeMeta: ComponentMeta = {
  componentId: "footer_columns_with_subscribe",
  category: "Footer",
  variants: [],
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
