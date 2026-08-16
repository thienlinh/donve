/** Env bindings — same shape read from `process.env` (Bun) or Workers bindings (CF). */
export interface Bindings {
  UPSTASH_REDIS_URL: string
  UPSTASH_REDIS_TOKEN: string
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  /** dashboard origin — CORS allow-list + invite/verify/reset link target. */
  DASHBOARD_URL: string
  RESEND_API_KEY: string
  /** picks the DB driver in `lib/db.ts` (neon-http vs postgres-js, architecture.md §3). */
  RUNTIME: "workers" | "bun"
}

/** Per-request context set by middleware/route handlers. */
export interface Variables {
  requestId: string
  /** Set by auth middleware once session/org resolution lands; null until then. */
  orgId: string | null
}

export interface AppEnv {
  Bindings: Bindings
  Variables: Variables
}
