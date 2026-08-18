import {
  landingPageDetailSchema,
  landingPageListItemSchema,
  landingPageSchema,
  pageAssetSchema,
  pageVersionSchema,
  type LandingPage,
  type LandingPageDetail,
  type LandingPageListItem,
  type PageAsset,
  type PageVersion
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/platform/api.ts` — cookie session lives on the API origin. */
async function landingsFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings${path}`,
    {
      ...init,
      credentials: "include",
      headers
    }
  );
  if (!res.ok) {
    throw new Error(`landings api ${path} failed: ${res.status}`);
  }
  return res;
}

const landingListResponseSchema = z.object({
  landingPages: z.array(landingPageListItemSchema)
});

export async function fetchLandingPages(): Promise<LandingPageListItem[]> {
  const res = await landingsFetch("");
  return landingListResponseSchema.parse(await res.json()).landingPages;
}

export async function fetchLandingPage(id: string): Promise<LandingPageDetail> {
  const res = await landingsFetch(`/${id}`);
  return landingPageDetailSchema.parse(await res.json());
}

export async function fetchVersionHtml(id: string): Promise<string> {
  const res = await landingsFetch(`/${id}/html`);
  return res.text();
}

export async function createLandingPage(input: {
  name: string;
  campaignId?: string | null;
}): Promise<LandingPage> {
  const res = await landingsFetch("", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return landingPageSchema.parse(await res.json());
}

/** FR-B-21 — lands the first `pageVersions` row for a page created via the prompt bar. */
export async function generateLandingPage(
  id: string,
  prompt: string
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/generate`, {
    method: "POST",
    body: JSON.stringify({ prompt })
  });
  return pageVersionSchema.parse(await res.json());
}

export async function renameLandingPage(
  id: string,
  name: string
): Promise<LandingPage> {
  const res = await landingsFetch(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name })
  });
  return landingPageSchema.parse(await res.json());
}

export async function removeLandingPageFromCampaign(
  id: string
): Promise<LandingPage> {
  const res = await landingsFetch(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ campaignId: null })
  });
  return landingPageSchema.parse(await res.json());
}

export async function duplicateLandingPage(id: string): Promise<LandingPage> {
  const res = await landingsFetch(`/${id}/duplicate`, { method: "POST" });
  return landingPageSchema.parse(await res.json());
}

export async function deleteLandingPage(id: string): Promise<void> {
  await landingsFetch(`/${id}`, { method: "DELETE" });
}

/** studio-builder-spec.md §5 — lands a new `pageVersions` row with origin="manual". */
export async function saveManualVersion(
  id: string,
  input: { html: string; patch: unknown }
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/versions`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return pageVersionSchema.parse(await res.json());
}

const versionListResponseSchema = z.object({
  versions: z.array(pageVersionSchema)
});

/** FR-B-27 — newest first. */
export async function fetchVersions(id: string): Promise<PageVersion[]> {
  const res = await landingsFetch(`/${id}/versions`);
  return versionListResponseSchema.parse(await res.json()).versions;
}

export async function fetchVersionHtmlById(
  id: string,
  versionId: string
): Promise<string> {
  const res = await landingsFetch(`/${id}/versions/${versionId}/html`);
  return res.text();
}

export async function setVersionLabel(
  id: string,
  versionId: string,
  label: string | null
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/versions/${versionId}`, {
    method: "PATCH",
    body: JSON.stringify({ label })
  });
  return pageVersionSchema.parse(await res.json());
}

export async function restoreVersion(
  id: string,
  versionId: string
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/versions/${versionId}/restore`, {
    method: "POST"
  });
  return pageVersionSchema.parse(await res.json());
}

/** Design Files "DATA" group — `<Page>.html.srcmap.json`, read-only. Null if none exists yet. */
export async function fetchCurrentSrcmap(id: string): Promise<string | null> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${id}/srcmap`,
    { credentials: "include" }
  );
  if (res.status === 404) return null;
  if (!res.ok)
    throw new Error(`landings api /${id}/srcmap failed: ${res.status}`);
  return res.text();
}

/** Design Files "IMAGES" group — `.thumbnail.jpg`. Null if none has been captured yet. */
export function thumbnailUrl(id: string): string {
  return `${import.meta.env.VITE_API_URL}/api/landings/${id}/thumbnail`;
}

export async function uploadThumbnail(id: string, blob: Blob): Promise<void> {
  const body = new FormData();
  body.set("file", blob, "thumbnail.jpg");
  await fetch(`${import.meta.env.VITE_API_URL}/api/landings/${id}/thumbnail`, {
    method: "POST",
    credentials: "include",
    body
  });
}

const assetListResponseSchema = z.object({
  assets: z.array(pageAssetSchema)
});

/** Design Files "FOLDERS" group — assets/ contents. */
export async function fetchAssets(id: string): Promise<PageAsset[]> {
  const res = await landingsFetch(`/${id}/assets`);
  return assetListResponseSchema.parse(await res.json()).assets;
}

/** Direct `<img>` src for one uploaded asset (mirrors `thumbnailUrl`). */
export function assetFileUrl(id: string, assetId: string): string {
  return `${import.meta.env.VITE_API_URL}/api/landings/${id}/assets/${assetId}/file`;
}

/** FR-B-28 ZIP export — raw bytes for one asset, to bundle under `assets/`. */
export async function fetchAssetFile(
  id: string,
  assetId: string
): Promise<Blob> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${id}/assets/${assetId}/file`,
    { credentials: "include" }
  );
  if (!res.ok)
    throw new Error(
      `landings api /${id}/assets/${assetId}/file failed: ${res.status}`
    );
  return res.blob();
}

/** FR-B-29 — `file` is already compressed to WebP client-side before this call. */
export async function uploadAsset(
  id: string,
  file: Blob,
  fileName: string
): Promise<PageAsset> {
  const body = new FormData();
  body.set("file", file, fileName);
  body.set("fileName", fileName);
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${id}/assets`,
    {
      method: "POST",
      credentials: "include",
      body
    }
  );
  if (!res.ok)
    throw new Error(`landings api /${id}/assets failed: ${res.status}`);
  return pageAssetSchema.parse(await res.json());
}
