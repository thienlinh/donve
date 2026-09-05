import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { encryptApiKey, importMasterKey } from "@dv/ai-gateway";
import {
  aiConnectionsRepository,
  landingPagesRepository,
  pageVersionsRepository,
  schema,
  studioCommentsRepository
} from "@dv/db";
import { stampSrcmap } from "@dv/studio-core";
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
import { createDbFromEnv } from "../src/lib/db.js";
import { createStorageFromEnv } from "../src/lib/storage.js";
import type { Bindings } from "../src/types.js";

/**
 * Integration coverage for `modules/studio/routes.ts` + `modules/studio/native-chat.ts`
 * (AI-page-editing surface, previously untested). Same boilerplate as
 * `cross-tenant.integration.test.ts` (real Postgres via testcontainers, real Better Auth
 * sign-up/sign-in flow driven through the mounted app) — no shared test-helpers module exists
 * yet, so it's copied here rather than factored out for a single file.
 *
 * `/chat/stream` and `/native-chat/stream` call a real BYOK AI provider (`resolveChatModel`)
 * once past validation — there is no fetch-mock infra in this repo (msw/nock is out of scope)
 * and this suite doesn't add one. Only the two non-AI, pre-`streamText` error paths are
 * exercised: `landing_page_no_version` and `no_ai_connection`. Both are reachable without a
 * network call because `resolveChatModel` only decrypts the stored key and constructs a
 * `LanguageModel` object (`packages/ai-gateway/src/providers/anthropic.ts`'s `.model()`) — it
 * never calls the provider itself; that only happens once `streamText` starts consuming the
 * stream, which none of these tests reach.
 */

let container: StartedPostgreSqlContainer;
let bindings: Bindings;
let rawDb: ReturnType<typeof drizzle>;
let storageDir: string;
const app = createApp();
const originalFetch = globalThis.fetch;

interface Organization {
  id: string;
  slug: string;
}

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:18-alpine").start();
  const connectionUri = container.getConnectionUri();

  const migratorClient = postgres(connectionUri, { max: 1 });
  rawDb = drizzle(migratorClient, { schema });
  await migrate(rawDb, {
    migrationsFolder: fileURLToPath(
      new URL("../../../packages/db/migrations", import.meta.url)
    ).replaceAll("\\", "/")
  });

  storageDir = mkdtempSync(path.join(tmpdir(), "dv-studio-routes-test-"));

  bindings = {
    UPSTASH_REDIS_URL: "unused",
    UPSTASH_REDIS_TOKEN: "unused",
    DATABASE_URL: connectionUri,
    BETTER_AUTH_SECRET: "test-secret-at-least-32-chars-long!!",
    BETTER_AUTH_URL: "http://localhost:3000",
    APP_URL: "http://localhost:5173",
    RESEND_API_KEY: "test-key",
    RUNTIME: "bun",
    LOCAL_STORAGE_DIR: storageDir,
    // 32 raw bytes, base64-encoded — same shape `importMasterKey` requires.
    AI_KEY_MASTER_SECRET: Buffer.alloc(32, 7).toString("base64")
  } as Bindings;

  // Only Resend's send call and the stock-image CDN fetch in the images/apply test go over
  // the network during this suite — every app request is dispatched in-process via `app.fetch`.
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
    if (url.startsWith("https://images.unsplash.com/")) {
      return new Response(new Uint8Array([1, 2, 3, 4]), {
        status: 200,
        headers: { "content-type": "image/jpeg" }
      });
    }
    return originalFetch(input, init);
  };
}, 60_000);

afterAll(async () => {
  globalThis.fetch = originalFetch;
  await container.stop();
  rmSync(storageDir, { recursive: true, force: true });
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

/**
 * `/organization/set-active` reissues the session cookie (Better Auth refreshes its
 * cookieCache — packages/auth/src/config.ts — to reflect the new `activeOrganizationId`);
 * `/organization/create` only activates in the DB. Callers must merge the set-active
 * response into their cookie string, or every request for the next 60s replays the
 * pre-activation cache and 403s with `no_active_organization`.
 */
function syncCookie(cookie: string, res: Response): string {
  const fresh = res.headers.getSetCookie();
  if (fresh.length === 0) return cookie;
  const jar = new Map(
    cookie
      .split("; ")
      .filter(Boolean)
      .map((kv) => {
        const i = kv.indexOf("=");
        return [kv.slice(0, i), kv.slice(i + 1)] as const;
      })
  );
  for (const setCookie of fresh) {
    const kv = setCookie.split(";")[0] ?? "";
    const i = kv.indexOf("=");
    jar.set(kv.slice(0, i), kv.slice(i + 1));
  }
  return [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function createOrgAndActivate(
  cookie: string,
  name: string,
  slug: string
): Promise<{ org: Organization; cookie: string }> {
  const createRes = await authed(cookie, "/api/auth/organization/create", {
    method: "POST",
    body: JSON.stringify({ name, slug })
  });
  expect(createRes.status).toBe(200);
  const org = (await createRes.json()) as Organization;
  cookie = syncCookie(cookie, createRes);
  const activateRes = await authed(
    cookie,
    "/api/auth/organization/set-active",
    {
      method: "POST",
      body: JSON.stringify({ organizationId: org.id })
    }
  );
  cookie = syncCookie(cookie, activateRes);
  return { org, cookie };
}

/**
 * Seeds a legacy srcmap-editable landing page (`htmlKey`/`srcmapKey` set, `spec` null) with one
 * `<img>` element, real HTML bytes in the local-fs storage driver, and returns the stamped
 * `data-cc-id` of that image so tests can target it with a patch op.
 */
async function seedSrcmapLandingPage(orgId: string, name: string) {
  const db = createDbFromEnv(bindings);
  const storage = createStorageFromEnv(bindings);

  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name,
    campaignId: null,
    source: "import"
  });
  if (!landingPage) throw new Error("landing page insert failed");

  const rawHtml =
    '<!DOCTYPE html><html><body><main><img src="https://example.test/old.jpg" alt="hero" data-cc-need-image="true"/></main></body></html>';
  const html = stampSrcmap(rawHtml);
  // `stampSrcmap` tags every element, not just the `<img>` — the id right before it, not the
  // first `data-cc-id` in the document, is the one to target.
  const imgSrcmapId = /<img\s+data-cc-id="([^"]+)"/.exec(html)?.[1];
  if (!imgSrcmapId) throw new Error("expected stampSrcmap to tag the <img>");

  const htmlKey = `landing-pages/${landingPage.id}/v1/index.html`;
  await storage.put({ key: htmlKey, body: html, contentType: "text/html" });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq: 1,
    htmlKey,
    srcmapKey: `landing-pages/${landingPage.id}/v1/srcmap.json`,
    origin: "import",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new Error("page version insert failed");

  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });

  return { landingPage, version, imgSrcmapId };
}

/** A page with no `pageVersions` row yet — the "landing_page_no_version" branch. */
async function seedEmptyLandingPage(orgId: string, name: string) {
  const db = createDbFromEnv(bindings);
  const landingPage = await landingPagesRepository.insert(db, orgId, {
    name,
    campaignId: null,
    source: "ai"
  });
  if (!landingPage) throw new Error("landing page insert failed");
  return landingPage;
}

/** A fake-but-well-formed BYOK connection: decryptable with the test master key, never used to
 * make a real provider call in these tests (`resolveChatModel` only decrypts + constructs a
 * `LanguageModel` object, see file header). */
async function seedAiConnection(orgId: string) {
  const db = createDbFromEnv(bindings);
  const masterKey = await importMasterKey(bindings.AI_KEY_MASTER_SECRET);
  const encryptedKey = await encryptApiKey("sk-test-fake-key", masterKey);
  await aiConnectionsRepository.insert(db, orgId, {
    provider: "anthropic",
    encryptedKey,
    keyLast4: "fake",
    defaultModel: "claude-haiku-4-5",
    isDefault: true,
    status: "active"
  });
}

describe("studio comments (CRUD + org-scoping)", () => {
  let cookieA: string;
  let cookieB: string;
  let orgA: Organization;
  let pageA: Awaited<ReturnType<typeof seedSrcmapLandingPage>>["landingPage"];

  beforeAll(async () => {
    cookieA = await signUpAndSignIn(
      "studio-a@donve.test",
      "pw-studio-a-1",
      "Studio Owner A"
    );
    cookieB = await signUpAndSignIn(
      "studio-b@donve.test",
      "pw-studio-b-1",
      "Studio Owner B"
    );
    ({ org: orgA, cookie: cookieA } = await createOrgAndActivate(
      cookieA,
      "Studio Org A",
      "studio-org-a"
    ));
    ({ cookie: cookieB } = await createOrgAndActivate(
      cookieB,
      "Studio Org B",
      "studio-org-b"
    ));
    const seeded = await seedSrcmapLandingPage(orgA.id, "Comments test page");
    pageA = seeded.landingPage;
  });

  it("creates and lists a queued comment", async () => {
    const createRes = await authed(cookieA, "/api/studio/comments", {
      method: "POST",
      body: JSON.stringify({
        landingPageId: pageA.id,
        srcmapId: "c1",
        body: "Make the hero bigger"
      })
    });
    expect(createRes.status).toBe(201);
    const comment = (await createRes.json()) as {
      id: string;
      status: string;
    };
    expect(comment.status).toBe("queued");

    const listRes = await authed(
      cookieA,
      `/api/studio/comments?landingPageId=${pageA.id}`
    );
    expect(listRes.status).toBe(200);
    const { comments } = (await listRes.json()) as {
      comments: { id: string }[];
    };
    expect(comments.some((c) => c.id === comment.id)).toBe(true);
  });

  it("sends a single comment to chat and marks it sent", async () => {
    const createRes = await authed(cookieA, "/api/studio/comments", {
      method: "POST",
      body: JSON.stringify({
        landingPageId: pageA.id,
        srcmapId: "c2",
        body: "Fix this CTA copy"
      })
    });
    const comment = (await createRes.json()) as { id: string };

    const sendRes = await authed(
      cookieA,
      `/api/studio/comments/${comment.id}/send`,
      { method: "POST" }
    );
    expect(sendRes.status).toBe(201);
    const message = (await sendRes.json()) as {
      role: string;
      content: { type: string }[];
    };
    expect(message.role).toBe("user");
    expect(message.content.some((p) => p.type === "comment-context")).toBe(
      true
    );

    const listRes = await authed(
      cookieA,
      `/api/studio/comments?landingPageId=${pageA.id}`
    );
    const { comments } = (await listRes.json()) as {
      comments: { id: string; status: string }[];
    };
    expect(comments.find((c) => c.id === comment.id)?.status).toBe("sent");
  });

  it("sends all queued comments for a page in one message and marks them all sent", async () => {
    const db = createDbFromEnv(bindings);
    await studioCommentsRepository.insert(db, orgA.id, {
      landingPageId: pageA.id,
      srcmapId: "c3",
      body: "First queued item",
      screenshotKey: null,
      status: "queued",
      createdBy: null
    });
    await studioCommentsRepository.insert(db, orgA.id, {
      landingPageId: pageA.id,
      srcmapId: "c4",
      body: "Second queued item",
      screenshotKey: null,
      status: "queued",
      createdBy: null
    });

    const sendAllRes = await authed(cookieA, "/api/studio/comments/send-all", {
      method: "POST",
      body: JSON.stringify({ landingPageId: pageA.id })
    });
    expect(sendAllRes.status).toBe(201);
    const message = (await sendAllRes.json()) as {
      content: { type: string; text?: string }[];
    };
    const textPart = message.content.find((p) => p.type === "text");
    expect(textPart?.text).toContain("First queued item");
    expect(textPart?.text).toContain("Second queued item");

    const listRes = await authed(
      cookieA,
      `/api/studio/comments?landingPageId=${pageA.id}`
    );
    const { comments } = (await listRes.json()) as {
      comments: { srcmapId: string; status: string }[];
    };
    expect(
      comments
        .filter((c) => c.srcmapId === "c3" || c.srcmapId === "c4")
        .every((c) => c.status === "sent")
    ).toBe(true);
  });

  it("rejects send-all with no queued comments", async () => {
    const res = await authed(cookieA, "/api/studio/comments/send-all", {
      method: "POST",
      body: JSON.stringify({ landingPageId: pageA.id })
    });
    expect(res.status).toBe(400);
  });

  it("org-scoping: org B can't see or send org A's comments", async () => {
    const createRes = await authed(cookieA, "/api/studio/comments", {
      method: "POST",
      body: JSON.stringify({
        landingPageId: pageA.id,
        srcmapId: "c5",
        body: "org A only comment"
      })
    });
    const commentA = (await createRes.json()) as { id: string };

    // Org B has no landing page with this id at all, so the list call scoped to org B's
    // session sees nothing for it — org-scoped `list` never filters by landingPageId across
    // orgs, it filters by the caller's own orgId first.
    const listAsB = await authed(
      cookieB,
      `/api/studio/comments?landingPageId=${pageA.id}`
    );
    const { comments: commentsAsB } = (await listAsB.json()) as {
      comments: { id: string }[];
    };
    expect(commentsAsB.some((c) => c.id === commentA.id)).toBe(false);

    const sendAsB = await authed(
      cookieB,
      `/api/studio/comments/${commentA.id}/send`,
      { method: "POST" }
    );
    expect(sendAsB.status).toBe(404);

    const createOnPageAAsB = await authed(cookieB, "/api/studio/comments", {
      method: "POST",
      body: JSON.stringify({
        landingPageId: pageA.id,
        srcmapId: "c6",
        body: "attempted cross-org write"
      })
    });
    expect(createOnPageAAsB.status).toBe(404);
  });
});

describe("studio chat messages", () => {
  let cookie: string;
  let org: Organization;
  let page: Awaited<ReturnType<typeof seedSrcmapLandingPage>>["landingPage"];

  beforeAll(async () => {
    cookie = await signUpAndSignIn(
      "studio-msgs@donve.test",
      "pw-studio-msgs-1",
      "Studio Msgs Owner"
    );
    ({ org, cookie } = await createOrgAndActivate(
      cookie,
      "Studio Msgs Org",
      "studio-msgs-org"
    ));
    const seeded = await seedSrcmapLandingPage(org.id, "Messages test page");
    page = seeded.landingPage;
  });

  it("posts a draw-mode message and lists chat history for the page", async () => {
    const postRes = await authed(cookie, "/api/studio/messages", {
      method: "POST",
      body: JSON.stringify({
        landingPageId: page.id,
        text: "Move this up",
        imageDataUrl: "data:image/png;base64,AAAA"
      })
    });
    expect(postRes.status).toBe(201);
    const message = (await postRes.json()) as { id: string; role: string };
    expect(message.role).toBe("user");

    const listRes = await authed(
      cookie,
      `/api/studio/messages?landingPageId=${page.id}`
    );
    expect(listRes.status).toBe(200);
    const { messages } = (await listRes.json()) as {
      messages: { id: string }[];
    };
    expect(messages.some((m) => m.id === message.id)).toBe(true);
  });

  it("returns an empty list for a page with no chat session yet", async () => {
    const fresh = await seedEmptyLandingPage(org.id, "No-session page");
    const res = await authed(
      cookie,
      `/api/studio/messages?landingPageId=${fresh.id}`
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ messages: [] });
  });
});

describe("studio images (suggest/apply)", () => {
  let cookie: string;
  let org: Organization;

  beforeAll(async () => {
    cookie = await signUpAndSignIn(
      "studio-img@donve.test",
      "pw-studio-img-1",
      "Studio Img Owner"
    );
    ({ org, cookie } = await createOrgAndActivate(
      cookie,
      "Studio Img Org",
      "studio-img-org"
    ));
  });

  it("suggest responds 200 with no candidates when no stock-image provider is configured", async () => {
    const page = await seedEmptyLandingPage(org.id, "Suggest test page");
    const res = await authed(cookie, "/api/studio/images/suggest", {
      method: "POST",
      body: JSON.stringify({ landingPageId: page.id, query: "sunset beach" })
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ candidates: [] });
  });

  it("apply: applies a stock image choice, creating a new pageVersion with the patch applied", async () => {
    const { landingPage, version, imgSrcmapId } = await seedSrcmapLandingPage(
      org.id,
      "Apply image test page"
    );

    const res = await authed(cookie, "/api/studio/images/apply", {
      method: "POST",
      body: JSON.stringify({
        landingPageId: landingPage.id,
        srcmapId: imgSrcmapId,
        candidate: {
          provider: "unsplash",
          url: "https://images.unsplash.com/photo-test",
          thumbUrl: "https://images.unsplash.com/photo-test-thumb",
          attribution: "Photo by Test on Unsplash",
          sourceUrl: "https://unsplash.com/photos/test"
        }
      })
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      asset: { id: string; source: string };
      pageVersionId: string;
    };
    expect(body.asset.source).toBe("stock_licensed");
    expect(body.pageVersionId).not.toBe(version.id);

    const db = createDbFromEnv(bindings);
    const newVersion = await pageVersionsRepository.findById(
      db,
      org.id,
      body.pageVersionId
    );
    expect(newVersion?.seq).toBe(version.seq + 1);
    expect(newVersion?.htmlKey).toBeTruthy();

    const storage = createStorageFromEnv(bindings);
    const object = await storage.get(newVersion!.htmlKey!);
    const html = await new Response(object!.body).text();
    // `patch` applied the new asset's serving URL onto the srcmap-targeted <img> and cleared
    // the placeholder marker (`applyOpsToHtml`, exact same op the route builds).
    expect(html).toContain(
      `/api/landings/${landingPage.id}/assets/${body.asset.id}/file`
    );
    expect(html).not.toContain("data-cc-need-image");
    expect(html).not.toContain("https://example.test/old.jpg");

    const updated = await landingPagesRepository.findById(
      db,
      org.id,
      landingPage.id
    );
    expect(updated?.currentVersionId).toBe(body.pageVersionId);
  });

  it("apply: rejects a candidate url from a host outside the allowlist (SSRF guard)", async () => {
    const { landingPage, imgSrcmapId } = await seedSrcmapLandingPage(
      org.id,
      "Apply image SSRF test page"
    );

    const res = await authed(cookie, "/api/studio/images/apply", {
      method: "POST",
      body: JSON.stringify({
        landingPageId: landingPage.id,
        srcmapId: imgSrcmapId,
        candidate: {
          provider: "unsplash",
          url: "http://169.254.169.254/latest/meta-data",
          thumbUrl: "https://images.unsplash.com/photo-test-thumb",
          attribution: "attribution",
          sourceUrl: "https://unsplash.com/photos/test"
        }
      })
    });
    expect(res.status).toBe(400);
  });
});

describe("studio chat/stream error paths (no real AI call)", () => {
  let cookie: string;
  let org: Organization;

  beforeAll(async () => {
    cookie = await signUpAndSignIn(
      "studio-chat@donve.test",
      "pw-studio-chat-1",
      "Studio Chat Owner"
    );
    ({ org, cookie } = await createOrgAndActivate(
      cookie,
      "Studio Chat Org",
      "studio-chat-org"
    ));
  });

  it("POST /api/studio/chat/stream: 400 landing_page_no_version for a page with no version", async () => {
    const page = await seedEmptyLandingPage(org.id, "No-version chat page");
    const res = await authed(cookie, "/api/studio/chat/stream", {
      method: "POST",
      body: JSON.stringify({ landingPageId: page.id, messages: [] })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("landing_page_no_version");
  });

  it("POST /api/studio/chat/stream: 400 no_ai_connection when the org has no default BYOK connection", async () => {
    const { landingPage } = await seedSrcmapLandingPage(
      org.id,
      "No-connection chat page"
    );
    const res = await authed(cookie, "/api/studio/chat/stream", {
      method: "POST",
      body: JSON.stringify({ landingPageId: landingPage.id, messages: [] })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("no_ai_connection");
  });

  it("POST /api/studio/native-chat/stream: 400 no_ai_connection when the org has no default BYOK connection", async () => {
    const page = await seedEmptyLandingPage(
      org.id,
      "Native no-connection page"
    );
    const res = await authed(cookie, "/api/studio/native-chat/stream", {
      method: "POST",
      body: JSON.stringify({ landingPageId: page.id, messages: [] })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("no_ai_connection");
  });

  it("POST /api/studio/native-chat/stream: 400 landing_page_no_version once a connection exists but the page has no saved document and none was sent live", async () => {
    await seedAiConnection(org.id);
    const page = await seedEmptyLandingPage(org.id, "Native no-version page");
    const res = await authed(cookie, "/api/studio/native-chat/stream", {
      method: "POST",
      body: JSON.stringify({ landingPageId: page.id, messages: [] })
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("landing_page_no_version");
  });
});
