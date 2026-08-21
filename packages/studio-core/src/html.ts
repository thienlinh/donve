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

export class InvalidGeneratedHtmlError extends Error {
  constructor() {
    super(
      "The AI returned content that isn't a parseable HTML document — nothing to stamp."
    );
  }
}

/**
 * Stamps stable `data-cc-id`s onto a raw HTML document and returns the serialized result
 * (FR-B-21) — run once on the AI's freshly-generated HTML before it's ever persisted, so
 * every later patch already has ids to target.
 */
export function stampSrcmap(html: string): string {
  const { document } = parseHTML(html);
  // linkedom returns a Document with no `documentElement` for input that isn't real HTML at
  // all (e.g. the model returning an empty string, or prose instead of markup) — without this
  // check, `buildSrcmap` throws linkedom's own `null.tagName` internals, which is meaningless
  // to a caller and unactionable to a user (confirmed live: this is exactly what surfaced when
  // a free-tier BYOK model occasionally returned unparseable output).
  if (!document.documentElement) throw new InvalidGeneratedHtmlError();
  buildSrcmap(document.documentElement);
  return (document as unknown as { toString(): string }).toString();
}

export interface SrcmapEntry {
  id: string;
  tag: string;
  text: string;
}

export interface FunnelGaps {
  /** No `form[data-dv-form="lead"]` — the runtime script (apps/landing-runtime) has nothing
   * to bind a submit handler to, so the page can't capture leads at all. */
  missingLeadForm: boolean;
  /** No `<title>` and/or no `<meta name="description">` — the two tags AI generate always
   * fills in but an external import commonly omits or leaves generic. */
  missingSeoMeta: boolean;
}

/**
 * FR-B-31: run once right after import to decide whether the Studio should offer the
 * "chuẩn hoá phễu" wizard — AI attaching the platform's standard lead form and/or filling in
 * missing SEO meta. Read-only: never mutates `html`.
 */
export function detectFunnelGaps(html: string): FunnelGaps {
  const { document } = parseHTML(html);
  const missingLeadForm =
    document.querySelector('form[data-dv-form="lead"]') === null;
  const title = document.querySelector("title")?.textContent?.trim() ?? "";
  const description =
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content")
      ?.trim() ?? "";
  const missingSeoMeta = title === "" || description === "";
  return { missingLeadForm, missingSeoMeta };
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
