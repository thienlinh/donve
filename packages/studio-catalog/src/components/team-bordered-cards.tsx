// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

const teamBorderedMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  photo: imagePropsSchema
});

export const teamBorderedCardsPropsSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  members: z.array(teamBorderedMemberSchema).min(1).max(12)
});
export type TeamBorderedCardsProps = z.infer<
  typeof teamBorderedCardsPropsSchema
>;

export function TeamBorderedCardsRender({
  props
}: BaseComponentProps<TeamBorderedCardsProps>) {
  return (
    <section
      data-lp-component="team_bordered_cards"
      className="px-6 py-16 md:px-12"
    >
      {props.heading || props.description ? (
        <div className="mb-12 flex flex-col items-center text-center">
          {props.heading ? (
            <h2 className="mb-4 font-[family-name:var(--lp-font-heading)] text-2xl font-medium text-[var(--lp-color-foreground)]">
              {props.heading}
            </h2>
          ) : null}
          {props.description ? (
            <p className="max-w-2xl text-base leading-relaxed text-[var(--lp-color-muted)]">
              {props.description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-4">
        {props.members.map((member, index) => (
          <div
            key={index}
            className="flex min-w-[260px] flex-1 basis-64 items-center rounded-[var(--lp-radius)] border border-[var(--lp-color-border)] p-4"
          >
            <img
              src={member.photo.src}
              alt={member.photo.alt}
              className="mr-4 h-16 w-16 flex-shrink-0 rounded-full bg-[var(--lp-color-muted)] object-cover"
            />
            <div className="flex-grow">
              <h3 className="font-[family-name:var(--lp-font-heading)] font-medium text-[var(--lp-color-foreground)]">
                {member.name}
              </h3>
              <p className="text-[var(--lp-color-muted)]">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const teamBorderedCardsMeta: ComponentMeta = {
  componentId: "team_bordered_cards",
  category: "Team",
  variants: [],
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
