import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const solutionOverviewVariantValues = ["split", "video_demo"] as const;

export const solutionOverviewPropsSchema = z.object({
  headline: z.string().max(100),
  body: z.string().max(500),
  image: imagePropsSchema.optional(),
  videoUrl: z.string().optional(),
  variant: z.enum(solutionOverviewVariantValues)
});
export type SolutionOverviewProps = z.infer<typeof solutionOverviewPropsSchema>;

export function SolutionOverviewRender({
  props
}: BaseComponentProps<SolutionOverviewProps>) {
  return (
    <section
      data-lp-component="solution_overview"
      data-lp-variant={props.variant}
      className="grid gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:px-12"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.headline}
        </h2>
        <p className="text-[var(--lp-color-muted)]">{props.body}</p>
      </div>
      {props.variant === "video_demo" && props.videoUrl ? (
        <video
          src={props.videoUrl}
          controls
          className="w-full rounded-[var(--lp-radius)]"
        />
      ) : props.image ? (
        <img
          src={props.image.src}
          alt={props.image.alt}
          className="w-full rounded-[var(--lp-radius)] object-cover"
        />
      ) : null}
    </section>
  );
}

export const solutionOverviewMeta: ComponentMeta = {
  componentId: "solution_overview",
  category: "Solution",
  variants: solutionOverviewVariantValues,
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
