import type { RuntimeConfig } from "./config.js";
import { getAnonymousId } from "./identity.js";

// Fire-and-forget, matches apps/edge-router's `/e/<type>` beacon (architecture.md §5.1).
// `anonymousId`/`landingPageId`/`pageVersionId` ride at the top level of every call so
// edge-router can pull them into `events`' own columns instead of burying them in `meta`
// (`tracking-and-attribution.md` §Identity) — everything else stays under `meta` as before.
export function sendEvent(
  config: RuntimeConfig,
  type: string,
  meta: Record<string, unknown> = {}
): void {
  fetch(`${config.beaconUrl}/${type}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      anonymousId: getAnonymousId(),
      landingPageId: config.landingPageId ?? null,
      pageVersionId: config.pageVersionId ?? null,
      meta
    }),
    keepalive: true
  }).catch(() => {
    // best-effort analytics — a dropped beacon must never block form submission/popup.
  });
}
