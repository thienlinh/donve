/**
 * BYOK key vault (architecture.md §6 threat table, ai-integration-byok.md §2):
 * AES-256-GCM, key wrapped by a master secret that lives only in Workers
 * Secret / VPS env — plaintext keys are never logged and never cached.
 *
 * Uses Web Crypto (`globalThis.crypto.subtle`) rather than `node:crypto` so the
 * same code runs unmodified on both apps/api entrypoints (CF Workers + Bun).
 */

const ALGO = "AES-GCM";
const IV_BYTES = 12; // 96-bit nonce, the size AES-GCM is defined/optimized for

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// bun-types' Uint8Array defaults to ArrayBufferLike (Buffer interop) while SubtleCrypto's
// BufferSource wants the plain-ArrayBuffer-backed variant — this alias bridges the two.
type Bytes = Uint8Array<ArrayBuffer>;

function fromBase64Url(value: string): Bytes {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Import the raw 32-byte master secret (base64) into a non-extractable AES-256-GCM key. */
export async function importMasterKey(
  masterKeyBase64: string
): Promise<CryptoKey> {
  const raw = fromBase64Url(masterKeyBase64.replace(/=+$/, ""));
  if (raw.byteLength !== 32) {
    throw new Error(
      `AI key vault master key must be 32 bytes for AES-256, got ${raw.byteLength}`
    );
  }
  return crypto.subtle.importKey("raw", raw, ALGO, false, [
    "encrypt",
    "decrypt"
  ]);
}

/** Encrypts a BYOK provider API key for storage in `aiConnections.encryptedKey`. */
export async function encryptApiKey(
  plaintext: string,
  masterKey: CryptoKey
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: ALGO, iv },
      masterKey,
      new TextEncoder().encode(plaintext)
    )
  );
  // GCM's auth tag is appended to the ciphertext by Web Crypto — no separate field needed.
  return `${toBase64Url(iv)}.${toBase64Url(ciphertext)}`;
}

export class KeyDecryptionError extends Error {}

/**
 * Decrypts a stored key. Call only inside the request handler that needs the
 * plaintext to make a provider call — never persist or log the return value.
 */
export async function decryptApiKey(
  encrypted: string,
  masterKey: CryptoKey
): Promise<string> {
  const [ivPart, ciphertextPart] = encrypted.split(".");
  if (!ivPart || !ciphertextPart) {
    throw new KeyDecryptionError(
      'Malformed encrypted key: expected "iv.ciphertext"'
    );
  }
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: ALGO, iv: fromBase64Url(ivPart) },
      masterKey,
      fromBase64Url(ciphertextPart)
    );
    return new TextDecoder().decode(plaintext);
  } catch {
    // AES-GCM throws on auth tag mismatch — tampered/corrupted ciphertext or wrong key.
    throw new KeyDecryptionError(
      "Failed to decrypt key: authentication tag mismatch"
    );
  }
}

/** Last 4 chars of a plaintext key, for display (`aiConnections.keyLast4`) — never the full key. */
export function keyLast4(plaintext: string): string {
  return plaintext.slice(-4);
}
