export interface PutObjectInput {
  key: string;
  body: ReadableStream | ArrayBuffer | ArrayBufferView | string;
  contentType?: string;
}

export interface PutObjectResult {
  key: string;
  size: number;
}

export interface StoredObject {
  key: string;
  body: ReadableStream;
  contentType: string | null;
  size: number;
}

/**
 * Upload storage only — e.g. refund evidence photos (FR-D-12). NOT for landing deployment
 * assets: those stay directly on R2/Cache API in apps/edge-router, Cloudflare-specific by
 * deliberate architecture decision (architecture.md §3 "phạm vi portable").
 */
export interface StorageDriver {
  put(input: PutObjectInput): Promise<PutObjectResult>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}
