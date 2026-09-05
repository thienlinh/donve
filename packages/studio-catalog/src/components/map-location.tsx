// Address+map pattern common to local-business landing templates (restaurants, clinics,
// real estate, travel — heavily represented among ThemeWagon's free templates) — adapted
// here as a typed catalog component, not copied markup.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

export const mapLocationVariantValues = ["side_by_side", "stacked"] as const;

export const mapLocationPropsSchema = z.object({
  heading: z.string().max(80).optional(),
  address: z.string().max(200),
  /** Google Maps (or equivalent) embed URL, e.g. from Maps' Share > Embed a map. */
  mapEmbedUrl: z.string(),
  hours: z.array(z.string().max(80)).max(7).optional(),
  phone: z.string().max(40).optional(),
  email: z.string().max(120).optional(),
  variant: z.enum(mapLocationVariantValues)
});
export type MapLocationProps = z.infer<typeof mapLocationPropsSchema>;

export function MapLocationRender({
  props
}: BaseComponentProps<MapLocationProps>) {
  const stacked = props.variant === "stacked";
  return (
    <section
      data-lp-component="map_location"
      data-lp-variant={props.variant}
      className={`flex gap-10 px-6 py-16 md:px-12 ${
        stacked ? "flex-col" : "flex-col md:flex-row"
      }`}
    >
      <div className="flex flex-1 flex-col gap-3">
        {props.heading ? (
          <h2 className="font-[family-name:var(--lp-font-heading)] text-2xl font-medium text-[var(--lp-color-foreground)] md:text-3xl">
            {props.heading}
          </h2>
        ) : null}
        <p className="text-[var(--lp-color-foreground)]">{props.address}</p>
        {props.hours?.length ? (
          <ul className="flex flex-col gap-1 text-sm text-[var(--lp-color-muted)]">
            {props.hours.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        ) : null}
        {props.phone ? (
          <a
            href={`tel:${props.phone}`}
            className="text-sm text-[var(--lp-color-primary)]"
          >
            {props.phone}
          </a>
        ) : null}
        {props.email ? (
          <a
            href={`mailto:${props.email}`}
            className="text-sm text-[var(--lp-color-primary)]"
          >
            {props.email}
          </a>
        ) : null}
      </div>
      <iframe
        src={props.mapEmbedUrl}
        title={props.heading ?? props.address}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-video w-full flex-1 rounded-[var(--lp-radius)] border-0"
      />
    </section>
  );
}

export const mapLocationMeta: ComponentMeta = {
  componentId: "map_location",
  category: "Content",
  variants: mapLocationVariantValues,
  purpose: ["understanding", "risk_reduction"],
  trackingEvents: [],
  sensitiveProps: []
};
