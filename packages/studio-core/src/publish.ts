import { createHash } from "node:crypto";

import { minify } from "html-minifier-terser";
import { parseHTML } from "linkedom";

import { sanitizeLandingHtml } from "./sanitize.js";

/**
 * Server-only publish build pipeline (architecture.md §5.2: "sanitize → minify html/css →
 * hash assets → rewrite URLs → inject runtime script/meta/OG/JSON-LD/canonical/beacon").
 * Same reasoning as sanitize.ts for not re-exporting from the barrel — this pulls in
 * `linkedom`/`html-minifier-terser`, Node-oriented deps a browser bundle shouldn't get.
 * Pure/no I/O on purpose: the caller (apps/api) already has the storage driver and does
 * all R2/asset fetching — this module only transforms bytes it's handed.
 */

export interface PublishPipelineAsset {
  /** URL as it appears in the source HTML (e.g. a page-asset's public/served path). */
  originalUrl: string;
  bytes: Uint8Array;
  mime: string;
}

/** Product/Course JSON-LD source data (FR-G-05), resolved by the caller from
 * landingPages.campaignId -> campaignProducts -> products before calling this pipeline.
 * A campaign can link several products, so the pipeline receives an array and emits one
 * Product/Course schema per item (wrapped in an ItemList when there's more than one). */
export interface PublishStructuredData {
  type: "Product" | "Course";
  name: string;
  description?: string;
  imageUrl?: string;
  price?: string;
}

export interface PublishPipelineInput {
  html: string;
  assets: PublishPipelineAsset[];
  hostname: string;
  title: string;
  canonicalPath?: string;
  /** Landing page's `.thumbnail.jpg` (FR-G-05 og:image), already fetched by the caller. */
  ogImage?: { bytes: Uint8Array; mime: string };
  structuredData?: PublishStructuredData[];
  /** Compiled apps/landing-runtime bundle to inject as a deferred, content-hashed <script>.
   * Omitted when the caller couldn't resolve it (see apps/api/src/lib/publish.ts) — the page
   * still publishes, just without the runtime (no form/popup/QR/poll behavior). */
  runtimeScript?: { bytes: Uint8Array; mime: string };
  runtimeConfig: {
    orgId: string;
    campaignId: string | null;
    deployId: string;
    /** Public API origin the embedded runtime calls for `/public/leads` and order-status
     * polling (FR-D-01) — optional only so callers mid-migration don't break; publish.ts
     * always sets it in practice. */
    apiUrl?: string;
    /** Cloudflare Turnstile site key (FR-D-03, public by design). */
    turnstileSiteKey?: string;
  };
}

export interface PublishPipelineOutputAsset {
  /** Key relative to the deployment's R2 prefix, e.g. `assets/ab12cd34.jpg`. */
  key: string;
  bytes: Uint8Array;
  mime: string;
}

export interface PublishPipelineOutput {
  /** Final `index.html` content — sanitized, minified, URL-rewritten, tags injected. */
  html: string;
  assets: PublishPipelineOutputAsset[];
}

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/javascript": "js",
  "text/javascript": "js",
  "text/css": "css"
};

function extFor(mime: string, originalUrl: string): string {
  const fromMime = EXT_BY_MIME[mime];
  if (fromMime) return fromMime;
  const match = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(originalUrl);
  return match?.[1] ? match[1].toLowerCase() : "bin";
}

function hashBytes(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex").slice(0, 16);
}

/** Builds the final, ready-to-upload HTML + asset set for one deployment. */
export async function buildPublishArtifacts(
  input: PublishPipelineInput
): Promise<PublishPipelineOutput> {
  const sanitized = sanitizeLandingHtml(input.html);

  const outputAssets: PublishPipelineOutputAsset[] = [];
  const urlRewrites = new Map<string, string>();
  for (const asset of input.assets) {
    const hash = hashBytes(asset.bytes);
    const key = `assets/${hash}.${extFor(asset.mime, asset.originalUrl)}`;
    outputAssets.push({ key, bytes: asset.bytes, mime: asset.mime });
    urlRewrites.set(asset.originalUrl, `/${key}`);
  }

  const { document } = parseHTML(sanitized);
  const ATTR_BY_TAG: Record<string, string> = {
    img: "src",
    source: "src",
    link: "href",
    video: "poster"
  };
  for (const [tag, attr] of Object.entries(ATTR_BY_TAG)) {
    for (const el of document.querySelectorAll(tag)) {
      const current = el.getAttribute(attr);
      const rewritten = current && urlRewrites.get(current);
      if (rewritten) el.setAttribute(attr, rewritten);
    }
  }

  const canonicalUrl = `https://${input.hostname}${input.canonicalPath ?? "/"}`;
  const head = document.querySelector("head") ?? document.documentElement;

  // NFR-01 (LCP < 1.8s on 4G): best-effort preconnect/display=swap for Google Fonts and a
  // preload hint for the hero image. No-op if the HTML has neither — never throws.
  const googleFontLinks = Array.from(
    document.querySelectorAll("link[rel=stylesheet]")
  ).filter((el) =>
    (el.getAttribute("href") ?? "").includes("fonts.googleapis.com")
  );
  for (const linkEl of googleFontLinks) {
    const href = linkEl.getAttribute("href");
    if (!href || /[?&]display=swap\b/.test(href)) continue;
    linkEl.setAttribute(
      "href",
      `${href}${href.includes("?") ? "&" : "?"}display=swap`
    );
  }
  if (googleFontLinks.length > 0) {
    const existingPreconnects = new Set(
      Array.from(document.querySelectorAll("link[rel=preconnect]"))
        .map((el) => el.getAttribute("href"))
        .filter((href): href is string => href != null)
    );
    for (const origin of [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com"
    ]) {
      if (existingPreconnects.has(origin)) continue;
      const preconnect = document.createElement("link");
      preconnect.setAttribute("rel", "preconnect");
      preconnect.setAttribute("href", origin);
      if (origin.includes("gstatic"))
        preconnect.setAttribute("crossorigin", "");
      head.appendChild(preconnect);
    }
  }

  // ponytail: first <img> in document order isn't always the true LCP element (e.g. a hero
  // rendered as a CSS background-image instead of <img>) — upgrade to a real LCP-detection
  // heuristic if this proves wrong in practice often enough. Runs after asset URL rewriting
  // above so the preloaded href matches the final hashed/served path.
  const heroImgSrc = document.querySelector("img")?.getAttribute("src");
  if (heroImgSrc) {
    const preload = document.createElement("link");
    preload.setAttribute("rel", "preload");
    preload.setAttribute("as", "image");
    preload.setAttribute("href", heroImgSrc);
    head.appendChild(preload);
  }

  const canonical = document.createElement("link");
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", canonicalUrl);
  head.appendChild(canonical);

  let ogImageUrl: string | undefined;
  if (input.ogImage) {
    const key = `og-image.${extFor(input.ogImage.mime, "")}`;
    outputAssets.push({
      key,
      bytes: input.ogImage.bytes,
      mime: input.ogImage.mime
    });
    ogImageUrl = `https://${input.hostname}/${key}`;
  }

  const ogTags: [string, string][] = [
    ["og:title", input.title],
    ["og:type", "website"],
    ["og:url", canonicalUrl],
    ...(ogImageUrl ? ([["og:image", ogImageUrl]] as [string, string][]) : [])
  ];
  for (const [property, content] of ogTags) {
    const meta = document.createElement("meta");
    meta.setAttribute("property", property);
    meta.setAttribute("content", content);
    head.appendChild(meta);
  }

  const structuredList = input.structuredData;
  const toItemSchema = (structured: PublishStructuredData) => ({
    "@type": structured.type,
    name: structured.name,
    description: structured.description,
    image: structured.imageUrl ?? ogImageUrl,
    url: canonicalUrl,
    ...(structured.type === "Product" && structured.price
      ? {
          offers: {
            "@type": "Offer",
            price: structured.price,
            priceCurrency: "VND",
            url: canonicalUrl
          }
        }
      : {})
  });

  const [firstStructured] = structuredList ?? [];
  let structuredDataJson: object;
  if (!structuredList || structuredList.length === 0 || !firstStructured) {
    structuredDataJson = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: input.title,
      url: canonicalUrl
    };
  } else if (structuredList.length === 1) {
    structuredDataJson = {
      "@context": "https://schema.org",
      ...toItemSchema(firstStructured)
    };
  } else {
    structuredDataJson = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: structuredList.map((structured, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: toItemSchema(structured)
      }))
    };
  }

  const jsonLd = document.createElement("script");
  jsonLd.setAttribute("type", "application/ld+json");
  jsonLd.textContent = JSON.stringify(structuredDataJson);
  head.appendChild(jsonLd);

  const body = document.querySelector("body") ?? document.documentElement;

  const config = document.createElement("script");
  config.textContent = `window.__DV__=${JSON.stringify({
    ...input.runtimeConfig,
    beaconUrl: `https://${input.hostname}/e`
  })};`;
  body.appendChild(config);

  if (input.runtimeScript) {
    const hash = hashBytes(input.runtimeScript.bytes);
    const key = `_dv-runtime.${hash}.js`;
    outputAssets.push({
      key,
      bytes: input.runtimeScript.bytes,
      mime: input.runtimeScript.mime
    });
    const script = document.createElement("script");
    script.setAttribute("defer", "");
    script.setAttribute("src", `/${key}`);
    body.appendChild(script);
  }

  // linkedom's Document really does implement toString() (full HTML serialization) at
  // runtime; its .d.ts just doesn't declare it, hence the disable below.
  // oxlint-disable-next-line no-base-to-string
  const minified = await minify(document.toString(), {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: false
  });

  return { html: minified, assets: outputAssets };
}
