import type { WorkersAiBinding } from "@dv/ai-gateway";
import type { PlatformStaffRole } from "@dv/contracts";
import type { storage } from "@dv/drivers";

/** Env bindings — same shape read from `process.env` (Bun) or Workers bindings (CF). */
export interface Bindings {
  UPSTASH_REDIS_URL: string;
  UPSTASH_REDIS_TOKEN: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  /** dashboard origin — CORS allow-list + invite/verify/reset link target. */
  DASHBOARD_URL: string;
  RESEND_API_KEY: string;
  /** picks the DB driver in `lib/db.ts` (neon-http vs postgres-js, architecture.md §3). */
  RUNTIME: "workers" | "bun";
  /**
   * R2 binding for studio draft assets (page HTML/srcmap) — distinct from the
   * Cloudflare-only `deployments/*` bucket in apps/edge-router (architecture.md §3
   * "phạm vi portable"). Only present under `RUNTIME: "workers"`.
   */
  LANDING_ASSETS_BUCKET?: storage.R2BucketBinding;
  /**
   * Local-dev standing for the real VPS storage driver (S3-compatible, Phase 7,
   * architecture.md §3) — same role docker-compose's Postgres/Redis play for
   * Neon/Upstash. Only used under `RUNTIME: "bun"`; defaults to `.data/storage`.
   */
  LOCAL_STORAGE_DIR?: string;
  /** Base64 32-byte AES-256-GCM master key wrapping BYOK `aiConnections.encryptedKey` (ai-integration-byok.md §2). */
  AI_KEY_MASTER_SECRET: string;
  /** Platform's own OpenRouter key for `connectionId=platform` paid-plan usage (FR-H-02) — never a tenant's key. */
  PLATFORM_OPENROUTER_API_KEY: string;
  /** Workers AI binding backing the FR-H-05 no-BYOK trial. Only present under `RUNTIME: "workers"`. */
  AI?: WorkersAiBinding;
  /** Commercial-license stock photo sources for FR-B-32/33 — optional, feature degrades to
   * "no stock suggestions" (tenant/placeholder images only) when unset. */
  UNSPLASH_ACCESS_KEY?: string;
  PEXELS_API_KEY?: string;
}

/** Per-request context set by middleware/route handlers. */
export interface Variables {
  requestId: string;
  /** Set by auth middleware once session/org resolution lands; null until then. */
  orgId: string | null;
  /** Set by `requirePlatformStaff` (platform-admin.md §4) — only present on `/platform/*` routes. */
  platformStaffId: string;
  platformStaffRole: PlatformStaffRole;
}

export interface AppEnv {
  Bindings: Bindings;
  Variables: Variables;
}
