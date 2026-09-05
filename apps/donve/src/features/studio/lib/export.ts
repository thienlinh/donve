import type { PageAsset } from "@dv/contracts";
import { strToU8, zipSync } from "fflate";

import { fetchAssetFile } from "../api";

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/** FR-B-28 HTML export — the file is already inlined/self-contained, so this is a raw dump. */
export function exportHtml(htmlFileName: string, html: string): void {
  downloadBlob(new Blob([html], { type: "text/html" }), htmlFileName);
}

/** FR-B-28 ZIP export — `<Page>.html` plus every `pageAssets` row under `assets/`. */
export async function exportZip(
  landingPageId: string,
  htmlFileName: string,
  html: string,
  assets: PageAsset[]
): Promise<void> {
  const files: Record<string, Uint8Array> = { [htmlFileName]: strToU8(html) };
  const assetEntries = await Promise.all(
    assets.map(async (asset) => {
      const blob = await fetchAssetFile(landingPageId, asset.id);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      return [`assets/${asset.fileName}`, bytes] as const;
    })
  );
  for (const [key, bytes] of assetEntries) {
    files[key] = bytes;
  }

  const zipped = zipSync(files);
  downloadBlob(
    new Blob([zipped], { type: "application/zip" }),
    `${htmlFileName.replace(/\.html$/, "")}.zip`
  );
}

/** FR-B-28 PNG export — `capturePng` shoots the full page height, no viewport cropping. */
export async function exportPng(
  fileNameBase: string,
  capturePng: () => Promise<Blob | null>
): Promise<void> {
  const blob = await capturePng();
  if (!blob) throw new Error("png_capture_failed");
  downloadBlob(blob, `${fileNameBase.replace(/\.html$/, "")}.png`);
}
