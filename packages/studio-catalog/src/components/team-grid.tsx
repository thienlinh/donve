import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

export const teamGridVariantValues = ["photo_grid", "single_founder"] as const;

const teamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  photo: imagePropsSchema,
  bio: z.string().optional()
});

export const teamGridPropsSchema = z.object({
  heading: z.string().optional(),
  members: z.array(teamMemberSchema).min(1).max(12),
  variant: z.enum(teamGridVariantValues)
});
export type TeamGridProps = z.infer<typeof teamGridPropsSchema>;

export function TeamGridRender({ props }: BaseComponentProps<TeamGridProps>) {
  return (
    <section
      data-lp-component="team_grid"
      data-lp-variant={props.variant}
      className="px-6 py-16 md:px-12"
    >
      {props.heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--lp-color-foreground)]">
          {props.heading}
        </h2>
      ) : null}
      <div
        className={
          props.variant === "single_founder"
            ? "mx-auto flex max-w-md flex-col items-center gap-3 text-center"
            : "grid gap-6 md:grid-cols-4"
        }
      >
        {props.members.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1 text-center"
          >
            <img
              src={member.photo.src}
              alt={member.photo.alt}
              className="h-24 w-24 rounded-full object-cover"
            />
            <p className="font-medium text-[var(--lp-color-foreground)]">
              {member.name}
            </p>
            <p className="text-sm text-[var(--lp-color-muted)]">
              {member.role}
            </p>
            {member.bio ? (
              <p className="text-xs text-[var(--lp-color-muted)]">
                {member.bio}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export const teamGridMeta: ComponentMeta = {
  componentId: "team_grid",
  category: "Team",
  variants: teamGridVariantValues,
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
