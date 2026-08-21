import type { RuntimeConfig } from "./config.js";

// Fire-and-forget, matches apps/edge-router's `/e/<type>` beacon (architecture.md §5.1).
export function sendEvent(
  config: RuntimeConfig,
  type: string,
  meta: Record<string, unknown> = {}
): void {
  fetch(`${config.beaconUrl}/${type}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(meta),
    keepalive: true
  }).catch(() => {
    // best-effort analytics — a dropped beacon must never block form submission/popup.
  });
}
