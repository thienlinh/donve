import type { CustomChatEdit, CustomChatEditResult } from "@dv/contracts";
import type { storage } from "@dv/drivers";
import { autoNameLayers, srcmapToJson, stampSrcmap } from "@dv/studio-core";
import { parseHTML } from "linkedom";

import { ApiError } from "./errors.js";

export interface DetectedFormField {
  name: string;
  type: string;
}
export interface DetectedImportForm {
  /** Not a real CSS selector — `import-form-<index>`, the form's position among every `<form>`
   * in document order. Re-resolved the same way by `wireLeadForm` on the next call, so it stays
   * valid as long as the caller passes back a selector this same function just produced for the
   * HTML it's about to mutate. */
  selector: string;
  fields: DetectedFormField[];
}

const SELECTOR_PREFIX = "import-form-";

function formIndexFromSelector(selector: string): number {
  if (!selector.startsWith(SELECTOR_PREFIX)) {
    throw new ApiError(400, "invalid_form_selector");
  }
  const index = Number(selector.slice(SELECTOR_PREFIX.length));
  if (!Number.isInteger(index) || index < 0) {
    throw new ApiError(400, "invalid_form_selector");
  }
  return index;
}

/** AI-generated/hand-rolled HTML very commonly identifies inputs by `id` alone, with no `name`
 * attribute at all — `name` is only load-bearing for native form-encoded submits, which these
 * pages' own JS usually bypasses. Fall back to `id` so those fields are still detectable/mappable
 * instead of silently disappearing from the wizard. */
function fieldIdentifier(el: Element): string {
  return el.getAttribute("name") ?? el.getAttribute("id") ?? "";
}

/** `page-system/custom-import.md` §Integrate wizard step 1 — every `<form>` in the imported
 * HTML, with its own input/textarea/select field names so the wizard can offer a mapping to
 * the canonical lead fields (`fullName`/`phone`/`email`/`persona`). */
export function detectImportForms(html: string): DetectedImportForm[] {
  const { document } = parseHTML(html);
  return [...document.querySelectorAll("form")].map((form, index) => ({
    selector: `${SELECTOR_PREFIX}${index}`,
    fields: [...form.querySelectorAll("input, textarea, select")]
      .map((el) => ({
        name: fieldIdentifier(el),
        type: el.getAttribute("type") ?? el.tagName.toLowerCase()
      }))
      .filter((f) => f.name.length > 0)
  }));
}

/**
 * Rewrites 1 `<form>` in place so `apps/landing-runtime/src/lead-form.ts`'s `bindLeadForms`
 * (selector `form[data-dv-form="lead"]`) picks it up: tags the form, renames whichever mapped
 * fields exist to the canonical names the runtime's own `FormData` reads, and injects the 2
 * fields the runtime hard-requires but a foreign form is unlikely to already have —
 * `consent` (unchecked checkbox; the runtime blocks submit until it's checked, same as
 * `lead-form.tsx`) and `_hp` (hidden honeypot). Doesn't rewrite `action` — the runtime's own
 * submit handler ignores it entirely and POSTs to `${apiUrl}/public/leads` regardless (true for
 * every source, not a custom-import-specific gap).
 */
export function wireLeadForm(
  html: string,
  selector: string,
  fieldMapping: {
    fullName?: string;
    phone?: string;
    email?: string;
    persona?: string;
  }
): string {
  const { document } = parseHTML(html);
  const forms = [...document.querySelectorAll("form")];
  const form = forms[formIndexFromSelector(selector)];
  if (!form) throw new ApiError(404, "import_form_not_found");

  form.setAttribute("data-dv-form", "lead");

  const fields = [...form.querySelectorAll("input, textarea, select")];
  for (const [canonical, originalName] of Object.entries(fieldMapping)) {
    if (!originalName) continue;
    const field = fields.find((el) => fieldIdentifier(el) === originalName);
    if (field) field.setAttribute("name", canonical);
  }

  if (!fields.some((el) => el.getAttribute("name") === "consent")) {
    const label = document.createElement("label");
    const consentInput = document.createElement("input");
    consentInput.setAttribute("type", "checkbox");
    consentInput.setAttribute("name", "consent");
    label.appendChild(consentInput);
    label.appendChild(
      document.createTextNode(
        " Tôi đồng ý để được liên hệ và xử lý dữ liệu cá nhân."
      )
    );
    form.appendChild(label);
  }

  if (!fields.some((el) => el.getAttribute("name") === "_hp")) {
    const honeypot = document.createElement("input");
    honeypot.setAttribute("type", "text");
    honeypot.setAttribute("name", "_hp");
    honeypot.setAttribute("tabindex", "-1");
    honeypot.setAttribute("autocomplete", "off");
    honeypot.setAttribute("style", "display:none");
    form.appendChild(honeypot);
  }

  return (document as unknown as { toString(): string }).toString();
}

function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  let count = 0;
  let pos = 0;
  for (;;) {
    const idx = haystack.indexOf(needle, pos);
    if (idx === -1) break;
    count++;
    pos = idx + needle.length;
  }
  return count;
}

/**
 * Best-effort `stampSrcmap` + `autoNameLayers` on freshly-imported/reuploaded HTML so the page
 * becomes editable in the same canvas editor AI-generated pages get (`data-cc-id`s + friendly
 * `data-cc-name`s + a srcmap JSON companion object, same R2 key convention
 * `generate.routes.ts`'s `persistFirstGeneratedVersion` uses). Unlike AI output, custom-import
 * HTML comes from hand-authored/external-tool sources, so a broad catch here (not just
 * `InvalidGeneratedHtmlError`) is deliberate — any stamp/naming failure just falls back to
 * `srcmapKey: null` (today's behavior, chat-diff-only) instead of failing the import.
 */
export async function tryStampForCanvas(
  storageDriver: storage.StorageDriver,
  landingPageId: string,
  seq: number,
  html: string
): Promise<{ html: string; srcmapKey: string | null }> {
  try {
    const stamped = autoNameLayers(stampSrcmap(html)).html;
    const srcmapKey = `landing-pages/${landingPageId}/v${seq}/index.html.srcmap.json`;
    await storageDriver.put({
      key: srcmapKey,
      body: JSON.stringify(srcmapToJson(stamped), null, 2),
      contentType: "application/json"
    });
    return { html: stamped, srcmapKey };
  } catch {
    return { html, srcmapKey: null };
  }
}

/** `page-system/custom-import.md` §Comment mode + AI chat — applies each edit only if its
 * `search` occurs exactly once in the HTML *as of that point in the sequence* (an earlier edit
 * can create or remove the match an edit later in the list depends on); anything else is
 * reported, not silently dropped, so the caller can show the user exactly what didn't apply.
 * Uses a function replacer so `edit.replace` is always a literal string — `String#replace`'s
 * special `$&`/`$1` patterns never apply here. */
export function applyCustomChatEdits(
  html: string,
  edits: CustomChatEdit[]
): { html: string; results: CustomChatEditResult[] } {
  let current = html;
  const results = edits.map((edit): CustomChatEditResult => {
    const count = countOccurrences(current, edit.search);
    if (count === 0) return { ...edit, status: "not_found" };
    if (count > 1) return { ...edit, status: "ambiguous" };
    current = current.replace(edit.search, () => edit.replace);
    return { ...edit, status: "applied" };
  });
  return { html: current, results };
}
