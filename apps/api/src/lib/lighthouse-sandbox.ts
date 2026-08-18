import type { LighthouseScore } from "@dv/contracts";

import type { Bindings } from "../types.js";

function toScore(score: number | null | undefined): number | null {
  return score === null || score === undefined ? null : Math.round(score * 100);
}

/**
 * Scores AI-generated HTML in a real, sandboxed Chrome (FR-F-04 test bench). Lighthouse needs
 * to launch an actual browser process, which only the Bun/VPS entrypoint can do — CF Workers
 * has no OS process to spawn, so this returns `null` there instead of throwing (the test-run
 * itself, i.e. the model call, still succeeds without a score).
 */
export async function runLighthouseSandbox(
  env: Bindings,
  html: string
): Promise<LighthouseScore | null> {
  if (env.RUNTIME !== "bun") return null;

  // Non-literal specifiers so esbuild (wrangler's bundler) can't statically pull these into
  // the CF Workers bundle — lighthouse + chrome-launcher spawn a real Chrome process, which
  // only ever happens on the Bun/VPS entrypoint (guarded above), never on Workers.
  const lighthouseModule = "lighthouse";
  const chromeLauncherModule = "chrome-launcher";
  const [{ default: lighthouse }, { launch }] = await Promise.all([
    import(lighthouseModule),
    import(chromeLauncherModule)
  ]);

  const server = Bun.serve({
    port: 0,
    fetch: () =>
      new Response(html, { headers: { "content-type": "text/html" } })
  });

  const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
  try {
    const result = await lighthouse(`http://localhost:${server.port}`, {
      port: chrome.port,
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      logLevel: "error"
    });
    const categories = result?.lhr.categories;
    if (!categories) return null;

    return {
      performance: toScore(categories.performance?.score),
      accessibility: toScore(categories.accessibility?.score),
      bestPractices: toScore(categories["best-practices"]?.score),
      seo: toScore(categories.seo?.score)
    };
  } finally {
    chrome.kill();
    server.stop();
  }
}
