import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const countdownTimerVariantValues = ["banner", "inline"] as const;

export const countdownTimerPropsSchema = z.object({
  headline: z.string().max(80).optional(),
  /** ISO 8601 instant the offer/webinar closes. */
  endsAt: z.iso.datetime({ offset: true }),
  /** Shown instead of the digits once `endsAt` has passed. */
  expiredText: z.string().max(80).optional(),
  variant: z.enum(countdownTimerVariantValues)
});
export type CountdownTimerProps = z.infer<typeof countdownTimerPropsSchema>;

const UNIT_LABELS = [
  ["days", "Ngày"],
  ["hours", "Giờ"],
  ["minutes", "Phút"],
  ["seconds", "Giây"]
] as const;

/**
 * Scarcity/urgency block (`component-library.md` §Urgency). Published HTML is static, so the
 * digits render as placeholders and `apps/landing-runtime`'s `bindCountdowns` ticks them from
 * the `data-dv-countdown` deadline — the same static-hook contract `lead_form`/`announcement_bar`
 * use, since the remaining time depends on when the visitor loads the page, not on build time.
 */
export function CountdownTimerRender({
  props
}: BaseComponentProps<CountdownTimerProps>) {
  return (
    <section
      data-lp-component="countdown_timer"
      data-lp-variant={props.variant}
      data-dv-countdown={props.endsAt}
      className={
        props.variant === "banner"
          ? "flex flex-col items-center gap-3 bg-[var(--lp-color-primary)] px-6 py-6 text-[var(--lp-color-primary-foreground)]"
          : "flex flex-col items-center gap-3 px-6 py-8 text-[var(--lp-color-foreground)]"
      }
    >
      {props.headline ? (
        <p className="text-lg font-semibold">{props.headline}</p>
      ) : null}
      <div className="flex items-start gap-4" data-dv-countdown-digits>
        {UNIT_LABELS.map(([unit, label]) => (
          <div key={unit} className="flex min-w-14 flex-col items-center">
            <span
              data-dv-countdown-unit={unit}
              className="text-3xl font-bold tabular-nums"
            >
              --
            </span>
            <span className="text-xs opacity-80">{label}</span>
          </div>
        ))}
      </div>
      {props.expiredText ? (
        <p data-dv-countdown-expired hidden className="text-lg font-semibold">
          {props.expiredText}
        </p>
      ) : null}
    </section>
  );
}

export const countdownTimerMeta: ComponentMeta = {
  componentId: "countdown_timer",
  category: "Urgency",
  variants: countdownTimerVariantValues,
  purpose: ["action"],
  trackingEvents: [],
  sensitiveProps: []
};
