export interface CacheSetOptions {
  ttlSeconds?: number;
}

/** App-data cache (session state, computed results, rate-limit counters) — not CF's edge Cache API, which stays landing-specific in apps/edge-router. */
export interface CacheDriver {
  get<T>(key: string): Promise<T | null>;
  // oxlint-disable-next-line no-unnecessary-type-parameters -- lets `cache.set<User>(...)` read like `cache.get<User>(...)` at the call site.
  set<T>(key: string, value: T, opts?: CacheSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
  incr(key: string, opts?: CacheSetOptions): Promise<number>;
}
