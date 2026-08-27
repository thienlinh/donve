#!/usr/bin/env bun
/**
 * Generates a static palette thumbnail PNG per catalog component (`@dv/studio-catalog`'s
 * `registry`) for the Puck editor's drag-drop block palette
 * (`apps/dashboard/src/features/studio-native/components/studio-native-page.tsx`, `drawerItem`
 * override) — one-off, convention-based output (`apps/dashboard/public/component-thumbnails/
 * {componentId}.png`), not a DB/schema field.
 *
 * Reuses `tooling/seed-templates/run.ts`'s render+screenshot recipe: `@dv/studio-render`'s
 * `renderPageArtifact` for SSR, inlining the catalog CSS asset as a `<style>` tag (its `<link>`
 * is root-relative and meaningless without a server behind `page.setContent()`), then Playwright
 * Chromium for the screenshot.
 *
 * Usage: bun tooling/generate-component-thumbnails/run.ts
 */
import { fileURLToPath } from "node:url";

import { DEFAULT_DESIGN_TOKENS, exampleProps } from "@dv/studio-catalog";
import { renderPageArtifact } from "@dv/studio-render";
import { chromium } from "@playwright/test";

const OUTPUT_DIR = fileURLToPath(
  new URL("../../apps/dashboard/public/component-thumbnails/", import.meta.url)
);

// Small palette tile, not a full-page screenshot — wide enough for the component's own layout
// to render sensibly, capped short so it reads as a thumbnail rather than a scaled-down page.
const THUMBNAIL_WIDTH = 480;
const THUMBNAIL_MAX_HEIGHT = 320;

async function main() {
  // `exampleProps` (`@dv/studio-catalog`'s per-component fixtures) is already the palette's
  // universe: it excludes `page_root` (page wrapper, not a placeable block) and
  // `raw_html_block` (no representative example — sensitive/freeform HTML) by construction.
  const componentIds = Object.keys(exampleProps);

  await Bun.$`mkdir -p ${OUTPUT_DIR}`.quiet();

  const browser = await chromium.launch();
  try {
    let written = 0;
    // oxlint-disable no-await-in-loop -- one-off local script sharing a single Chromium
    // instance; screenshotting 27 pages concurrently would multiply memory/CPU for no benefit
    // (nothing downstream depends on ordering, just avoiding resource contention).
    for (const componentId of componentIds) {
      const example = exampleProps[componentId]!;

      const spec = {
        root: "page-root",
        elements: {
          "page-root": {
            type: "page_root",
            props: {},
            children: [componentId]
          },
          [componentId]: {
            type: componentId,
            props: example,
            children: []
          }
        }
      };

      const artifact = await renderPageArtifact({
        spec,
        tokens: DEFAULT_DESIGN_TOKENS,
        title: componentId,
        hostname: "component-thumbnail.internal",
        canonicalPath: "/",
        runtimeConfig: {
          orgId: "thumbnail",
          campaignId: null,
          deployId: "component-thumbnail"
        }
      });

      const cssAsset = artifact.assets.find(
        (asset) => asset.mime === "text/css"
      );
      const html = cssAsset
        ? artifact.html.replace(
            "</head>",
            `<style>${new TextDecoder().decode(cssAsset.bytes)}</style></head>`
          )
        : artifact.html;

      const page = await browser.newPage({
        viewport: { width: THUMBNAIL_WIDTH, height: THUMBNAIL_MAX_HEIGHT }
      });
      try {
        await page.setContent(html, {
          waitUntil: "networkidle",
          timeout: 30_000
        });
        const bodyHeight = await page.evaluate(
          () => document.body.scrollHeight
        );
        await page.setViewportSize({
          width: THUMBNAIL_WIDTH,
          height: Math.min(bodyHeight, THUMBNAIL_MAX_HEIGHT)
        });
        const screenshot = await page.screenshot({ type: "png" });
        await Bun.write(`${OUTPUT_DIR}${componentId}.png`, screenshot);
        written += 1;
        console.log(`wrote ${componentId}.png`);
      } finally {
        await page.close();
      }
    }
    console.log(`done: ${written}/${componentIds.length} thumbnails written`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
