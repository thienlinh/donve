import type {
  PutObjectInput,
  PutObjectResult,
  StorageDriver,
  StoredObject,
} from "./types.js";

/**
 * Minimal structural subset of Cloudflare's global `R2Bucket` binding type. Declared locally
 * instead of depending on `@cloudflare/workers-types`/generated `wrangler types` output so this
 * package has no build-time coupling to a specific app's Worker type generation — the real
 * `R2Bucket` binding satisfies this structurally at the call site in apps/api.
 */
export interface R2BucketBinding {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | ArrayBufferView | string,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<{ size: number } | null>;
  get(key: string): Promise<{
    body: ReadableStream;
    httpMetadata?: { contentType?: string };
    size: number;
  } | null>;
  delete(key: string): Promise<void>;
}

export function createR2StorageDriver(bucket: R2BucketBinding): StorageDriver {
  return {
    async put(input: PutObjectInput): Promise<PutObjectResult> {
      const result = await bucket.put(input.key, input.body, {
        httpMetadata: input.contentType
          ? { contentType: input.contentType }
          : undefined,
      });
      return { key: input.key, size: result?.size ?? 0 };
    },

    async get(key: string): Promise<StoredObject | null> {
      const object = await bucket.get(key);
      if (!object) return null;
      return {
        key,
        body: object.body,
        contentType: object.httpMetadata?.contentType ?? null,
        size: object.size,
      };
    },

    async delete(key: string): Promise<void> {
      await bucket.delete(key);
    },
  };
}
