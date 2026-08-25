import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const galleryVariantValues = ["grid", "carousel"] as const;

export const galleryPropsSchema = z.object({
  heading: z.string().optional(),
  images: z.array(imagePropsSchema).min(2).max(20),
  variant: z.enum(galleryVariantValues)
});
export type GalleryProps = z.infer<typeof galleryPropsSchema>;

export function GalleryRender({ props }: BaseComponentProps<GalleryProps>) {
  return (
    <section
      data-lp-component="gallery"
      data-lp-variant={props.variant}
      className="px-6 py-12 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-6 text-2xl font-bold text-[var(--lp-color-foreground)]">
          {props.heading}
        </h2>
      ) : null}
      <div
        className={
          props.variant === "carousel"
            ? "flex snap-x gap-4 overflow-x-auto"
            : "grid grid-cols-2 gap-4 md:grid-cols-4"
        }
      >
        {props.images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className="aspect-square w-full snap-start rounded-[var(--lp-radius)] object-cover"
          />
        ))}
      </div>
    </section>
  );
}

export const galleryMeta: ComponentMeta = {
  componentId: "gallery",
  category: "Content",
  variants: galleryVariantValues,
  purpose: ["desire"],
  trackingEvents: [],
  sensitiveProps: []
};
