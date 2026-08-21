// Shape injected by packages/studio-core/src/publish.ts as `window.__DV__=...` at publish time.
export interface RuntimeConfig {
  orgId: string;
  campaignId: string | null;
  deployId: string;
  beaconUrl: string;
  /** Public API origin (`env.BETTER_AUTH_URL` — the same Hono app serves `/public/*` and auth
   * routes on one origin) — injected by `lib/publish.ts`'s `runtimeConfig`. Falls back to
   * same-origin if ever absent, so this runtime never hard-fails without it. */
  apiUrl?: string;
  /** Cloudflare Turnstile site key (FR-D-03, public by design) — injected by `lib/publish.ts`.
   * Absent = the widget never renders and `submitLead` sends an empty token, which the server
   * correctly rejects (`turnstileToken` requires `min(1)`, `packages/contracts/src/crm.ts`) —
   * this script itself never throws over it, it just surfaces the server's rejection as the
   * normal "couldn't submit" error. */
  turnstileSiteKey?: string;
}

declare global {
  interface Window {
    __DV__?: RuntimeConfig;
  }
}

export function readConfig(): RuntimeConfig | null {
  return window.__DV__ ?? null;
}
