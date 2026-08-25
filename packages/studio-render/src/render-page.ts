import {
  designTokensToCss,
  renderSpecToHtml,
  type DesignTokens
} from "@dv/studio-catalog";
import {
  buildPublishArtifacts,
  type PublishPipelineInput,
  type PublishPipelineOutput
} from "@dv/studio-core/publish";
import type { Spec } from "@json-render/core";

import { compileCatalogCss } from "./css.js";

export interface RenderPageInput extends Omit<
  PublishPipelineInput,
  "html" | "assets"
> {
  spec: Spec;
  tokens: DesignTokens;
  description?: string;
  /** `seo.noindex` — keeps the page out of search indexes; the deployment's `robots.txt`/
   * `sitemap.xml` are overridden to match at publish time (`apps/api/src/lib/publish.ts`). */
  noindex?: boolean;
  /** The page's uploaded `pageAssets` — hashed + rewritten into `/assets/*` by the shared
   * pipeline, exactly as the legacy srcmap flow does. Optional: a PageSpec with no uploaded
   * media (or a preview render) has none. */
  assets?: PublishPipelineInput["assets"];
}

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => ESCAPE_MAP[char] ?? char);
}

/**
 * PageSpec + catalog → publish-ready HTML/assets. Runs at build-time (job Bun/Node), never on
 * the request path (`roadmap.md` §Publish-time SSR renderer). Reuses `@dv/studio-core`'s
 * existing `buildPublishArtifacts` for sanitize/asset-hash/canonical/OG/JSON-LD/minify — that
 * pipeline is already shared across every publish source (`architecture-and-data-model.md`
 * §Publish), not specific to the legacy srcmap editor.
 */
export async function renderPageArtifact(
  input: RenderPageInput
): Promise<PublishPipelineOutput> {
  const {
    spec,
    tokens,
    description,
    noindex,
    assets = [],
    ...publishFields
  } = input;

  const [body, catalogCss] = await Promise.all([
    Promise.resolve(renderSpecToHtml(spec)),
    compileCatalogCss()
  ]);
  const tokenCss = designTokensToCss(tokens);

  const html = [
    "<!doctype html>",
    '<html lang="vi">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(publishFields.title)}</title>`,
    description
      ? `<meta name="description" content="${escapeHtml(description)}">`
      : "",
    noindex ? '<meta name="robots" content="noindex">' : "",
    '<link rel="stylesheet" href="/style.css">',
    `<style>${tokenCss}</style>`,
    "</head>",
    `<body>${body}</body>`,
    "</html>"
  ].join("");

  return buildPublishArtifacts({
    ...publishFields,
    html,
    assets: [
      {
        originalUrl: "/style.css",
        bytes: new TextEncoder().encode(catalogCss),
        mime: "text/css"
      },
      ...assets
    ]
  });
}
