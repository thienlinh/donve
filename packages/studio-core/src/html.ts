import { parseHTML } from "linkedom";

import { applyOp } from "./ops.js";
import { buildSrcmap, Srcmap } from "./srcmap.js";
import type { PatchOp } from "./types.js";

/**
 * Applies `ops` to an HTML string and returns the serialized result — used
 * server-side to validate/replay a patch without a real DOM (studio-builder-spec.md §1).
 * Same `applyOp` core as the live-DOM path, since linkedom's Document/Element
 * implement the standard DOM interfaces.
 */
export function applyOpsToHtml(html: string, ops: PatchOp[]): string {
  const { document } = parseHTML(html);
  const srcmap = buildSrcmap(document.documentElement);
  for (const op of ops) applyOp(srcmap, op);
  // linkedom's Document has a real serializing toString(); the ambient lib.dom Document type doesn't declare it.
  return (document as unknown as { toString(): string }).toString();
}

/**
 * Stamps stable `data-cc-id`s onto a raw HTML document and returns the serialized result
 * (FR-B-21) — run once on the AI's freshly-generated HTML before it's ever persisted, so
 * every later patch already has ids to target.
 */
export function stampSrcmap(html: string): string {
  const { document } = parseHTML(html);
  buildSrcmap(document.documentElement);
  return (document as unknown as { toString(): string }).toString();
}

export interface SrcmapEntry {
  id: string;
  tag: string;
  text: string;
}

/** Plain JSON view of a srcmap-tagged document's ids, for the read-only Design Files
 * "DATA" viewer (`<Page>.html.srcmap.json`, FR-B-26). Call on HTML that already went
 * through `stampSrcmap` (or any previously-tagged document — ids round-trip). */
export function srcmapToJson(html: string): SrcmapEntry[] {
  const { document } = parseHTML(html);
  buildSrcmap(document.documentElement);
  const entries: SrcmapEntry[] = [];
  for (const el of document.querySelectorAll(`[${Srcmap.idAttr}]`)) {
    entries.push({
      id: el.getAttribute(Srcmap.idAttr) ?? "",
      tag: el.tagName.toLowerCase(),
      text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80)
    });
  }
  return entries;
}
