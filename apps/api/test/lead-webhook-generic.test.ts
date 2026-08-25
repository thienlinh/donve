import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `POST /webhooks/generic-leads` — the Zapier/Make/n8n/Zalo-Mini-App-backend bridge target
 * (lead-integrations.md §D). Unlike Facebook/Zalo, there is no shared-secret fallback: an org
 * with no generated key must reject every call, never fall through to some default.
 */
const state = vi.hoisted(() => ({
  credentials: new Map<string, { encryptedSecret: string }>()
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

vi.mock("@dv/ai-gateway", () => ({
  importMasterKey: vi.fn(async (secret: string) => secret),
  decryptApiKey: vi.fn(async (encrypted: string) =>
    encrypted.replace("enc:", "")
  )
}));

vi.mock("../src/lib/db.js", () => ({
  createDbFromEnv: vi.fn(() => ({}))
}));

const { resolveGeneratedApiKey } =
  await import("../src/modules/leads/webhooks.js");

function baseEnv() {
  return {
    WEBHOOK_KEY_MASTER_SECRET: "master"
    // oxlint-disable-next-line no-explicit-any -- test fixture, real type is AppEnv["Bindings"]
  } as any;
}

describe('resolveGeneratedApiKey("generic") — no shared-secret fallback', () => {
  beforeEach(() => state.credentials.clear());

  it("an org with no generated key resolves to null (never a fallback secret)", async () => {
    const key = await resolveGeneratedApiKey(baseEnv(), "org-a", "generic");
    expect(key).toBeNull();
  });

  it("an org with a generated key resolves to the decrypted plaintext", async () => {
    state.credentials.set("org-a:generic", {
      encryptedSecret: "enc:my-generated-key"
    });
    const key = await resolveGeneratedApiKey(baseEnv(), "org-a", "generic");
    expect(key).toBe("my-generated-key");
  });

  it("org-b's key is never returned when resolving org-a (per-org isolation)", async () => {
    state.credentials.set("org-a:generic", { encryptedSecret: "enc:key-a" });
    state.credentials.set("org-b:generic", { encryptedSecret: "enc:key-b" });
    expect(await resolveGeneratedApiKey(baseEnv(), "org-a", "generic")).toBe(
      "key-a"
    );
    expect(await resolveGeneratedApiKey(baseEnv(), "org-b", "generic")).toBe(
      "key-b"
    );
  });
});
