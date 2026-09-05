import { parseHTML } from "linkedom";

import { buildSrcmap, Srcmap } from "./srcmap.js";

const NAME_ATTR = "data-cc-name";

const SEMANTIC_LABELS: Record<string, string> = {
  header: "Header",
  footer: "Footer",
  nav: "Nav",
  main: "Main",
  form: "Form",
  ul: "List",
  ol: "List",
  li: "List item",
  table: "Table",
  video: "Video",
  iframe: "Embed"
};

function collapseText(text: string, max = 24): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

/** Inline text-styling tags (span/b/strong/em/i/u): named after their own text, same as `p`. */
const INLINE_TEXT_TAGS = new Set(["span", "b", "strong", "em", "i", "u"]);

/** Heuristic label for one element — tag semantics + its own short text first, then a generic
 * "Group"/"Group: …" wrapper name for anything left (bare layout divs, empty decorative spans).
 * Always returns a name; `genericTargets` in `autoNameLayers` below is kept for any future tag
 * this function genuinely can't label, but in practice every element now gets one. */
function heuristicName(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const ownText = collapseText(el.textContent ?? "");

  if (/^h[1-6]$/.test(tag)) return `Heading: ${ownText || tag.toUpperCase()}`;
  if (tag === "button" || (tag === "a" && el.getAttribute("role") === "button"))
    return `Button: ${ownText || "Button"}`;
  if (tag === "a")
    return `Link: ${ownText || el.getAttribute("href") || "Link"}`;
  if (tag === "img") {
    const alt = el.getAttribute("alt");
    return `Image${alt ? `: ${collapseText(alt)}` : ""}`;
  }
  if (tag === "p") return `Text: ${ownText || "Paragraph"}`;
  if (tag in SEMANTIC_LABELS) return SEMANTIC_LABELS[tag]!;
  if (tag === "section" || tag === "article") {
    const heading = el.querySelector("h1, h2, h3, h4, h5, h6");
    const headingText = heading ? collapseText(heading.textContent ?? "") : "";
    if (headingText) return `Section: ${headingText}`;
  }
  if (INLINE_TEXT_TAGS.has(tag) && ownText) return `Text: ${ownText}`;

  // Generic structural fallback (div/span/section/article with no confident name above): a
  // wrapper that holds a heading or paragraph gets named after it, a bare layout/spacer
  // element gets the plain "Group" label — either way beats a raw "div 3"/"span 1".
  const meaningfulChild = el.querySelector("h1, h2, h3, h4, h5, h6, p");
  if (meaningfulChild) {
    const childText = collapseText(meaningfulChild.textContent ?? "");
    if (childText) return `Group: ${childText}`;
  }
  return SEMANTIC_LABELS[tag] ?? "Group";
}

export interface AutoNameResult {
  /** Serialized HTML with `data-cc-name` stamped on every element that already had a
   * confident heuristic name. */
  html: string;
  /** srcmap ids of elements left unnamed (generic containers) — hand these to an AI naming
   * pass; each entry includes a short outerHTML snippet for the model to look at. */
  genericTargets: { srcmapId: string; snippet: string }[];
}

const SNIPPET_MAX = 300;

/**
 * FR-B-30 "đặt tên layer tự động (heuristic + AI)" — first pass. Runs on HTML that's already
 * been through `stampSrcmap` (has `data-cc-id`s). Never overwrites a `data-cc-name` the
 * document already carries (e.g. a previously-named layer restored from an earlier import).
 */
export function autoNameLayers(html: string): AutoNameResult {
  const { document } = parseHTML(html);
  if (!document.documentElement) {
    return { html, genericTargets: [] };
  }
  buildSrcmap(document.documentElement);

  const genericTargets: AutoNameResult["genericTargets"] = [];
  for (const el of document.querySelectorAll(`[${Srcmap.idAttr}]`)) {
    if (el.hasAttribute(NAME_ATTR)) continue;
    const name = heuristicName(el);
    if (name) {
      el.setAttribute(NAME_ATTR, name);
    } else {
      genericTargets.push({
        srcmapId: el.getAttribute(Srcmap.idAttr) ?? "",
        snippet: (el.outerHTML ?? "").slice(0, SNIPPET_MAX)
      });
    }
  }

  return {
    html: (document as unknown as { toString(): string }).toString(),
    genericTargets
  };
}

/** Applies AI-proposed names for the `genericTargets` heuristic naming left blank. Unknown
 * srcmap ids are silently skipped (never thrown) — same "safe no-op" contract as `applyOp`. */
export function applyLayerNames(
  html: string,
  names: { srcmapId: string; name: string }[]
): string {
  const { document } = parseHTML(html);
  if (!document.documentElement) return html;
  const srcmap = buildSrcmap(document.documentElement);
  for (const { srcmapId, name } of names) {
    const el = srcmap.get(srcmapId);
    if (el && name.trim()) el.setAttribute(NAME_ATTR, name.trim());
  }
  return (document as unknown as { toString(): string }).toString();
}
