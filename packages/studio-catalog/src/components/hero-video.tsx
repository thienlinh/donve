// Layout pattern (text left, video right) is common across free landing templates
// (e.g. ThemeWagon's SaaS/product-demo heroes) — adapted here as a typed catalog component
// rather than copied markup.
import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { videoPropsSchema } from "../shared-props.js";
import { trackAttr } from "../tracking.js";
import { vimeoEmbedUrl, youtubeEmbedUrl } from "./media.js";

export const heroVideoVariantValues = [
  "video_upload",
  "youtube",
  "vimeo"
] as const;

export const heroVideoPropsSchema = z.object({
  headline: z.string().max(80),
  subheadline: z.string().max(240),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  secondaryCtaLabel: z.string().optional(),
  /** `video_upload` variant. */
  video: videoPropsSchema.optional(),
  /** `youtube`/`vimeo` variants — the share/watch URL the user pasted. */
  embedUrl: z.string().optional(),
  variant: z.enum(heroVideoVariantValues)
});
export type HeroVideoProps = z.infer<typeof heroVideoPropsSchema>;

function HeroVideoMedia({ props }: { props: HeroVideoProps }) {
  const className = "w-full rounded-[var(--lp-radius)]";

  if (props.variant === "video_upload") {
    if (!props.video) return null;
    // Same rationale as `media.tsx`: `<source src>` so the publish pipeline's URL rewriter
    // (which only rewrites `source[src]`, not a bare `video[src]`) still applies.
    return (
      <video controls poster={props.video.poster} className={className}>
        <source src={props.video.src} />
      </video>
    );
  }

  if (!props.embedUrl) return null;
  const embedUrl =
    props.variant === "youtube"
      ? youtubeEmbedUrl(props.embedUrl)
      : vimeoEmbedUrl(props.embedUrl);
  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title={props.headline}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
      className={`${className} aspect-video border-0`}
    />
  );
}

export function HeroVideoRender({ props }: BaseComponentProps<HeroVideoProps>) {
  return (
    <section
      data-lp-component="hero_video"
      data-lp-variant={props.variant}
      className="flex flex-col items-center gap-10 px-6 py-16 md:flex-row md:px-12 md:py-24"
    >
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <h1 className="font-[family-name:var(--lp-font-heading)] text-3xl font-medium text-[var(--lp-color-foreground)] md:text-4xl">
          {props.headline}
        </h1>
        <p className="font-[family-name:var(--lp-font-body)] leading-relaxed text-[var(--lp-color-muted)]">
          {props.subheadline}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={props.ctaHref}
            {...trackAttr("cta_clicked")}
            className="inline-flex rounded-[var(--lp-radius)] bg-[var(--lp-color-primary)] px-6 py-2 text-lg font-medium text-[var(--lp-color-primary-foreground)]"
          >
            {props.ctaLabel}
          </a>
          {props.secondaryCtaLabel ? (
            <span className="inline-flex rounded-[var(--lp-radius)] bg-[var(--lp-color-surface)] px-6 py-2 text-lg text-[var(--lp-color-foreground)]">
              {props.secondaryCtaLabel}
            </span>
          ) : null}
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <HeroVideoMedia props={props} />
      </div>
    </section>
  );
}

export const heroVideoMeta: ComponentMeta = {
  componentId: "hero_video",
  category: "Hero",
  variants: heroVideoVariantValues,
  purpose: ["understanding", "desire", "action"],
  trackingEvents: ["cta_clicked"],
  sensitiveProps: []
};
