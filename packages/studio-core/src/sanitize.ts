import sanitizeHtml from "sanitize-html";

// Attacker-controlled HTML enters here from two places: AI generation/patch output
// (architecture.md §7 — AI is a language model, not a sandboxed renderer, and nothing
// upstream validates that its output doesn't contain a script tag) and, later, imported
// pages (Phase 6, FR-B-30). Today the only render surface is a sandboxed iframe without
// `allow-scripts`, so this isn't yet reachable by a real visitor — but the publish
// pipeline (Phase 3) will eventually serve this exact stored HTML to real visitors at
// their own origin, so it must already be clean before it's ever persisted as a
// `pageVersion`, not sanitized only at render time.
const DANGEROUS_TAGS = new Set(["script", "noscript", "object", "embed"]);
const DANGEROUS_URL_SCHEME = /^\s*(javascript|vbscript):/i;
const URL_ATTRS = new Set(["href", "src", "action", "formaction", "poster"]);

// `<script>` is always stripped below, so this pipeline never actually runs page JS —
// meaning a `<noscript>` block's content is exactly what every visitor should see, not a
// fallback case. Unwrap it (drop only the wrapper tag) before the main sanitize pass so its
// children still go through the same on*/javascript: cleaning as everything else; if this
// regex ever misses a malformed tag, `noscript` stays in DANGEROUS_TAGS below as a safe
// fallback (drops it entirely, same as today) rather than letting it through unsanitized.
const NOSCRIPT_WRAPPER_TAG = /<\/?noscript(?:\s[^>]*)?>/gi;

/**
 * Strips `<script>`/`<object>`/`<embed>` tags, all `on*` event-handler attributes, and
 * `javascript:`/`vbscript:` URLs from a full HTML document, while leaving every other
 * tag/attribute (including `<html>`/`<head>`/`<style>`/inline `style=`) untouched — the
 * landing page must stay a complete, renderable single-file document (FR-B-21). `<noscript>`
 * wrapper tags are unwrapped (see above), not stripped with their content.
 */
export function sanitizeLandingHtml(html: string): string {
  return sanitizeHtml(html.replace(NOSCRIPT_WRAPPER_TAG, ""), {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
    exclusiveFilter: (frame) => DANGEROUS_TAGS.has(frame.tag),
    transformTags: {
      "*": (tagName, attribs) => {
        const clean: Record<string, string> = {};
        for (const [name, value] of Object.entries(attribs)) {
          if (/^on/i.test(name)) continue;
          if (
            URL_ATTRS.has(name.toLowerCase()) &&
            DANGEROUS_URL_SCHEME.test(value)
          ) {
            continue;
          }
          clean[name] = value;
        }
        return { tagName, attribs: clean };
      }
    }
  });
}
