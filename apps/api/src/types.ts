import type { WorkersAiBinding } from "@dv/ai-gateway";
import type {
  MembershipRole,
  PlatformStaffRole,
  SalesConfig
} from "@dv/contracts";
import type { storage } from "@dv/drivers";
import { z } from "zod";

/**
 * Minimal structural subset of Cloudflare's `KVNamespace` binding — same reasoning as
 * `storage.R2BucketBinding` (packages/drivers/src/storage/r2.ts): declared locally so this
 * package has no build-time dependency on `@cloudflare/workers-types`.
 */
export interface KvBinding {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

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
  /** Base64 32-byte AES-256-GCM master key wrapping `paymentConnections.encryptedApiKey` — separate from `AI_KEY_MASTER_SECRET` since a payment webhook secret is a distinct, higher-blast-radius secret domain (business-analysis.md §4.4). */
  PAYMENTS_KEY_MASTER_SECRET: string;
  /** Cloudflare Turnstile secret key (FR-D-03) — verified server-side in `POST /public/leads`. */
  TURNSTILE_SECRET_KEY: string;
  /** Cloudflare Turnstile site key (FR-D-03) — public by design, injected into published
   * landings via `lib/publish.ts`'s `runtimeConfig` so the invisible widget can render
   * client-side (`apps/landing-runtime/src/turnstile.ts`). Not a secret; safe to ship as `vars`. */
  TURNSTILE_SITE_KEY: string;
  /** Platform's own OpenRouter key for `connectionId=platform` paid-plan usage (FR-H-02) — never a tenant's key. */
  PLATFORM_OPENROUTER_API_KEY: string;
  /** Workers AI binding backing the FR-H-05 no-BYOK trial. Only present under `RUNTIME: "workers"`. */
  AI?: WorkersAiBinding;
  /** Commercial-license stock photo sources for FR-B-32/33 — optional, feature degrades to
   * "no stock suggestions" (tenant/placeholder images only) when unset. */
  UNSPLASH_ACCESS_KEY?: string;
  PEXELS_API_KEY?: string;
  /** Published-landing domain suffix — `${subdomain}.${PUBLISH_BASE_DOMAIN}` (architecture.md §5.2). */
  PUBLISH_BASE_DOMAIN: string;
  /**
   * hostname -> {deployId, orgId, campaignId} pointer, same binding apps/edge-router reads
   * (its wrangler.jsonc). Only present under `RUNTIME: "workers"` — Bun/VPS has no edge-router
   * counterpart, so `lib/publish.ts` uses the Upstash cache driver as an equivalent store there.
   */
  HOSTNAME_KV?: KvBinding;
  /**
   * `deployments/<deployId>/*` — immutable published landing output, same bucket
   * apps/edge-router reads directly (architecture.md §5.2, §3 "phạm vi portable"). Only
   * present under `RUNTIME: "workers"`.
   */
  DEPLOYMENTS_BUCKET?: storage.R2BucketBinding;
  /** Bun/VPS local-fs standing for `DEPLOYMENTS_BUCKET` — same role `LOCAL_STORAGE_DIR` plays
   * for `LANDING_ASSETS_BUCKET`. Only used under `RUNTIME: "bun"`; defaults to `.data/deployments`. */
  LOCAL_DEPLOYMENTS_DIR?: string;
  /** FR-G-04 custom domains (Cloudflare for SaaS) — API token scoped to the zone's Custom
   * Hostnames permission, and the zone id itself. Custom-domain routes 501 without these. */
  CF_API_TOKEN?: string;
  CF_ZONE_ID?: string;
  /** The fixed hostname every tenant CNAMEs their custom domain to (lib/cloudflare-saas.ts
   * "http" DCV validates once this points at it) — same value shown in every tenant's setup
   * instructions, configured once at the zone level, not per-hostname. */
  CF_CUSTOM_DOMAIN_TARGET?: string;
  /** NFR-14 traffic-spike alert recipient (founder/ops) — feature no-ops without it, same
   * pattern as `RESEND_API_KEY` gating `runLeadDigest`. */
  FOUNDER_ALERT_EMAIL?: string;
}

/** Per-request context set by middleware/route handlers. */
export interface Variables {
  requestId: string;
  /** Set by auth middleware once session/org resolution lands; null until then. */
  orgId: string | null;
  /** Set by `requireOrgSession` alongside `orgId` — the current user's id within that org. */
  userId: string;
  /** Set by `requireOrgSession` — this user's role in the active org (architecture.md §6). */
  membershipRole: MembershipRole;
  /** Set by `requireOrgSession` — `memberships.salesConfig` (e.g. `seeAllLeads`, FR-E-04). */
  salesConfig: SalesConfig;
  /** Set by `requirePlatformStaff` (platform-admin.md §4) — only present on `/platform/*` routes. */
  platformStaffId: string;
  platformStaffRole: PlatformStaffRole;
}

export interface AppEnv {
  Bindings: Bindings;
  Variables: Variables;
}

/**
 * The subset of `Bindings` that crashes a route with a generic 500 the instant it's empty
 * (encryption/auth/DB — see AI_KEY_MASTER_SECRET's history, apps/api/.env.local). Bun/VPS
 * (`bun.ts`) parses `process.env` against this at boot so a missing secret fails loudly on
 * startup instead of on the first request that happens to hit it. CF Workers has no
 * equivalent gap — `wrangler secret`s are present-or-deploy-fails, so `workers.ts` skips this.
 */
export const requiredBindingsSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  AI_KEY_MASTER_SECRET: z.string().min(1, "AI_KEY_MASTER_SECRET is required"),
  PAYMENTS_KEY_MASTER_SECRET: z
    .string()
    .min(1, "PAYMENTS_KEY_MASTER_SECRET is required")
});
