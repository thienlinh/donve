import { unzipSync } from "fflate";

import { ApiError } from "./errors.js";
import type { ZipAsset } from "./import-assets.js";

const IMAGE_EXT_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml"
};

const VIDEO_EXT_MIME: Record<string, string> = {
  mp4: "video/mp4",
  webm: "video/webm"
};

function extOf(path: string): string {
  return (path.split(".").pop() ?? "").toLowerCase();
}

export interface ParsedZipImport {
  html: string;
  assets: ZipAsset[];
}

// Caps the *decompressed* size, separately from the compressed-upload cap (routes.ts's
// MAX_IMPORT_FILE_BYTES) — a small, highly-compressible zip can otherwise inflate to
// gigabytes in memory (a zip bomb) before any per-entry logic ever runs.
const MAX_UNZIPPED_BYTES = 100 * 1024 * 1024;

/** FR-B-30 "upload .zip": picks `index.html` (or the first `.html` entry, for an export whose
 * root file has a different name) as the page, and every image/video entry as an inline-asset
 * candidate `extractInlineImportAssets` can resolve relative `<img src>`/`<video src/poster>`
 * paths against. */
export function parseZipImport(bytes: Uint8Array): ParsedZipImport {
  const entries = unzipSync(bytes);
  const paths = Object.keys(entries);

  const totalBytes = paths.reduce((sum, p) => sum + entries[p]!.byteLength, 0);
  if (totalBytes > MAX_UNZIPPED_BYTES) {
    throw new ApiError(413, "zip_too_large");
  }
  const htmlPath =
    paths.find((p) => p.toLowerCase().endsWith("/index.html")) ??
    paths.find((p) => p.toLowerCase() === "index.html") ??
    paths.find((p) => p.toLowerCase().endsWith(".html"));
  if (!htmlPath) throw new ApiError(400, "zip_missing_html");

  const html = new TextDecoder().decode(entries[htmlPath]);
  const assets: ZipAsset[] = [];
  for (const path of paths) {
    if (path === htmlPath) continue;
    const ext = extOf(path);
    const mime = IMAGE_EXT_MIME[ext] ?? VIDEO_EXT_MIME[ext];
    if (!mime) continue;
    assets.push({ path, bytes: entries[path]!, mime });
    // Imported HTML often references assets by a path relative to the html file
    // (e.g. "images/a.png" from an "index.html" at the zip root) — also index by the
    // basename so a flatter reference like "a.png" still resolves.
    const basename = path.split("/").pop();
    if (basename && basename !== path) {
      assets.push({ path: basename, bytes: entries[path]!, mime });
    }
  }
  return { html, assets };
}
