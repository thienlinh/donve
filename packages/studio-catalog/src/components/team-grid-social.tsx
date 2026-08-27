// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

const teamGridSocialLinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const teamGridSocialMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  photo: imagePropsSchema,
  socialLinks: z.array(teamGridSocialLinkSchema).max(4).optional()
});

export const teamGridSocialPropsSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  members: z.array(teamGridSocialMemberSchema).min(1).max(12)
});
export type TeamGridSocialProps = z.infer<typeof teamGridSocialPropsSchema>;

export function TeamGridSocialRender({
  props
}: BaseComponentProps<TeamGridSocialProps>) {
  return (
    <section
      data-lp-component="team_grid_social"
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
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {props.members.map((member, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <img
              src={member.photo.src}
              alt={member.photo.alt}
              className="mb-4 h-56 w-full flex-shrink-0 rounded-[var(--lp-radius)] bg-[var(--lp-color-muted)] object-cover"
            />
            <div className="w-full">
              <h3 className="font-[family-name:var(--lp-font-heading)] text-lg font-medium text-[var(--lp-color-foreground)]">
                {member.name}
              </h3>
              <p className="mb-3 text-[var(--lp-color-muted)]">{member.role}</p>
              <p className="mb-4 text-[var(--lp-color-foreground)]">
                {member.bio}
              </p>
              {member.socialLinks && member.socialLinks.length > 0 ? (
                <span className="inline-flex gap-3">
                  {member.socialLinks.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className="text-sm text-[var(--lp-color-muted)]"
                    >
                      {link.label}
                    </a>
                  ))}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const teamGridSocialMeta: ComponentMeta = {
  componentId: "team_grid_social",
  category: "Team",
  variants: [],
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
