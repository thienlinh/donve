/** Env bindings — same shape read from `process.env` (Bun) or Workers bindings (CF). */
export interface Bindings {
  UPSTASH_REDIS_URL: string
  UPSTASH_REDIS_TOKEN: string
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
