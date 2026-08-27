// Layout adapted from tailblocks.cc (mertJF/tailblocks, MIT License), copy translated to Vietnamese.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema } from "../shared-props.js";

const teamSocialLinkSchema = z.object({ label: z.string(), href: z.string() });

const teamProfileMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  photo: imagePropsSchema,
  socialLinks: z.array(teamSocialLinkSchema).max(4).optional()
});

export const teamProfileSocialPropsSchema = z.object({
  heading: z.string().optional(),
  description: z.string().optional(),
  members: z.array(teamProfileMemberSchema).min(1).max(8)
});
export type TeamProfileSocialProps = z.infer<
  typeof teamProfileSocialPropsSchema
>;

export function TeamProfileSocialRender({
  props
}: BaseComponentProps<TeamProfileSocialProps>) {
  return (
    <section
      data-lp-component="team_profile_social"
      className="px-6 py-16 md:px-12"
    >
      {props.heading || props.description ? (
        <div className="mb-12 flex flex-col items-center text-center">
          {props.heading ? (
            <h2 className="mb-4 font-[family-name:var(--lp-font-heading)] text-2xl font-medium tracking-widest text-[var(--lp-color-foreground)]">
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
      <div className="grid gap-8 md:grid-cols-2">
        {props.members.map((member, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
          >
            <img
              src={member.photo.src}
              alt={member.photo.alt}
              className="mb-4 h-48 w-48 flex-shrink-0 rounded-[var(--lp-radius)] bg-[var(--lp-color-muted)] object-cover sm:mb-0"
            />
            <div className="flex-grow sm:pl-8">
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

export const teamProfileSocialMeta: ComponentMeta = {
  componentId: "team_profile_social",
  category: "Team",
  variants: [],
  purpose: ["proof"],
  trackingEvents: [],
  sensitiveProps: []
};
