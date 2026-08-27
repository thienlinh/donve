import {
  deploymentSchema,
  landingPageDetailSchema,
  landingPageListItemSchema,
  landingPageSchema,
  pageAssetSchema,
  pageVersionSchema,
  templateSchema,
  type Deployment,
  type LandingPage,
  type LandingPageDetail,
  type LandingPageListItem,
  type NativePageDocument,
  type PageAsset,
  type PageVersion,
  type Template
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const landingsFetch = createApiFetch("landings");

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

/** `component-library/component-library.md` §Ba con đường tạo trang — thủ công, không AI.
 * `templateId` clones a shared template's content instead of starting from an empty canvas. */
export async function createManualLandingPage(input: {
  name: string;
  campaignId?: string | null;
  templateId?: string | null;
}): Promise<LandingPageDetail> {
  const res = await landingsFetch("/manual", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return landingPageDetailSchema.parse(await res.json());
}

const templateListResponseSchema = z.object({
  templates: z.array(templateSchema)
});

/** `GET /api/landings/templates` — shared across every org, not tenant content. */
export async function fetchTemplates(): Promise<Template[]> {
  const res = await landingsFetch("/templates");
  return templateListResponseSchema.parse(await res.json()).templates;
}

/** Mirrors `thumbnailUrl` above — `null` `thumbnailKey` (not yet seeded with a screenshot)
 * means the caller should render a placeholder instead of pointing an `<img>` here. */
export function templateThumbnailUrl(id: string): string {
  return `${import.meta.env.VITE_API_URL}/api/landings/templates/${id}/thumbnail`;
}

/** Promotes this page into the shared `templates` gallery — the source of new templates is a
 * page already brought to quality through Studio, not a separate generator. `document` is the
 * Studio's own in-memory doc (may include edits not yet landed via `updateLandingPageSpec`) so
 * "save as template" captures what's actually on screen, not a possibly-stale server version. */
export async function saveLandingPageAsTemplate(
  id: string,
  input: { name: string; industry: string; document?: NativePageDocument }
): Promise<Template> {
  const res = await landingsFetch(`/${id}/save-as-template`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return templateSchema.parse(await res.json());
}

/** Lands a new `pageVersions` row with the edited `PageSpec` (autosave-style, `patch: null`). */
export async function updateLandingPageSpec(
  id: string,
  doc: NativePageDocument
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/spec`, {
    method: "PATCH",
    body: JSON.stringify(doc)
  });
  return pageVersionSchema.parse(await res.json());
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

/** One SSE frame from `/generate/stream`: `event: <name>` + one or more joined `data:` lines. */
function parseSseFrame(frame: string): { event: string; data: string } {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("event: ")) event = line.slice("event: ".length);
    else if (line.startsWith("data: "))
      dataLines.push(line.slice("data: ".length));
  }
  return { event, data: dataLines.join("\n") };
}

/**
 * Streaming twin of `generateLandingPage` — same server-side work, but relays each chunk to
 * `onDelta` as it arrives instead of leaving the caller with zero feedback for however long the
 * model takes (a full generate can run minutes on a slow BYOK model). No AI SDK stream-protocol
 * dependency here since this returns one full HTML document, not a chat message — a plain
 * `event: delta|done|error` framing (written server-side via Hono's `streamSSE`) is enough.
 */
export async function generateLandingPageStream(
  id: string,
  prompt: string,
  onDelta: (deltaText: string) => void
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/generate/stream`, {
    method: "POST",
    body: JSON.stringify({ prompt })
  });
  if (!res.body) {
    throw new Error(
      `landings api /${id}/generate/stream failed: no response body`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    // oxlint-disable-next-line no-await-in-loop -- inherently sequential: each read depends on the stream's current position, there's nothing to parallelize
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let frameEnd = buffer.indexOf("\n\n");
    while (frameEnd !== -1) {
      const { event, data } = parseSseFrame(buffer.slice(0, frameEnd));
      buffer = buffer.slice(frameEnd + 2);

      if (event === "delta") {
        onDelta(data);
      } else if (event === "done") {
        return pageVersionSchema.parse(JSON.parse(data));
      } else if (event === "error") {
        const parsed = JSON.parse(data) as { code: string; message: string };
        throw new Error(parsed.message || parsed.code);
      }
      frameEnd = buffer.indexOf("\n\n");
    }
  }
  throw new Error(
    `landings api /${id}/generate/stream failed: stream ended with no result`
  );
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

export async function assignLandingPageToCampaign(
  id: string,
  campaignId: string
): Promise<LandingPage> {
  const res = await landingsFetch(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ campaignId })
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

/** Studio Native version diff — the one full row (including `spec`), by id. */
export async function fetchVersionSpec(
  id: string,
  versionId: string
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/versions/${versionId}`);
  return pageVersionSchema.parse(await res.json());
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

const deploymentListResponseSchema = z.object({
  deployments: z.array(deploymentSchema)
});

/** FR-G-01/02 — deploy history for a page, newest first (rollback target picker). */
export async function fetchDeployments(id: string): Promise<Deployment[]> {
  const res = await landingsFetch(`/${id}/deployments`);
  return deploymentListResponseSchema.parse(await res.json()).deployments;
}

/** FR-G-01 — builds and goes live at `subdomain`.<publish base domain>. */
export async function publishLandingPage(
  id: string,
  subdomain: string
): Promise<{ deployment: Deployment; live: boolean }> {
  const res = await landingsFetch(`/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ subdomain })
  });
  const json = await res.json();
  return {
    deployment: deploymentSchema.parse(
      (json as { deployment: unknown }).deployment
    ),
    live: (json as { live: boolean }).live
  };
}

/** Pre-publish preview — renders what publishing would ship to a private token URL, without
 * creating a deployment or changing anything live (`ui-ux-design.md` §Studio). */
export async function createLandingPagePreview(id: string): Promise<string> {
  const res = await landingsFetch(`/${id}/preview`, { method: "POST" });
  return ((await res.json()) as { url: string }).url;
}

/**
 * FR-G-02 — points the hostname back at an older, already-built deployment through the same
 * outbox mechanism as publish (architecture.md §5.2), not a direct KV write.
 */
export async function rollbackDeployment(
  id: string,
  deploymentId: string
): Promise<{ live: boolean }> {
  const res = await landingsFetch(
    `/${id}/deployments/${deploymentId}/rollback`,
    {
      method: "POST"
    }
  );
  return (await res.json()) as { live: boolean };
}

/** FR-G-02 — takes the live hostname down. */
export async function unpublishLandingPage(id: string): Promise<Deployment> {
  const res = await landingsFetch(`/${id}/unpublish`, { method: "POST" });
  const json = (await res.json()) as { deployment: unknown };
  return deploymentSchema.parse(json.deployment);
}

const assetListResponseSchema = z.object({
  assets: z.array(pageAssetSchema)
});

/** Design Files "FOLDERS" group — assets/ contents. */
export async function fetchAssets(id: string): Promise<PageAsset[]> {
  const res = await landingsFetch(`/${id}/assets`);
  return assetListResponseSchema.parse(await res.json()).assets;
}

/** Direct `<img>`/`<video>` src for one uploaded asset (mirrors `thumbnailUrl`). */
export function assetFileUrl(id: string, assetId: string): string {
  return `${import.meta.env.VITE_API_URL}/api/landings/${id}/assets/${assetId}/file`;
}

/** FR-B-29 — first-frame poster for a video asset; only meaningful when `asset.posterKey` is set. */
export function assetPosterUrl(id: string, assetId: string): string {
  return `${import.meta.env.VITE_API_URL}/api/landings/${id}/assets/${assetId}/poster`;
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

/** FR-B-29 — `file` is already compressed to WebP client-side before this call (images), or
 * left as-is (video, no client transcode). `poster` is the extracted first-frame JPEG for a
 * video upload — sent alongside it in the same request and linked server-side as `posterKey`. */
export async function uploadAsset(
  id: string,
  file: Blob,
  fileName: string,
  poster?: Blob
): Promise<PageAsset> {
  const body = new FormData();
  body.set("file", file, fileName);
  body.set("fileName", fileName);
  if (poster) body.set("poster", poster, `${fileName}.poster.jpg`);
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
