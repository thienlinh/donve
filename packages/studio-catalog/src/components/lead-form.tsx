import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const leadFormVariantValues = [
  "inline_short",
  "inline_progressive",
  "modal_trigger"
] as const;

export const leadFormPropsSchema = z.object({
  heading: z.string().optional(),
  submitLabel: z.string(),
  triggerLabel: z.string().optional(),
  showEmail: z.boolean().default(true),
  showPersona: z.boolean().default(false),
  personaOptions: z.array(z.string()).optional(),
  consentText: z.string(),
  variant: z.enum(leadFormVariantValues)
});
export type LeadFormProps = z.infer<typeof leadFormPropsSchema>;

/**
 * Fields/attrs (`data-dv-form="lead"`, `fullName/phone/email/persona/consent/_hp`) match
 * `apps/landing-runtime/src/lead-form.ts` exactly — that runtime is unchanged, so this markup
 * is wire-compatible without touching it. Progressive disclosure (variant=inline_progressive)
 * and the modal open/close (variant=modal_trigger) are landing-runtime behaviors added in a
 * later roadmap step; SSR renders the full field set statically for every variant today.
 * `form_started`/`form_submitted` are both wired live in `apps/landing-runtime/src/lead-form.ts`
 * (`bindLeadForms`) — `form_started` on first focus inside this form, `form_submitted` after a
 * real API success (a superset of the plain `submit` beacon it already fired, kept for the
 * legacy campaign-analytics dashboard's `submits` bucket).
 */
function LeadFormFields({ props }: BaseComponentProps<LeadFormProps>) {
  return (
    <form
      data-dv-form="lead"
      data-lp-variant={props.variant}
      {...trackAttr("form_started form_submitted")}
      className="flex flex-col gap-3"
    >
      {props.heading ? (
        <h3 className="font-medium text-[var(--lp-color-foreground)]">
          {props.heading}
        </h3>
      ) : null}
      <input
        name="fullName"
        type="text"
        placeholder="Họ và tên"
        required
        className="rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] px-4 py-2"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Số điện thoại"
        required
        className="rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] px-4 py-2"
      />
      {props.showEmail ? (
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] px-4 py-2"
        />
      ) : null}
      {props.showPersona && props.personaOptions ? (
        <select
          name="persona"
          className="rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] px-4 py-2"
        >
          {props.personaOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}
      <input
        name="_hp"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      <label className="flex items-start gap-2 text-xs text-[var(--lp-color-muted)]">
        <input name="consent" type="checkbox" required />
        {props.consentText}
      </label>
      <button
        type="submit"
        className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-4 py-2 font-medium text-[var(--lp-color-primary-foreground)]"
      >
        {props.submitLabel}
      </button>
    </form>
  );
}

export function LeadFormRender(ctx: BaseComponentProps<LeadFormProps>) {
  const { props } = ctx;
  if (props.variant !== "modal_trigger") {
    return (
      <div
        data-lp-component="lead_form"
        className="px-6 py-16 md:px-12"
        data-lp-variant={props.variant}
      >
        <LeadFormFields {...ctx} />
      </div>
    );
  }
  return (
    <div
      data-lp-component="lead_form"
      className="px-6 py-16 md:px-12"
      data-lp-variant={props.variant}
    >
      <button
        type="button"
        data-dv-popup-open="lead"
        className="rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-6 py-3 font-medium text-[var(--lp-color-primary-foreground)]"
      >
        {props.triggerLabel ?? props.submitLabel}
      </button>
      <dialog
        data-dv-popup="lead"
        aria-label={props.heading ?? props.submitLabel}
      >
        <LeadFormFields {...ctx} />
      </dialog>
    </div>
  );
}

export const leadFormMeta: ComponentMeta = {
  componentId: "lead_form",
  category: "Lead capture",
  variants: leadFormVariantValues,
  purpose: ["action"],
  trackingEvents: ["form_started", "form_submitted"],
  sensitiveProps: []
};
