import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_DESIGN_TOKENS, exampleProps } from "@dv/studio-catalog";
import type { Spec } from "@json-render/core";

import { renderPageArtifact } from "../src/render-page.js";

/**
 * Renders every catalog component to a standalone, real publish-fidelity HTML+CSS preview
 * (same `renderPageArtifact` pipeline a real page publishes through — same Tailwind build,
 * same design-token CSS, same sanitize/minify pass) under `e2e/previews/`, served by
 * `preview-server.ts` for `golden-screenshot.spec.ts`/`a11y.spec.ts` — a real static-file
 * origin, not `file://`, since each preview's CSS `<link>` is an absolute `/assets/<hash>.css`
 * path (exactly what a real deployment serves from its own origin root). Run via
 * `bun run e2e:generate` before `playwright test` (`bun run e2e` does both).
 */
const outDir = fileURLToPath(new URL("./previews", import.meta.url));

async function renderOne(componentId: string, props: Record<string, unknown>) {
  const spec: Spec = {
    root: "page-root",
    elements: {
      "page-root": { type: "page_root", props: {}, children: [componentId] },
      [componentId]: { type: componentId, props, children: [] }
    }
  };

  const artifact = await renderPageArtifact({
    spec,
    tokens: DEFAULT_DESIGN_TOKENS,
    hostname: "preview.local",
    title: componentId,
    runtimeConfig: { orgId: "preview", campaignId: null, deployId: "preview" }
  });

  const componentDir = path.join(outDir, componentId);
  mkdirSync(componentDir, { recursive: true });
  writeFileSync(path.join(componentDir, "index.html"), artifact.html);
  // Every component page here shares 1 static server/origin, so assets must live at that same
  // shared root (not nested per-component) for the absolute `/assets/...` link to resolve.
  for (const asset of artifact.assets) {
    const assetPath = path.join(outDir, asset.key);
    mkdirSync(path.dirname(assetPath), { recursive: true });
    writeFileSync(assetPath, asset.bytes);
  }
}

async function main() {
  await Promise.all(
    Object.entries(exampleProps).map(([componentId, props]) =>
      renderOne(componentId, props)
    )
  );
  console.log(
    `Generated ${Object.keys(exampleProps).length} previews → ${outDir}`
  );
}

await main();
