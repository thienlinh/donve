import type { TrackEventInput } from "@dv/contracts";
import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * In-app product-usage telemetry — fire-and-forget, must never throw or block the caller
 * (see `packages/db/src/schema/tracking.ts`'s `appUsageEvents` for what this is and why it
 * exists despite only one real tenant so far). `keepalive: true` so an event fired right before
 * a navigation/unload (e.g. a click that also triggers a route change) still has a chance to
 * reach the server instead of being cancelled with the outgoing document.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  const body: { events: TrackEventInput[] } = {
    events: [{ eventName, properties }]
  };
  fetch(`${import.meta.env.VITE_API_URL}/api/telemetry/events`, {
    method: "POST",
    credentials: "include",
    keepalive: true,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).catch(() => {
    // Best-effort only — a dropped usage event must never surface anywhere in the UI.
  });
}

/** Mounted once in `_authenticated/route.tsx` — a `page_view` event on every pathname change, so
 * there's a usage baseline with zero manual instrumentation.
 * Confirmed live 2026-09-04: this fires twice per navigation in dev (verified via direct DB
 * query) — that's React `StrictMode` (`main.tsx`) intentionally double-invoking effects on
 * mount to surface non-idempotent side effects, not a bug here. Production builds don't run in
 * StrictMode, so this fires once per navigation there. */
export function usePageViewTracking(): void {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Not a data fetch feeding component state (the rule's actual concern: a race where a stale
  // response overwrites a newer one) — this is a one-way, fire-and-forget analytics beacon with
  // no response ever consumed, synchronizing with an external system exactly as `useEffect` is
  // meant for.
  // oxlint-disable-next-line react-doctor/no-fetch-in-effect
  useEffect(() => {
    trackEvent("page_view", { path: pathname });
  }, [pathname]);
}
