import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const footerVariantValues = [
  "standard",
  "minimal",
  "with_newsletter"
] as const;

const footerLinkSchema = z.object({ label: z.string(), href: z.string() });

export const footerPropsSchema = z.object({
  logoText: z.string(),
  links: z.array(footerLinkSchema).max(10).optional(),
  copyrightText: z.string(),
  newsletterPlaceholder: z.string().optional(),
  variant: z.enum(footerVariantValues)
});
export type FooterProps = z.infer<typeof footerPropsSchema>;

export function FooterRender({ props }: BaseComponentProps<FooterProps>) {
  return (
    <footer
      data-lp-component="footer"
      data-lp-variant={props.variant}
      className="flex flex-col gap-6 border-t border-[var(--lp-color-border)] px-6 py-10 md:px-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="font-[family-name:var(--lp-font-heading)] font-bold text-[var(--lp-color-foreground)]">
          {props.logoText}
        </span>
        {props.variant !== "minimal" && props.links ? (
          <div className="flex flex-wrap gap-4 text-sm text-[var(--lp-color-muted)]">
            {props.links.map((link, index) => (
              <a key={index} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      {props.variant === "with_newsletter" ? (
        <form data-dv-form="newsletter" className="flex max-w-sm gap-2">
          <input
            name="email"
            type="email"
            placeholder={props.newsletterPlaceholder ?? "Email của bạn"}
            className="flex-1 rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-4 py-2 text-sm font-medium text-[var(--lp-color-primary-foreground)]"
          >
            Đăng ký
          </button>
        </form>
      ) : null}
      <p className="text-xs text-[var(--lp-color-muted)]">
        {props.copyrightText}
      </p>
    </footer>
  );
}

export const footerMeta: ComponentMeta = {
  componentId: "footer",
  category: "Footer",
  variants: footerVariantValues,
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
