import type {
  AuditCategory,
  AuditSeverity,
  NativePageDocument
} from "@dv/contracts";
import type { componentMetadata } from "@dv/studio-catalog";
import { parseHTML } from "linkedom";

export interface RawFinding {
  category: AuditCategory;
  severity: AuditSeverity;
  message: string;
  elementId: string | null;
}

const REQUIRED_PURPOSES = [
  "understanding",
  "desire",
  "proof",
  "risk_reduction",
  "action"
] as const;

/** `quality/quality-spec.md` §Page structure (rule, 15%): "đủ section phục vụ 5 purpose". */
export function checkPageStructure(doc: NativePageDocument): RawFinding[] {
  const notes = doc.architectureNotes ?? {};
  const covered = new Set(Object.values(notes).map((n) => n.purpose));
  return REQUIRED_PURPOSES.filter((purpose) => !covered.has(purpose)).map(
    (purpose) => ({
      category: "page_structure",
      severity: "medium",
      message: `Không có section nào phục vụ mục đích "${purpose}".`,
      elementId: null
    })
  );
}

/** `quality/quality-spec.md` §SEO (rule via linkedom, 15%). */
export function checkSeo(html: string): RawFinding[] {
  const { document } = parseHTML(html);
  const findings: RawFinding[] = [];

  const title = document.querySelector("title")?.textContent?.trim();
  if (!title) {
    findings.push({
      category: "seo",
      severity: "high",
      message: "Thiếu <title>.",
      elementId: null
    });
  }

  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content")
    ?.trim();
  if (!description) {
    findings.push({
      category: "seo",
      severity: "medium",
      message: "Thiếu meta description.",
      elementId: null
    });
  }

  if (!document.querySelector('link[rel="canonical"]')) {
    findings.push({
      category: "seo",
      severity: "high",
      message: "Thiếu canonical link.",
      elementId: null
    });
  }

  if (!document.querySelector('meta[property="og:title"]')) {
    findings.push({
      category: "seo",
      severity: "medium",
      message: "Thiếu og:title.",
      elementId: null
    });
  }

  const h1Count = document.querySelectorAll("h1").length;
  if (h1Count === 0) {
    findings.push({
      category: "seo",
      severity: "medium",
      message: "Không có <h1> trên trang.",
      elementId: null
    });
  } else if (h1Count > 1) {
    findings.push({
      category: "seo",
      severity: "low",
      message: `Có ${h1Count} <h1>, nên chỉ có đúng 1.`,
      elementId: null
    });
  }

  return findings;
}

/** All `data-lp-track="..."` attribute values, space-split into individual event names —
 * multi-value like `class` (e.g. `data-lp-track="form_started form_submitted"`, see
 * `lead-form.tsx`). */
function extractTrackedEvents(html: string): Set<string> {
  const events = new Set<string>();
  for (const match of html.matchAll(/data-lp-track="([^"]*)"/g)) {
    for (const event of (match[1] ?? "").split(/\s+/).filter(Boolean)) {
      events.add(event);
    }
  }
  return events;
}

/** `quality/quality-spec.md` §Tracking completeness (rule, 10%): "So khớp eventDefinitions với
 * component đã chọn" — the full `eventDefinitions` table doesn't exist yet (Tracking &
 * Attribution, a later roadmap step), so this compares directly against each chosen
 * component's own `trackingEvents` (`@dv/studio-catalog`'s `componentMetadata`) instead. */
export function checkTrackingCompleteness(
  doc: NativePageDocument,
  html: string,
  metaById: Map<string, (typeof componentMetadata)[number]>
): RawFinding[] {
  const findings: RawFinding[] = [];
  const trackedEvents = extractTrackedEvents(html);
  const root = doc.pageSpec.elements[doc.pageSpec.root];

  for (const elementId of root?.children ?? []) {
    const element = doc.pageSpec.elements[elementId];
    if (!element) continue;
    const meta = metaById.get(element.type);
    if (!meta || meta.trackingEvents.length === 0) continue;

    for (const event of meta.trackingEvents) {
      if (!trackedEvents.has(event)) {
        findings.push({
          category: "tracking_completeness",
          severity: "medium",
          message: `Component "${element.type}" thiếu tracking event "${event}".`,
          elementId
        });
      }
    }
  }

  return findings;
}

const HEX_COLOR_OUTSIDE_TOKENS = /(?<!--lp-[\w-]*:)#[0-9a-fA-F]{3,8}\b/g;

/** `quality/quality-spec.md` §Token consistency (rule, 5%): "mọi giá trị màu/font trong HTML
 * truy được về đúng token". Components only ever emit `var(--lp-*)` references (verified by
 * this same rule) — a raw hex color anywhere outside the `:root{--lp-*:...}` token block itself
 * means something (imported HTML fragment, hand-edited prop) slipped a literal color in. */
export function checkTokenConsistency(html: string): RawFinding[] {
  const rootBlockMatch = /:root\{[^}]*\}/.exec(html);
  const withoutTokenBlock = rootBlockMatch
    ? html.replace(rootBlockMatch[0], "")
    : html;
  const matches = withoutTokenBlock.match(HEX_COLOR_OUTSIDE_TOKENS) ?? [];
  if (matches.length === 0) return [];
  return [
    {
      category: "token_consistency",
      severity: "low",
      message: `${matches.length} giá trị màu literal (không qua design token): ${matches.slice(0, 5).join(", ")}${matches.length > 5 ? "…" : ""}.`,
      elementId: null
    }
  ];
}
