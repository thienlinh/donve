import { parseHTML } from "linkedom";

import { buildSrcmap, Srcmap } from "./srcmap.js";

export interface ImageSource {
  srcmapId: string;
  src: string;
  attr: "src" | "poster";
  /** True when `src` was read from `data-src` (not a real `src`) — the caller should also strip
   * `data-src` off the element once resolved. Lazy-load stylesheets commonly ship a rule like
   * `img[data-src]{visibility:hidden}` (confirmed on the 2026-09-04 fixture) that only a JS
   * lazy-loader clears by removing the attribute; leaving it in place keeps the image invisible
   * forever even after `src` points at a real, loadable asset. */
  removeDataSrc?: boolean;
}

const MEDIA_SELECTORS: Array<{ tag: string; attr: "src" | "poster" }> = [
  { tag: "video", attr: "src" },
  { tag: "video", attr: "poster" },
  { tag: "source", attr: "src" }
];

/**
 * FR-B-30 "tách inline assets" — every `<img src>`/`<video src/poster>`/`<source src>` in an
 * already srcmap-stamped document, `data:` URIs and `http(s)` URLs alike. The caller
 * (apps/api) fetches/decodes each one, stores it as a real `pageAssets` row, and rewrites the
 * matched attribute via a `setAttr` op — this function only locates them.
 *
 * `<img>` also falls back to `data-src` when `src` is absent — a common lazy-load pattern
 * (confirmed live 2026-09-04 on a real import: 64/73 `<img>` tags shipped only `data-src`,
 * meant to be swapped in by a JS lazy-loader). `sanitizeLandingHtml` strips every `<script>`
 * before an imported page is ever rendered, so that swap never happens and the image never
 * shows — read the value from `data-src` but always write the resolved asset to `src`, since
 * there's no JS left to consume `data-src` at render time.
 * ponytail: not CSS `background-image: url(...)` (inline `style=` or `<style>` blocks) — add
 * that scan here too if imported pages turn out to lean on CSS background images for their
 * real content rather than decoration.
 */
export function extractImageSources(html: string): ImageSource[] {
  const { document } = parseHTML(html);
  if (!document.documentElement) return [];
  buildSrcmap(document.documentElement);

  const found: ImageSource[] = [];
  for (const el of document.querySelectorAll(`img[${Srcmap.idAttr}]`)) {
    const srcmapId = el.getAttribute(Srcmap.idAttr);
    const realSrc = el.getAttribute("src");
    const dataSrc = el.getAttribute("data-src");
    const src = realSrc || dataSrc;
    if (src && srcmapId) {
      found.push({
        srcmapId,
        src,
        attr: "src",
        removeDataSrc: !realSrc && !!dataSrc
      });
    }
  }
  for (const { tag, attr } of MEDIA_SELECTORS) {
    for (const el of document.querySelectorAll(
      `${tag}[${attr}][${Srcmap.idAttr}]`
    )) {
      const src = el.getAttribute(attr);
      const srcmapId = el.getAttribute(Srcmap.idAttr);
      if (src && srcmapId) found.push({ srcmapId, src, attr });
    }
  }
  return found;
}
