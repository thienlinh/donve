const STORAGE_KEY = "dv_aid";

/**
 * `tracking-and-attribution.md` §Identity — first-party `anonymous_id`, persisted across
 * sessions so events from the same browser can be joined later. `localStorage` can throw
 * (private mode, blocked storage) — a dropped id degrades to "no identity on this event",
 * never a broken page, so every access is wrapped.
 */
export function getAnonymousId(): string | null {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const generated = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, generated);
    return generated;
  } catch {
    return null;
  }
}
