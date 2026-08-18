import { describe, expect, it } from "vitest";

import {
  decryptApiKey,
  encryptApiKey,
  importMasterKey,
  KeyDecryptionError,
  keyLast4
} from "../src/key-vault.js";

const MASTER_KEY_B64 = btoa("01234567890123456789012345678901"); // 32 bytes

describe("key-vault", () => {
  it("round-trips a plaintext key", async () => {
    const masterKey = await importMasterKey(MASTER_KEY_B64);
    const encrypted = await encryptApiKey("sk-or-v1-abc123", masterKey);
    expect(await decryptApiKey(encrypted, masterKey)).toBe("sk-or-v1-abc123");
  });

  it("produces a different ciphertext each time (random IV)", async () => {
    const masterKey = await importMasterKey(MASTER_KEY_B64);
    const a = await encryptApiKey("sk-or-v1-abc123", masterKey);
    const b = await encryptApiKey("sk-or-v1-abc123", masterKey);
    expect(a).not.toBe(b);
  });

  it("rejects a tampered ciphertext", async () => {
    const masterKey = await importMasterKey(MASTER_KEY_B64);
    const encrypted = await encryptApiKey("sk-or-v1-abc123", masterKey);
    const [iv, ciphertext] = encrypted.split(".");
    const tampered = `${iv}.${ciphertext.slice(0, -2)}xx`;
    await expect(decryptApiKey(tampered, masterKey)).rejects.toThrow(
      KeyDecryptionError
    );
  });

  it("rejects decryption with the wrong master key", async () => {
    const masterKey = await importMasterKey(MASTER_KEY_B64);
    const otherKey = await importMasterKey(
      btoa("98765432109876543210987654321098")
    );
    const encrypted = await encryptApiKey("sk-or-v1-abc123", masterKey);
    await expect(decryptApiKey(encrypted, otherKey)).rejects.toThrow(
      KeyDecryptionError
    );
  });

  it("keyLast4 never returns more than the last 4 characters", () => {
    expect(keyLast4("sk-or-v1-abc123")).toBe("c123");
  });
});
