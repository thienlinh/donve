import { ApiError } from "./errors.js";
import type { ZipAsset } from "./import-assets.js";
import { parseZipImport } from "./import-zip.js";
import { readCappedBytes, safeFetch } from "./safe-fetch.js";

export const MAX_IMPORT_FILE_BYTES = 20 * 1024 * 1024;

export interface ImportPayload {
  rawHtml: string;
  zipAssets: ZipAsset[];
  sourceKind: "paste_html" | "url_fetch" | "files" | "zip";
}

/** Shared by the legacy srcmap `/import` and the new `/import-custom` — both accept the same
 * multipart shape (paste HTML / paste a public link / upload `.html` or `.zip`), only what
 * happens to the resolved HTML afterward differs (stamp+srcmap vs. sanitize-only). */
export async function resolveImportPayload(
  form: FormData
): Promise<ImportPayload> {
  const mode = form.get("mode");
  if (mode !== "html" && mode !== "url" && mode !== "file") {
    throw new ApiError(400, "invalid_import_mode");
  }

  if (mode === "html") {
    const html = form.get("html");
    if (typeof html !== "string" || !html.trim()) {
      throw new ApiError(400, "html_required");
    }
    if (html.length > MAX_IMPORT_FILE_BYTES) {
      throw new ApiError(413, "html_too_large");
    }
    return { rawHtml: html, zipAssets: [], sourceKind: "paste_html" };
  }

  if (mode === "url") {
    const url = form.get("url");
    if (typeof url !== "string" || !url.trim()) {
      throw new ApiError(400, "url_required");
    }
    // architecture.md §7: the pasted "artifact công khai" link is server-fetched, so it goes
    // through the same SSRF-checked fetch as an external <img src> found inside imported HTML.
    const res = await safeFetch(url);
    if (!res.ok) throw new ApiError(502, "import_url_fetch_failed");
    const rawHtml = new TextDecoder().decode(
      await readCappedBytes(res, MAX_IMPORT_FILE_BYTES)
    );
    return { rawHtml, zipAssets: [], sourceKind: "url_fetch" };
  }

  const file = form.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "file_required");
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    throw new ApiError(413, "file_too_large");
  }
  if (file.name.toLowerCase().endsWith(".zip")) {
    const parsed = parseZipImport(new Uint8Array(await file.arrayBuffer()));
    return {
      rawHtml: parsed.html,
      zipAssets: parsed.assets,
      sourceKind: "zip"
    };
  }
  return { rawHtml: await file.text(), zipAssets: [], sourceKind: "files" };
}
