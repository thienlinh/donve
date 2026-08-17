import { fileURLToPath } from "node:url";

import { schema } from "@dv/db";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import type { Bindings } from "../src/types.js";

/**
 * NFR-04 / architecture.md §6: a user in org A must never be able to read or
 * mutate org B's data by supplying org B's id. The only mounted business
 * surface today is Better Auth's own `/api/auth/*` handler (organization
 * plugin — apps/api/src/app.ts) — no custom app routes exist yet (Phase 4+),
 * so this suite drives the real mounted app end-to-end (real Postgres via
 * testcontainers, real sign-up/sign-in/session-cookie flow) rather than
 * calling repository functions directly, since the isolation guarantees here
 * live in the plugin's request handlers, not in Postgres RLS (organizations/
 * memberships/invites intentionally have no RLS policy — see
 * packages/db/src/repositories/organizations.ts and migrations/0001).
 *
 * Signup normally emails a verification link via Resend (packages/drivers) —
 * `requireEmailVerification: true` is hardcoded in packages/auth/src/config.ts,
 * so sign-in is blocked until verified regardless. Tests fake that by writing
 * `emailVerified` directly and stub `fetch` for Resend's API host so the real
 * send call (still fired on sign-up) can't reach the network with a fake key.
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;
let rawDb: ReturnType<typeof drizzle>;
const app = createApp();
const originalFetch = globalThis.fetch;

interface Organization {
  id: string;
  slug: string;
}

interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
}

interface Invitation {
  id: string;
  organizationId: string;
  email: string;
}

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:17-alpine").start();
  const connectionUri = container.getConnectionUri();

  const migratorClient = postgres(connectionUri, { max: 1 });
  rawDb = drizzle(migratorClient, { schema });
  await migrate(rawDb, {
    // drizzle's migrator joins this with `/meta/_journal.json` via plain string
    // concatenation (no path.join) — forward slashes only, or the mixed
    // separators break `fs.existsSync` on Windows.
    migrationsFolder: fileURLToPath(
      new URL("../../../packages/db/migrations", import.meta.url)
    ).replaceAll("\\", "/")
  });

  bindings = {
    UPSTASH_REDIS_URL: "unused",
    UPSTASH_REDIS_TOKEN: "unused",
    DATABASE_URL: connectionUri,
    BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
    BETTER_AUTH_URL: "http://localhost:3000",
    DASHBOARD_URL: "http://localhost:5173",
    RESEND_API_KEY: "test-key",
    RUNTIME: "bun"
  };

  // Only Resend's own send call goes over the network during these tests —
  // every app request below is dispatched in-process via `app.fetch`.
  globalThis.fetch = async (input, init) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    if (url.startsWith("https://api.resend.com")) {
      return new Response(JSON.stringify({ id: "test-email-id" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return originalFetch(input, init);
  };
}, 60_000);

afterAll(async () => {
  globalThis.fetch = originalFetch;
  await container.stop();
});

async function req(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type"))
    headers.set("content-type", "application/json");
  return app.fetch(
    new Request(`http://localhost${path}`, { ...init, headers }),
    bindings
  );
}

/** Signs up, force-verifies via direct DB write, signs in, and returns the session cookie. */
async function signUpAndSignIn(email: string, password: string, name: string) {
  const signUpRes = await req("/api/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ email, password, name })
  });
  if (!signUpRes.ok) {
    throw new Error(
      `sign-up failed: ${signUpRes.status} ${await signUpRes.text()}`
    );
  }

  await rawDb
    .update(schema.user)
    .set({ emailVerified: true })
    .where(eq(schema.user.email, email));

  const signInRes = await req("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (!signInRes.ok) {
    throw new Error(
      `sign-in failed: ${signInRes.status} ${await signInRes.text()}`
    );
  }
  const cookie = signInRes.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  if (!cookie) throw new Error("sign-in did not return a session cookie");
  return cookie;
}

async function authed(cookie: string, path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("cookie", cookie);
  return req(path, { ...init, headers });
}

describe("cross-tenant isolation on /api/auth/* (organization plugin, NFR-04)", () => {
  let cookieA: string;
  let cookieB: string;
  let orgA: Organization;
  let orgB: Organization;

  beforeAll(async () => {
    cookieA = await signUpAndSignIn(
      "owner-a@donve.test",
      "pw-a-123456",
      "Owner A"
    );
    cookieB = await signUpAndSignIn(
      "owner-b@donve.test",
      "pw-b-123456",
      "Owner B"
    );

    const createA = await authed(cookieA, "/api/auth/organization/create", {
      method: "POST",
      body: JSON.stringify({ name: "Org A", slug: "org-a-xtenant" })
    });
    expect(createA.status).toBe(200);
    orgA = (await createA.json()) as Organization;

    const createB = await authed(cookieB, "/api/auth/organization/create", {
      method: "POST",
      body: JSON.stringify({ name: "Org B", slug: "org-b-xtenant" })
    });
    expect(createB.status).toBe(200);
    orgB = (await createB.json()) as Organization;
  });

  it("blocks reading org B's full record when acting as org A (403)", async () => {
    const res = await authed(
      cookieA,
      `/api/auth/organization/get-full-organization?organizationId=${orgB.id}`
    );
    expect(res.status).toBe(403);
  });

  it("blocks renaming org B while acting as org A, and org B's name is unchanged", async () => {
    const res = await authed(cookieA, "/api/auth/organization/update", {
      method: "POST",
      body: JSON.stringify({
        organizationId: orgB.id,
        data: { name: "Pwned by org A" }
      })
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const stillB = await authed(
      cookieB,
      `/api/auth/organization/get-full-organization?organizationId=${orgB.id}`
    );
    const orgBNow = (await stillB.json()) as Organization & { name: string };
    expect(orgBNow.name).toBe("Org B");
  });

  it("blocks deleting org B while acting as org A, and org B still exists afterward", async () => {
    const res = await authed(cookieA, "/api/auth/organization/delete", {
      method: "POST",
      body: JSON.stringify({ organizationId: orgB.id })
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const stillB = await authed(
      cookieB,
      `/api/auth/organization/get-full-organization?organizationId=${orgB.id}`
    );
    expect(stillB.status).toBe(200);
  });

  it("blocks setting org B active while acting as org A (403), and never leaves org B active", async () => {
    const res = await authed(cookieA, "/api/auth/organization/set-active", {
      method: "POST",
      body: JSON.stringify({ organizationId: orgB.id })
    });
    expect(res.status).toBe(403);

    // Better Auth's own set-active handler clears the caller's active org to
    // null as a side effect of failing this check (defensive, not a leak) —
    // the property under test is just that it never becomes org B.
    const activeRes = await authed(
      cookieA,
      "/api/auth/organization/get-full-organization"
    );
    const active = (await activeRes.json()) as Organization | null;
    expect(active?.id).not.toBe(orgB.id);

    await authed(cookieA, "/api/auth/organization/set-active", {
      method: "POST",
      body: JSON.stringify({ organizationId: orgA.id })
    });
  });

  it("blocks listing org B's members while acting as org A (403)", async () => {
    const res = await authed(
      cookieA,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    expect(res.status).toBe(403);
  });

  it("blocks inviting into org B while acting as org A", async () => {
    const res = await authed(cookieA, "/api/auth/organization/invite-member", {
      method: "POST",
      body: JSON.stringify({
        organizationId: orgB.id,
        email: "victim@donve.test",
        role: "editor"
      })
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("blocks removing org B's owner by membership id while acting as org A (own org, foreign member id)", async () => {
    const membersB = await authed(
      cookieB,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    const { members } = (await membersB.json()) as { members: Member[] };
    const ownerBMembership = members.find((m) => m.organizationId === orgB.id);
    if (!ownerBMembership)
      throw new Error("expected org B to have its owner as a member");

    const res = await authed(cookieA, "/api/auth/organization/remove-member", {
      method: "POST",
      body: JSON.stringify({
        memberIdOrEmail: ownerBMembership.id,
        organizationId: orgA.id
      })
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const stillMembersB = await authed(
      cookieB,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    const { members: membersAfter } = (await stillMembersB.json()) as {
      members: Member[];
    };
    expect(membersAfter.some((m) => m.id === ownerBMembership.id)).toBe(true);
  });

  it("blocks removing a member from org B by explicitly spoofing organizationId while not a member there", async () => {
    const membersB = await authed(
      cookieB,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    const { members } = (await membersB.json()) as { members: Member[] };
    const ownerBMembership = members[0];
    if (!ownerBMembership)
      throw new Error("expected org B to have its owner as a member");

    const res = await authed(cookieA, "/api/auth/organization/remove-member", {
      method: "POST",
      body: JSON.stringify({
        memberIdOrEmail: ownerBMembership.id,
        organizationId: orgB.id
      })
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("blocks promoting org B's owner to a different role while acting as org A, role unchanged", async () => {
    const membersB = await authed(
      cookieB,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    const { members } = (await membersB.json()) as { members: Member[] };
    const ownerBMembership = members.find((m) => m.organizationId === orgB.id);
    if (!ownerBMembership)
      throw new Error("expected org B to have its owner as a member");

    const res = await authed(
      cookieA,
      "/api/auth/organization/update-member-role",
      {
        method: "POST",
        body: JSON.stringify({
          memberId: ownerBMembership.id,
          role: "sales",
          organizationId: orgA.id
        })
      }
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const stillMembersB = await authed(
      cookieB,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    const { members: membersAfter } = (await stillMembersB.json()) as {
      members: Member[];
    };
    const stillOwner = membersAfter.find((m) => m.id === ownerBMembership.id);
    expect(stillOwner?.role).toBe(ownerBMembership.role);
  });

  it("blocks cancelling org B's invitation while acting as org A (not a member of org B)", async () => {
    const inviteRes = await authed(
      cookieB,
      "/api/auth/organization/invite-member",
      {
        method: "POST",
        body: JSON.stringify({
          organizationId: orgB.id,
          email: "recipient-b@donve.test",
          role: "editor"
        })
      }
    );
    expect(inviteRes.status).toBe(200);
    const invitation = (await inviteRes.json()) as Invitation;

    const res = await authed(
      cookieA,
      "/api/auth/organization/cancel-invitation",
      {
        method: "POST",
        body: JSON.stringify({ invitationId: invitation.id })
      }
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("blocks a different org's user from reading org B's invitation meant for someone else (403)", async () => {
    const inviteRes = await authed(
      cookieB,
      "/api/auth/organization/invite-member",
      {
        method: "POST",
        body: JSON.stringify({
          organizationId: orgB.id,
          email: "another-recipient@donve.test",
          role: "editor"
        })
      }
    );
    expect(inviteRes.status).toBe(200);
    const invitation = (await inviteRes.json()) as Invitation;

    const getRes = await authed(
      cookieA,
      `/api/auth/organization/get-invitation?id=${invitation.id}`
    );
    expect(getRes.status).toBe(403);
  });

  it("blocks accepting another org's invitation meant for a different email (403), even for a signed-in org A user", async () => {
    const inviteRes = await authed(
      cookieB,
      "/api/auth/organization/invite-member",
      {
        method: "POST",
        body: JSON.stringify({
          organizationId: orgB.id,
          email: "someone-else@donve.test",
          role: "editor"
        })
      }
    );
    expect(inviteRes.status).toBe(200);
    const invitation = (await inviteRes.json()) as Invitation;

    const membersBefore = await authed(
      cookieB,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    const { total: totalBefore } = (await membersBefore.json()) as {
      total: number;
    };

    const acceptRes = await authed(
      cookieA,
      "/api/auth/organization/accept-invitation",
      {
        method: "POST",
        body: JSON.stringify({ invitationId: invitation.id })
      }
    );
    expect(acceptRes.status).toBe(403);

    const membersAfter = await authed(
      cookieB,
      `/api/auth/organization/list-members?organizationId=${orgB.id}`
    );
    const { total: totalAfter } = (await membersAfter.json()) as {
      total: number;
    };
    expect(totalAfter).toBe(totalBefore);
  });

  it("blocks rejecting another org's invitation meant for a different email (403)", async () => {
    const inviteRes = await authed(
      cookieB,
      "/api/auth/organization/invite-member",
      {
        method: "POST",
        body: JSON.stringify({
          organizationId: orgB.id,
          email: "yet-another@donve.test",
          role: "editor"
        })
      }
    );
    expect(inviteRes.status).toBe(200);
    const invitation = (await inviteRes.json()) as Invitation;

    const rejectRes = await authed(
      cookieA,
      "/api/auth/organization/reject-invitation",
      {
        method: "POST",
        body: JSON.stringify({ invitationId: invitation.id })
      }
    );
    expect(rejectRes.status).toBe(403);
  });

  it("edge case: a well-formed but nonexistent organizationId fails closed instead of 200", async () => {
    const res = await authed(
      cookieA,
      "/api/auth/organization/get-full-organization?organizationId=org_does_not_exist"
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("edge case: an unauthenticated request to an org-scoped endpoint is rejected before any org check", async () => {
    const res = await req(
      `/api/auth/organization/get-full-organization?organizationId=${orgA.id}`
    );
    expect(res.status).toBe(401);
  });
});
