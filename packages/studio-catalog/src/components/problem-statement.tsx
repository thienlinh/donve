import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const problemStatementVariantValues = [
  "split_text_image",
  "agitate_list"
] as const;

export const problemStatementPropsSchema = z.object({
  headline: z.string().max(100),
  body: z.string().max(500),
  points: z.array(z.string()).max(5).optional(),
  image: imagePropsSchema.optional(),
  variant: z.enum(problemStatementVariantValues)
});
export type ProblemStatementProps = z.infer<typeof problemStatementPropsSchema>;

export function ProblemStatementRender({
  props
}: BaseComponentProps<ProblemStatementProps>) {
  return (
    <section
      data-lp-component="problem_statement"
      data-lp-variant={props.variant}
      className="grid gap-8 px-6 py-16 md:grid-cols-2 md:items-center md:px-12"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-[var(--lp-color-foreground)] md:text-3xl">
          {props.headline}
        </h2>
        <p className="text-[var(--lp-color-muted)]">{props.body}</p>
        {props.points ? (
          <ul className="list-disc space-y-2 pl-5 text-[var(--lp-color-foreground)]">
            {props.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {props.image ? (
        <img
          src={props.image.src}
          alt={props.image.alt}
          className="w-full rounded-[var(--lp-radius)] object-cover"
        />
      ) : null}
    </section>
  );
}

export const problemStatementMeta: ComponentMeta = {
  componentId: "problem_statement",
  category: "Problem",
  variants: problemStatementVariantValues,
  purpose: ["understanding"],
  trackingEvents: [],
  sensitiveProps: []
};
