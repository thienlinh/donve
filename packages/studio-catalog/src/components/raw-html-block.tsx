import type { BaseComponentProps } from "@json-render/react";
import { z } from "zod";

import type { ComponentMeta } from "../component-meta.js";

/**
 * `page-system/custom-import.md` §Convert sang native — pseudo-component, not one of the ~25
 * taxonomy components: a "convert to native" section the classifier couldn't confidently map
 * to a real catalog component keeps its original markup verbatim here instead of losing content.
 * No content schema (unlike every real component) — `html` is opaque to the Content Agent/
 * Auto Fixer, has no typed fields to fill or fix. Safe to inject raw: the source HTML was
 * already sanitized at import time (`sanitizeLandingHtml`, `custom-import.md` §Sanitize) and
 * gets sanitized again at publish time regardless of source (`buildPublishArtifacts`).
 */
export const rawHtmlBlockPropsSchema = z.object({
  html: z.string()
});
export type RawHtmlBlockProps = z.infer<typeof rawHtmlBlockPropsSchema>;

export function RawHtmlBlockRender({
  props
}: BaseComponentProps<RawHtmlBlockProps>) {
  return (
    <div
      data-lp-component="raw_html_block"
      // oxlint-disable-next-line no-danger -- see module doc: double-sanitized, opaque by design.
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
}

export const rawHtmlBlockMeta: ComponentMeta = {
  componentId: "raw_html_block",
  category: "Utility",
  variants: [],
  purpose: [],
  trackingEvents: [],
  sensitiveProps: []
};
