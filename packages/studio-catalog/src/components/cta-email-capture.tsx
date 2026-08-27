// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const ctaEmailCaptureVariantValues = ["card", "inline_form"] as const;

export const ctaEmailCapturePropsSchema = z.object({
  headline: z.string().max(120),
  description: z.string().max(240).optional(),
  nameLabel: z.string(),
  emailLabel: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  helperText: z.string().optional(),
  variant: z.enum(ctaEmailCaptureVariantValues)
});
export type CtaEmailCaptureProps = z.infer<typeof ctaEmailCapturePropsSchema>;

export function CtaEmailCaptureRender({
  props
}: BaseComponentProps<CtaEmailCaptureProps>) {
  const nameField = (
    <label className="relative mb-4 block text-left text-sm leading-7 text-[var(--lp-color-muted)]">
      {props.nameLabel}
      <input
        type="text"
        className="w-full rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] bg-[var(--lp-color-surface)] px-3 py-1 leading-8 text-[var(--lp-color-foreground)] outline-none focus:border-[var(--lp-color-primary)]"
      />
    </label>
  );
  const emailField = (
    <label className="relative mb-4 block text-left text-sm leading-7 text-[var(--lp-color-muted)]">
      {props.emailLabel}
      <input
        type="email"
        className="w-full rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] bg-[var(--lp-color-surface)] px-3 py-1 leading-8 text-[var(--lp-color-foreground)] outline-none focus:border-[var(--lp-color-primary)]"
      />
    </label>
  );
  const submitButton = (
    <a
      href={props.ctaHref}
      {...trackAttr("cta_clicked")}
      className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-8 py-2 text-center text-lg font-medium text-[var(--lp-color-primary-foreground)]"
    >
      {props.ctaLabel}
    </a>
  );

  if (props.variant === "card") {
    return (
      <section
        data-lp-component="cta_email_capture"
        data-lp-variant={props.variant}
        className="px-6 py-16 md:px-12"
      >
        <div className="mx-auto flex w-full flex-col md:flex-row md:items-center lg:w-2/3">
          <div className="mb-6 md:mb-0 md:w-3/5 md:pr-16">
            <h1 className="font-[family-name:var(--lp-font-heading)] text-3xl font-medium text-[var(--lp-color-foreground)]">
              {props.headline}
            </h1>
            {props.description ? (
              <p className="mt-4 leading-relaxed text-[var(--lp-color-muted)]">
                {props.description}
              </p>
            ) : null}
          </div>
          <div className="flex w-full flex-col rounded-[var(--lp-radius)] bg-[var(--lp-color-surface)] p-8 md:ml-auto md:w-2/5">
            {nameField}
            {emailField}
            {submitButton}
            {props.helperText ? (
              <p className="mt-3 text-xs text-[var(--lp-color-muted)]">
                {props.helperText}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-lp-component="cta_email_capture"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      <div className="mx-auto mb-12 flex w-full flex-col text-center">
        <h1 className="mb-4 font-[family-name:var(--lp-font-heading)] text-2xl font-medium text-[var(--lp-color-foreground)] sm:text-3xl">
          {props.headline}
        </h1>
        {props.description ? (
          <p className="mx-auto leading-relaxed text-[var(--lp-color-muted)] lg:w-2/3">
            {props.description}
          </p>
        ) : null}
      </div>
      <div className="mx-auto flex w-full flex-col items-end gap-4 px-8 sm:flex-row sm:space-y-0 lg:w-2/3">
        <div className="w-full flex-grow">{nameField}</div>
        <div className="w-full flex-grow">{emailField}</div>
        {submitButton}
      </div>
    </section>
  );
}

export const ctaEmailCaptureMeta: ComponentMeta = {
  componentId: "cta_email_capture",
  category: "CTA",
  variants: ctaEmailCaptureVariantValues,
  purpose: ["action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
