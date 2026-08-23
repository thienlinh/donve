import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regression test for the cross-org webhook forgery gap (lead-integrations.md §4): the HMAC
 * signature only ever covers the request body, never the `orgId`/`campaignId` query params that
 * pick the tenant. `resolveWebhookSecret` is what makes per-org isolation real — an org with its
 * own encrypted credential must verify against ITS secret, not fall through to the shared env
 * secret (which would let anyone holding the shared secret forge leads into that org anyway).
 */
const state = vi.hoisted(() => ({
  credentials: new Map<
    string,
    { encryptedSecret: string; verifyToken: string | null }
  >()
}));

vi.mock("@dv/db", () => ({
  webhookCredentialsRepository: {
    findByOrgAndProvider: vi.fn(
      async (_db: unknown, orgId: string, provider: string) =>
        state.credentials.get(`${orgId}:${provider}`)
    )
  },
  campaignsRepository: {},
  consentsRepository: {}
}));

// Real AES-GCM round trip (not mocked) — proves the org-specific secret actually decrypts to
// what was encrypted, not just that a lookup happened.
vi.mock("@dv/ai-gateway", () => ({
  importMasterKey: vi.fn(async (secret: string) => secret),
  decryptApiKey: vi.fn(async (encrypted: string) =>
    encrypted.replace("enc:", "")
  )
}));

vi.mock("../src/lib/db.js", () => ({
  createDbFromEnv: vi.fn(() => ({}))
}));

const { resolveWebhookSecret, verifyHmacSignature } =
  await import("../src/modules/leads/webhooks.js");

function baseEnv() {
  return {
    WEBHOOK_KEY_MASTER_SECRET: "master",
    FACEBOOK_APP_SECRET: "shared-facebook-secret",
    ZALO_OA_SECRET: "shared-zalo-secret"
    // oxlint-disable-next-line no-explicit-any -- test fixture, real type is AppEnv["Bindings"]
  } as any;
}

describe("resolveWebhookSecret — per-org isolation", () => {
  beforeEach(() => state.credentials.clear());

  it("an org with no configured credential falls back to the shared env secret", async () => {
    const secret = await resolveWebhookSecret(baseEnv(), "org-a", "facebook");
    expect(secret).toBe("shared-facebook-secret");
  });

  it("an org with its own credential uses that instead of the shared secret", async () => {
    state.credentials.set("org-a:facebook", {
      encryptedSecret: "enc:org-a-own-secret",
      verifyToken: null
    });

    const secret = await resolveWebhookSecret(baseEnv(), "org-a", "facebook");
    expect(secret).toBe("org-a-own-secret");
  });

  it("isolation: org-b's own secret never leaks to org-a, and org-a's request can't be forged with org-b's secret", async () => {
    state.credentials.set("org-a:facebook", {
      encryptedSecret: "enc:secret-a",
      verifyToken: null
    });
    state.credentials.set("org-b:facebook", {
      encryptedSecret: "enc:secret-b",
      verifyToken: null
    });

    const secretA = await resolveWebhookSecret(baseEnv(), "org-a", "facebook");
    const secretB = await resolveWebhookSecret(baseEnv(), "org-b", "facebook");
    expect(secretA).toBe("secret-a");
    expect(secretB).toBe("secret-b");
    expect(secretA).not.toBe(secretB);

    // The actual attack this closes: forging a signature with the SHARED secret against an org
    // that has its own configured credential must fail, even though the shared secret is valid
    // for every org that hasn't opted in yet.
    const body = '{"field_data":[]}';
    const forgedWithSharedSecret = await signHex(
      "shared-facebook-secret",
      body
    );
    const verifiedAgainstIsolatedOrg = await verifyHmacSignature(
      secretA,
      body,
      `sha256=${forgedWithSharedSecret}`,
      "sha256="
    );
    expect(verifiedAgainstIsolatedOrg).toBe(false);
  });
});

async function signHex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body)
  );
  return [...new Uint8Array(mac)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

describe("verifyHmacSignature", () => {
  it("accepts a correctly signed body", async () => {
    const sig = await signHex("my-secret", "hello");
    const ok = await verifyHmacSignature(
      "my-secret",
      "hello",
      `sha256=${sig}`,
      "sha256="
    );
    expect(ok).toBe(true);
  });

  it("rejects a wrong secret", async () => {
    const sig = await signHex("my-secret", "hello");
    const ok = await verifyHmacSignature(
      "wrong-secret",
      "hello",
      `sha256=${sig}`,
      "sha256="
    );
    expect(ok).toBe(false);
  });

  it("rejects a missing/empty secret outright (unconfigured provider must 401, not silently pass)", async () => {
    const ok = await verifyHmacSignature(
      "",
      "hello",
      "sha256=deadbeef",
      "sha256="
    );
    expect(ok).toBe(false);
  });

  it("rejects a header missing the expected prefix", async () => {
    const sig = await signHex("my-secret", "hello");
    const ok = await verifyHmacSignature("my-secret", "hello", sig, "sha256=");
    expect(ok).toBe(false);
  });
});
