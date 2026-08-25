/**
 * Static tracking hook — renders as a `data-lp-track` attribute on the published HTML (matches
 * `lead-form.tsx`'s own literal usage and `apps/api/src/lib/quality-audit.ts`'s
 * `checkTrackingCompleteness` regex, which only ever looks for `data-lp-track`). Event binding
 * (beacon dispatch) is `apps/landing-runtime`'s job (`tracking/tracking-and-attribution.md`).
 */
export function trackAttr(event: string): { "data-lp-track": string } {
  return { "data-lp-track": event };
}
