import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";
import { imagePropsSchema, videoPropsSchema } from "../shared-props.js";

export const mediaVariantValues = [
  "image",
  "video_upload",
  "youtube",
  "vimeo"
] as const;

export const mediaPropsSchema = z.object({
  /** `image` variant. */
  image: imagePropsSchema.optional(),
  /** `video_upload` variant — an uploaded asset, not a third-party URL. */
  video: videoPropsSchema.optional(),
  /** `youtube`/`vimeo` variants — the share/watch URL the user pasted. */
  embedUrl: z.string().optional(),
  caption: z.string().max(200).optional(),
  variant: z.enum(mediaVariantValues)
});
export type MediaProps = z.infer<typeof mediaPropsSchema>;

/** Accepts whatever a user pastes — watch, share, shorts or an already-embed URL. */
function youtubeEmbedUrl(url: string): string | null {
  const id = /(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/.exec(
    url
  )?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

function vimeoEmbedUrl(url: string): string | null {
  const id = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url)?.[1];
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

function MediaBody({ props }: { props: MediaProps }) {
  const className = "w-full rounded-[var(--lp-radius)]";

  if (props.variant === "image") {
    return props.image ? (
      <img
        src={props.image.src}
        alt={props.image.alt}
        className={`${className} object-cover`}
      />
    ) : null;
  }

  if (props.variant === "video_upload") {
    if (!props.video) return null;
    // `<source src>` rather than `<video src>`: the publish pipeline's URL rewriter only
    // rewrites `img[src]`/`source[src]`/`link[href]`/`video[poster]`, so a bare `video[src]`
    // would ship pointing at the authenticated draft-asset endpoint (`studio-core/publish.ts`).
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
      title={props.caption ?? "Video"}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
      className={`${className} aspect-video border-0`}
    />
  );
}

/**
 * One standalone image or video — the block `gallery` (a ≥2-image grid) and the image props
 * embedded in `hero`/`solution_overview` never covered. Large video goes through the
 * `youtube`/`vimeo` URL-embed variants; there is deliberately no transcoding pipeline
 * (`architecture-and-data-model.md` §Media/Asset).
 */
export function MediaRender({ props }: BaseComponentProps<MediaProps>) {
  return (
    <section
      data-lp-component="media"
      data-lp-variant={props.variant}
      className="px-6 py-12 md:px-12"
    >
      <figure className="mx-auto flex max-w-3xl flex-col gap-3">
        <MediaBody props={props} />
        {props.caption ? (
          <figcaption className="text-center text-sm text-[var(--lp-color-muted)]">
            {props.caption}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}

export const mediaMeta: ComponentMeta = {
  componentId: "media",
  category: "Content",
  variants: mediaVariantValues,
  purpose: ["desire", "proof"],
  trackingEvents: [],
  sensitiveProps: []
};
