import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, normalize, sep } from "node:path";

import type {
  PutObjectInput,
  PutObjectResult,
  StorageDriver,
  StoredObject
} from "./types.js";

/**
 * Filesystem-backed `StorageDriver` for the Bun/VPS runtime in local dev —
 * mirrors docker-compose's local Postgres/Redis standing in for their cloud
 * equivalents. NOT the eventual VPS driver (architecture.md §3 calls for an
 * S3-compatible client, Phase 7) — this exists purely so `apps/api` run via
 * `bun run dev` has something to read/write instead of a hard 501.
 */
export function createLocalFsStorageDriver(baseDir: string): StorageDriver {
  function resolvePath(key: string): string {
    // Reject absolute paths and `..` segments before they ever reach `join` —
    // object keys come from `pageVersions.htmlKey`/`pageAssets.storageKey`
    // (server-generated), but a bug upstream must not turn into a path escape.
    const normalized = normalize(key);
    if (
      normalized.startsWith("..") ||
      normalized.startsWith(sep) ||
      normalized.includes(`..${sep}`)
    ) {
      throw new Error(`invalid storage key: ${key}`);
    }
    return join(baseDir, normalized);
  }

  return {
    async put(input: PutObjectInput): Promise<PutObjectResult> {
      const path = resolvePath(input.key);
      await mkdir(dirname(path), { recursive: true });

      const body =
        typeof input.body === "string" || input.body instanceof ArrayBuffer
          ? input.body
          : ArrayBuffer.isView(input.body)
            ? input.body
            : new Uint8Array(await streamToArrayBuffer(input.body));

      await writeFile(path, body as Uint8Array | string);
      if (input.contentType) {
        await writeFile(`${path}.contenttype`, input.contentType);
      }
      const stats = await stat(path);
      return { key: input.key, size: stats.size };
    },

    async get(key: string): Promise<StoredObject | null> {
      const path = resolvePath(key);
      let bytes: Buffer;
      try {
        bytes = await readFile(path);
      } catch {
        return null;
      }
      let contentType: string | null = null;
      try {
        contentType = await readFile(`${path}.contenttype`, "utf8");
      } catch {
        contentType = null;
      }
      return {
        key,
        // `Blob`'s DOM typing wants an `ArrayBuffer`-backed view — Node's `Buffer` is typed
        // as `ArrayBufferLike` (could be a `SharedArrayBuffer`), so it doesn't structurally
        // match even though every real `Buffer` here is backed by a real `ArrayBuffer`.
        body: new Blob([new Uint8Array(bytes)]).stream(),
        contentType,
        size: bytes.byteLength
      };
    },

    async delete(key: string): Promise<void> {
      const path = resolvePath(key);
      await rm(path, { force: true });
      await rm(`${path}.contenttype`, { force: true });
    }
  };
}

async function streamToArrayBuffer(
  stream: ReadableStream
): Promise<ArrayBuffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream as unknown as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return await new Blob(
    chunks.map((chunk) => new Uint8Array(chunk))
  ).arrayBuffer();
}
