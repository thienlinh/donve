import type { StockImageCandidate } from "@dv/contracts";

import type { Bindings } from "../types.js";

interface UnsplashResult {
  urls: { regular: string; thumb: string };
  links: { html: string };
  user: { name: string; links: { html: string } };
}

interface PexelsResult {
  src: { large: string; medium: string };
  url: string;
  photographer: string;
  photographer_url: string;
}

async function searchUnsplash(
  query: string,
  count: number,
  accessKey: string
): Promise<StockImageCandidate[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  );
  if (!res.ok) return [];
  const body = (await res.json()) as { results: UnsplashResult[] };
  return body.results.map((r) => ({
    provider: "unsplash" as const,
    url: r.urls.regular,
    thumbUrl: r.urls.thumb,
    attribution: `Photo by ${r.user.name} on Unsplash`,
    sourceUrl: r.links.html
  }));
}

async function searchPexels(
  query: string,
  count: number,
  apiKey: string
): Promise<StockImageCandidate[]> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}`,
    { headers: { Authorization: apiKey } }
  );
  if (!res.ok) return [];
  const body = (await res.json()) as { photos: PexelsResult[] };
  return body.photos.map((p) => ({
    provider: "pexels" as const,
    url: p.src.large,
    thumbUrl: p.src.medium,
    attribution: `Photo by ${p.photographer} on Pexels`,
    sourceUrl: p.url
  }));
}

const ALLOWED_IMAGE_HOSTS: Record<StockImageCandidate["provider"], string[]> = {
  unsplash: ["images.unsplash.com"],
  pexels: ["images.pexels.com"]
};

/**
 * The `/images/apply` route fetches `candidate.url` server-side using a URL the client
 * echoed back from a prior `/images/suggest` response — never re-derived from a search.
 * Without this check a caller could substitute any URL (internal service, localhost) and
 * have the server fetch + store it as if it were a licensed stock photo (SSRF). Restrict
 * to the exact CDN hosts `searchUnsplash`/`searchPexels` above are known to return.
 */
export function isAllowedStockImageUrl(
  candidate: Pick<StockImageCandidate, "provider" | "url">
): boolean {
  let host: string;
  try {
    host = new URL(candidate.url).hostname;
  } catch {
    return false;
  }
  return ALLOWED_IMAGE_HOSTS[candidate.provider].includes(host);
}

/**
 * Commercial-license stock photo search (FR-B-32/33) — Unsplash first, Pexels as fallback
 * when Unsplash is unconfigured or returns nothing. Both APIs are free for commercial use
 * with no mandatory credit, matching the license constraint in FR-B-32. Returns `[]` (never
 * throws) when neither provider is configured — callers degrade to "no suggestions".
 */
export async function searchStockImages(
  query: string,
  env: Bindings,
  count = 3
): Promise<StockImageCandidate[]> {
  if (env.UNSPLASH_ACCESS_KEY) {
    const results = await searchUnsplash(query, count, env.UNSPLASH_ACCESS_KEY);
    if (results.length > 0) return results;
  }
  if (env.PEXELS_API_KEY) {
    return searchPexels(query, count, env.PEXELS_API_KEY);
  }
  return [];
}
