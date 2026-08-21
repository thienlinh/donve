import { parseHTML } from "linkedom";

import { buildSrcmap, Srcmap } from "./srcmap.js";

export interface ImageSource {
  srcmapId: string;
  src: string;
}

/**
 * FR-B-30 "tách inline assets" — every `<img src>` in an already srcmap-stamped document,
 * `data:` URIs and `http(s)` URLs alike. The caller (apps/api) fetches/decodes each one,
 * stores it as a real `pageAssets` row, and rewrites `src` via a `setAttr` op — this function
 * only locates them.
 * ponytail: `<img>` only, not CSS `background-image: url(...)` (inline `style=` or `<style>`
 * blocks) — add that scan here too if imported pages turn out to lean on CSS background images
 * for their real content rather than decoration.
 */
export function extractImageSources(html: string): ImageSource[] {
  const { document } = parseHTML(html);
  if (!document.documentElement) return [];
  buildSrcmap(document.documentElement);

  const found: ImageSource[] = [];
  for (const el of document.querySelectorAll(`img[src][${Srcmap.idAttr}]`)) {
    const src = el.getAttribute("src");
    const srcmapId = el.getAttribute(Srcmap.idAttr);
    if (src && srcmapId) found.push({ srcmapId, src });
  }
  return found;
}
