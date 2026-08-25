import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { trackAttr } from "../tracking.js";

export const announcementBarPropsSchema = z.object({
  text: z.string().max(160),
  linkLabel: z.string().optional(),
  linkHref: z.string().optional(),
  dismissible: z.boolean().default(true)
});
export type AnnouncementBarProps = z.infer<typeof announcementBarPropsSchema>;

export function AnnouncementBarRender({
  props
}: BaseComponentProps<AnnouncementBarProps>) {
  return (
    <div
      data-lp-component="announcement_bar"
      className="flex items-center justify-center gap-2 bg-[var(--lp-color-primary)] px-4 py-2 text-center text-sm text-[var(--lp-color-primary-foreground)]"
    >
      <span>{props.text}</span>
      {props.linkLabel && props.linkHref ? (
        <a
          href={props.linkHref}
          {...trackAttr("cta_clicked")}
          className="underline"
        >
          {props.linkLabel}
        </a>
      ) : null}
      {props.dismissible ? (
        <button
          type="button"
          data-dv-announcement-dismiss
          aria-label="Đóng"
          className="ml-2"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export const announcementBarMeta: ComponentMeta = {
  componentId: "announcement_bar",
  category: "Utility",
  variants: [],
  purpose: [],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
