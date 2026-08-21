import { pageAssetsRepository, type Db } from "@dv/db";
import {
  applyOpsToHtml,
  extractImageSources,
  type PatchOp
} from "@dv/studio-core";

import type { Bindings } from "../types.js";
import { log } from "./logger.js";
import { readCappedBytes, safeFetch } from "./safe-fetch.js";
import { createStorageFromEnv } from "./storage.js";

export interface ZipAsset {
  path: string;
  bytes: Uint8Array;
  mime: string;
}

function decodeDataUri(
  src: string
): { mime: string; bytes: Uint8Array } | null {
  const match = /^data:([^;,]*)(;base64)?,(.*)$/s.exec(src);
  if (!match) return null;
  const mime = match[1] || "application/octet-stream";
  const data = match[3] ?? "";
  if (match[2]) {
    return { mime, bytes: Uint8Array.from(atob(data), (c) => c.charCodeAt(0)) };
  }
  return { mime, bytes: new TextEncoder().encode(decodeURIComponent(data)) };
}

function extForMime(mime: string): string {
  if (mime.includes("svg")) return "svg";
  if (mime.includes("png")) return "png";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

export interface ImportedAssetsResult {
  html: string;
  assetIds: string[];
}

/**
 * FR-B-30 "tách inline assets" + FR-B-35 flagging. Walks every `<img src>` in `html` (already
 * sanitized + srcmap-stamped) and, for each one, stores real bytes as a `pageAssets` row and
 * rewrites `src` to point at it:
 * - `data:` URIs are decoded directly (provenance is the tenant's own paste/upload, never
 *   flagged).
 * - zip-local relative paths are resolved against `zipAssets` (same provenance as above).
 * - `http(s)` URLs are fetched through `safeFetch` (SSRF-checked) and flagged
 *   `unverifiedSource: true` (FR-B-35) — we don't know who holds rights to a hotlinked image.
 * A URL that fails the SSRF check or the fetch itself is left untouched (still an external
 * hotlink) rather than failing the whole import.
 */
export async function extractInlineImportAssets(
  db: Db,
  env: Bindings,
  orgId: string,
  landingPageId: string,
  html: string,
  zipAssets: ZipAsset[] = []
): Promise<ImportedAssetsResult> {
  const storage = createStorageFromEnv(env);
  const zipByPath = new Map(zipAssets.map((a) => [a.path, a]));

  async function resolveOne(
    srcmapId: string,
    src: string
  ): Promise<{ op: PatchOp; assetId: string } | null> {
    let bytes: Uint8Array;
    let mime: string;
    let unverifiedSource = false;
    let fileName: string;

    if (src.startsWith("data:")) {
      const decoded = decodeDataUri(src);
      if (!decoded) return null;
      ({ mime, bytes } = decoded);
      fileName = `import-${crypto.randomUUID()}.${extForMime(mime)}`;
    } else if (/^https?:\/\//i.test(src)) {
      try {
        const res = await safeFetch(src);
        if (!res.ok) return null;
        mime = res.headers.get("content-type") ?? "application/octet-stream";
        bytes = await readCappedBytes(res);
      } catch (err) {
        log("warn", {
          requestId: "import",
          orgId,
          message: "import image fetch skipped",
          src,
          error: err instanceof Error ? err.message : String(err)
        });
        return null;
      }
      unverifiedSource = true;
      fileName = `import-${crypto.randomUUID()}.${extForMime(mime)}`;
    } else {
      const zipAsset = zipByPath.get(src.replace(/^\.?\//, ""));
      if (!zipAsset) return null;
      ({ mime, bytes } = zipAsset);
      fileName =
        zipAsset.path.split("/").pop() ?? `import-${crypto.randomUUID()}`;
    }

    const r2Key = `landing-pages/${landingPageId}/assets/${crypto.randomUUID()}-${fileName}`;
    await storage.put({ key: r2Key, body: bytes, contentType: mime });

    const asset = await pageAssetsRepository.insert(db, orgId, {
      landingPageId,
      fileName,
      r2Key,
      mime,
      sizeBytes: bytes.byteLength,
      variants: {},
      source: "import",
      license: {},
      unverifiedSource,
      usageConfirmed: false
    });
    if (!asset) return null;

    return {
      assetId: asset.id,
      op: {
        type: "setAttr",
        srcmapId,
        attr: "src",
        value: `/api/landings/${landingPageId}/assets/${asset.id}/file`
      }
    };
  }

  const resolved = (
    await Promise.all(
      extractImageSources(html).map(({ srcmapId, src }) =>
        resolveOne(srcmapId, src)
      )
    )
  ).filter((r) => r !== null);

  const ops = resolved.map((r) => r.op);
  const assetIds = resolved.map((r) => r.assetId);
  return { html: ops.length > 0 ? applyOpsToHtml(html, ops) : html, assetIds };
}
