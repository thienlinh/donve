# Architecture

Stack, dependency versions, and monorepo layout details: **`.claude/rules/tech-stack.md`** (source of truth, checked into repo). This doc covers system shape and _why_, not versions.

## 1. Principles

1. **Landing serving is isolated from everything else** — the hottest path, must be fast and resilient: pure edge + storage, never touches Postgres on the request path.
2. **Portable by design** — infra-dependent layers (jobs, storage, cache, realtime, payments) sit behind an interface in `packages/drivers`; swapping Cloudflare ↔ VPS is a driver swap, not a business-code rewrite. Exception, deliberately not portable: landing serving is pinned to Cloudflare (KV/R2/Cache API) permanently — see §5.
3. **Studio core is reusable** — `packages/studio-core` (srcmap engine, patch ops, undo/redo) has no CRM knowledge.
4. **AI returns patches, not files** — every AI edit is a structured operation applied to the srcmap → diffable, undoable, mergeable with manual edits.
5. **Multi-tenant from the first line** — `org_id` (uuid) is mandatory on every business entity.

## 2. System shape

```
Visitor ──▶ Cloudflare edge-router Worker (*.donve.vn)
              KV: hostname → deployment_id | R2: deployments/<id>/{html,assets}
              Cache API (edge cache) | /e/* event beacon
                                          │
Tenant ──▶ dashboard (Vite SPA, CF Pages) │ HTTPS/JSON + SSE
                                          ▼
                 api (Hono) — CF Workers or Bun/VPS
                   modules: auth, orgs, studio, campaigns, products,
                            leads, orders, payments, publish, ai, platform
                   drivers: jobs | storage | cache | realtime | payments
                          │            │            │
                   Neon Postgres   Upstash Redis+QStash   R2
                   (Drizzle, RLS)
                          ▲
              SePay (payments, per-org) · OpenRouter/Anthropic/OpenAI (AI Gateway) · Resend (email)
```

## 3. Monorepo layout

Full details and package-manager rules in `.claude/rules/tech-stack.md`. Summary:

- `apps/dashboard` — Vite SPA (TanStack Router/Query), talks to `api` over HTTPS/SSE.
- `apps/api` — Hono, two entrypoints (`workers.ts` CF / `bun.ts` VPS), same business code.
- `apps/edge-router` — CF Worker serving published landings (KV+R2+Cache), never touches Postgres.
- `apps/landing-runtime` — the one compiled package (IIFE via tsdown), injected into published HTML.
- `packages/studio-core/ui/ai` — legacy Studio (srcmap, canvas, patch protocol), still live in prod.
- `packages/studio-catalog/render` — new json-render/PageSpec Studio rewrite, in progress alongside the legacy one; no cutover yet.
- `packages/db` — Drizzle schema + org-scoped repositories + RLS policies.
- `packages/auth` — better-auth + organization plugin + RBAC.
- `packages/contracts` — zod schemas shared FE/BE (single source of API types).
- `packages/drivers` — jobs/storage/cache/realtime/payments interfaces + implementations.
- `packages/ai-gateway` — provider abstraction (Anthropic/OpenAI/OpenRouter) + BYOK key vault.
- `packages/ui` / `packages/config` — design system L1, tsconfig/lint/format presets.

## 4. IDs

Primary keys are native Postgres 18 `uuid` columns, default `uuidv7()` (`packages/db/src/schema/columns.ts`), not ULID text. RLS policies cast the session GUC to match: `org_id = NULLIF(current_setting('app.current_org', true), '')::uuid`.

## 5. Multi-tenancy & RLS

- **Model:** shared database, shared schema. Every business table has `org_id uuid` + a `(org_id, ...)` composite index.
- **Defense in depth:**
  1. Repository layer (`packages/db`) — every query function requires an `orgId` from session; no unscoped queries exist.
  2. Postgres RLS on sensitive tables, policy `orgIsolationPolicy()` (`packages/db/src/schema/rls.ts`) — `org_id = current_setting('app.current_org')::uuid`, fails closed (NULL) when unset.
  3. Cross-tenant test suite: org A session hitting org B's IDs must get 404/403 everywhere.
- **Neon serverless driver gotcha:** `SET LOCAL app.current_org` only takes effect if it runs in the _same_ transaction/batch as the real query — Neon's HTTP driver doesn't hold a session across separate round-trips. Fix: every `packages/db` call goes through `withOrgScope(orgId, fn)` (`packages/db/src/org-scope.ts`), which sends `set_config` and the query in one `.batch()`/transaction. No repository may issue a raw query outside this helper.
- **RBAC:** better-auth `organization` plugin + custom permissions — roles `owner > admin > editor > sales`, gating billing/members/studio/CRM/payments per table in `packages/auth/src/permissions.ts`.
- Public endpoints (`/public/*`, `/webhooks/*`) carry no session — scoped by explicit secret (campaign public id, per-org webhook key) + rate limiting.

## 6. Platform admin (cross-tenant)

- **`platform_staff` table** (`packages/db/src/schema/platform.ts`) — platform-level roles (`support`, `billing_ops`, `platform_admin`), deliberately _not_ a column on `memberships`: staff aren't scoped to one org. Granted via CLI (`bun run grant-platform-staff <email>`), not self-service.
- **Cross-tenant read via RLS, never write:** a second _permissive_ policy, `platformReadPolicy()`, ORs onto the same tables as `orgIsolationPolicy()` but is `for: "select"` only — `current_setting('app.is_platform_admin') = 'true'` unlocks reading every org's rows, while INSERT/UPDATE/DELETE still only ever pass through the org-scoped policy. There is no "write as platform admin" bypass — writing on behalf of a tenant still goes through `withOrgScope(targetOrgId, ...)` like any normal tenant write, from a specific business endpoint (disable org, refund-assist), always audited to `platform_audit_logs`.
- **`withPlatformScope`** (`packages/db/src/platform-scope.ts`) mirrors `withOrgScope` — same same-transaction requirement, sets `app.is_platform_admin` instead of `app.current_org`. Read-only use.
- Routes live at `/platform/*` in the existing `apps/api`/`apps/dashboard` (hidden route, no nav entry) — no separate `apps/admin` app; only split out if a real isolation need shows up later.

## 7. Key request flows

**AI edit** — `dashboard → POST /ai/chat` (stream) → api loads org's AI connection, compiles system prompt (base + skills + srcmap context), streams from provider → on tool call `apply_patch`: api validates ops via `studio-core` server-side, applies to current HTML, creates a `page_version`, returns the patch over SSE → client applies the same patch to the DOM (optimistic) and pushes to the undo stack.

**Publish** — Postgres (source of truth for state) and KV (source of truth for serving) are separate stores kept in sync via an **outbox pattern**: `POST /publish` creates a `deployments` row (`status=building`) → build job sanitizes/minifies/hashes assets, uploads to R2 (immutable), writes a `publish_outbox` row → a worker applies the KV hostname pointer → on success, both `deployments.status=live` and `publish_outbox.status=applied` flip together. A partial unique index on `deployments(hostname) WHERE status='live'` prevents two "live" rows for the same hostname under concurrent publishes. Rollback reuses the same outbox path (new row pointing `targetDeployId` at the old deployment) rather than a direct KV write, so reconciliation/audit stay consistent. Root-document HTML is never cached at the edge (`Cache-Control: no-store`) so rollback takes effect immediately without a purge step; content-hashed assets cache forever.

**Lead → payment** — `POST /public/leads` (Turnstile-verified, phone-deduped) creates lead+order, returns a QR/pay link. Payments are **non-custodial**: each org connects its own SePay (default) or VNPAY/MoMo/etc. account via `packages/drivers/payments`; money never passes through a platform-owned account. Webhooks are per-org (`Authorization: Apikey <secret>` looked up via `paymentConnections`), idempotent on provider transaction id.

## 8. Security highlights

- AI/imported HTML is sanitized server-side (allowlist tags/attrs, strip `<script>` except the injected runtime); edit-mode preview iframe is sandboxed without `allow-scripts`.
- BYOK provider keys: AES-256-GCM, decrypted only inside `packages/ai-gateway`, never echoed back in any API response.
- Payment webhooks: per-org secret, not a shared platform secret.
- Public endpoints: Turnstile + rate limiting (`@upstash/ratelimit`) + pending-order TTL.

## 9. Deliberate single point of failure: Cloudflare

Landing serving depends entirely on Cloudflare (KV/R2/Cache API/Workers) — a permanent, deliberate trade-off (§1), not a gap to "fix" with failover. Mitigation is insurance, not redundancy: daily R2→S3-compatible backup for disaster recovery, and an uptime monitor that pages the team on a global CF outage. There is no automatic traffic failover; landing goes down if Cloudflare does.
