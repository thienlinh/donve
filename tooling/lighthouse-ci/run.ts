#!/usr/bin/env bun
/**
 * NFR-01 gate: run Lighthouse (mobile, default "Slow 4G" simulated throttling) against a
 * deployed sample landing page, plus a gzip-size check on the landing-runtime bundle it embeds.
 * Usage: bun tooling/lighthouse-ci/run.ts <sample-landing-url>
 */
import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";

const THRESHOLDS = {
  performance: 95,
  accessibility: 95,
  bestPractices: 95,
  seo: 95,
  lcpMs: 1800,
  runtimeGzipBytes: 10 * 1024
};

const url = process.argv[2] ?? process.env.SAMPLE_LANDING_URL;
if (!url) {
  console.error("Usage: bun tooling/lighthouse-ci/run.ts <sample-landing-url>");
  process.exit(1);
}

let failed = false;

function checkMin(label: string, value: number, min: number, unit = ""): void {
  const ok = value >= min;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${label}: ${value}${unit} (>= ${min}${unit})`
  );
  if (!ok) failed = true;
}

function checkMax(label: string, value: number, max: number, unit = ""): void {
  const ok = value <= max;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${label}: ${value}${unit} (<= ${max}${unit})`
  );
  if (!ok) failed = true;
}

const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
try {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    logLevel: "error"
  });
  if (!result) throw new Error(`Lighthouse produced no result for ${url}`);
  const { categories, audits } = result.lhr;

  checkMin(
    "performance",
    Math.round((categories.performance?.score ?? 0) * 100),
    THRESHOLDS.performance
  );
  checkMin(
    "accessibility",
    Math.round((categories.accessibility?.score ?? 0) * 100),
    THRESHOLDS.accessibility
  );
  checkMin(
    "bestPractices",
    Math.round((categories["best-practices"]?.score ?? 0) * 100),
    THRESHOLDS.bestPractices
  );
  checkMin(
    "seo",
    Math.round((categories.seo?.score ?? 0) * 100),
    THRESHOLDS.seo
  );

  const lcpMs =
    audits["largest-contentful-paint"]?.numericValue ??
    Number.POSITIVE_INFINITY;
  checkMax("LCP", Math.round(lcpMs), THRESHOLDS.lcpMs, "ms");
} finally {
  chrome.kill();
}

const runtimePath = new URL(
  "../../apps/landing-runtime/dist/index.iife.js",
  import.meta.url
);
const runtimeSource = await readFile(runtimePath);
const runtimeGzipBytes = gzipSync(runtimeSource).byteLength;
checkMax("runtime JS gzip", runtimeGzipBytes, THRESHOLDS.runtimeGzipBytes, "B");

if (failed) {
  console.error("\nNFR-01 gate failed.");
  process.exit(1);
}
console.log("\nNFR-01 gate passed.");
