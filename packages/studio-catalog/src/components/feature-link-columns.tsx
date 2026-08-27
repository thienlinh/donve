// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const featureLinkColumnsVariantValues = [
  "icon_bullets",
  "plain_bullets"
] as const;

const featureLinkColumnsLinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const featureLinkColumnsGroupSchema = z.object({
  title: z.string(),
  links: z.array(featureLinkColumnsLinkSchema).min(2).max(6)
});

export const featureLinkColumnsPropsSchema = z.object({
  heading: z.string().optional(),
  subheading: z.string().optional(),
  groups: z.array(featureLinkColumnsGroupSchema).min(2).max(4),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  variant: z.enum(featureLinkColumnsVariantValues)
});
export type FeatureLinkColumnsProps = z.infer<
  typeof featureLinkColumnsPropsSchema
>;

export function FeatureLinkColumnsRender({
  props
}: BaseComponentProps<FeatureLinkColumnsProps>) {
  const showBulletIcon = props.variant === "icon_bullets";
  return (
    <section
      data-lp-component="feature_link_columns"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
            {props.heading}
          </h2>
          {props.subheading ? (
            <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--lp-color-muted)]">
              {props.subheading}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {props.groups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="mb-4 text-center text-sm font-medium tracking-widest text-[var(--lp-color-foreground)] sm:text-left">
              {group.title}
            </h3>
            <nav className="flex flex-col items-center gap-2.5 text-center sm:items-start sm:text-left">
              {group.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href={link.href}
                  className="inline-flex items-center text-[var(--lp-color-muted)]"
                >
                  {showBulletIcon ? (
                    <span
                      aria-hidden="true"
                      className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--lp-color-accent)] text-[var(--lp-color-accent-foreground)]"
                    >
                      ✓
                    </span>
                  ) : null}
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>
      {props.ctaHref ? (
        <div className="mt-16 flex justify-center">
          <a
            href={props.ctaHref}
            {...trackAttr("cta_clicked")}
            className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-8 py-2 text-lg text-[var(--lp-color-primary-foreground)]"
          >
            {props.ctaLabel ?? "Khám phá ngay"}
          </a>
        </div>
      ) : null}
    </section>
  );
}

export const featureLinkColumnsMeta: ComponentMeta = {
  componentId: "feature_link_columns",
  category: "Features",
  variants: featureLinkColumnsVariantValues,
  purpose: ["desire"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
