// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

const storeBadgeSchema = z.object({
  label: z.string(),
  sublabel: z.string(),
  href: z.string()
});

export const ctaAppDownloadPropsSchema = z.object({
  eyebrow: z.string().max(60),
  headline: z.string().max(120),
  googlePlay: storeBadgeSchema,
  appStore: storeBadgeSchema
});
export type CtaAppDownloadProps = z.infer<typeof ctaAppDownloadPropsSchema>;

export function CtaAppDownloadRender({
  props
}: BaseComponentProps<CtaAppDownloadProps>) {
  return (
    <section
      data-lp-component="cta_app_download"
      className="flex flex-col items-center gap-6 bg-[var(--lp-color-surface)] px-6 py-16 md:flex-row md:px-12"
    >
      <div className="flex flex-col text-center md:pr-10 md:text-left">
        <h2 className="mb-1 font-[family-name:var(--lp-font-body)] text-xs font-medium tracking-widest text-[var(--lp-color-primary)]">
          {props.eyebrow}
        </h2>
        <h1 className="font-[family-name:var(--lp-font-heading)] text-2xl font-medium text-[var(--lp-color-foreground)] md:text-3xl">
          {props.headline}
        </h1>
      </div>
      <div className="mx-auto flex shrink-0 items-center gap-4 md:mr-0 md:ml-auto">
        <a
          href={props.googlePlay.href}
          {...trackAttr("cta_clicked")}
          className="flex items-center rounded-[var(--lp-radius)] bg-[var(--lp-color-muted)]/10 px-5 py-3"
        >
          <span className="flex flex-col items-start leading-none">
            <span className="mb-1 text-xs text-[var(--lp-color-muted)]">
              {props.googlePlay.label}
            </span>
            <span className="font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)]">
              {props.googlePlay.sublabel}
            </span>
          </span>
        </a>
        <a
          href={props.appStore.href}
          {...trackAttr("cta_clicked")}
          className="flex items-center rounded-[var(--lp-radius)] bg-[var(--lp-color-muted)]/10 px-5 py-3"
        >
          <span className="flex flex-col items-start leading-none">
            <span className="mb-1 text-xs text-[var(--lp-color-muted)]">
              {props.appStore.label}
            </span>
            <span className="font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)]">
              {props.appStore.sublabel}
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}

export const ctaAppDownloadMeta: ComponentMeta = {
  componentId: "cta_app_download",
  category: "CTA",
  variants: [],
  purpose: ["action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
