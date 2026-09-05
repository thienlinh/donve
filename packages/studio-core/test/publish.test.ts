import { describe, expect, it } from "vitest";

import { buildPublishArtifacts } from "../src/publish.js";

describe("buildPublishArtifacts", () => {
  it("hashes assets, rewrites their URLs, and injects publish tags", async () => {
    const imageBytes = new TextEncoder().encode("fake-jpeg-bytes");
    const html =
      `<!DOCTYPE html><html><head><title>Yoga 6 tuần</title></head>` +
      `<body><img src="/original/hero.jpg"><script>alert(1)</script></body></html>`;

    const out = await buildPublishArtifacts({
      html,
      assets: [
        {
          originalUrl: "/original/hero.jpg",
          bytes: imageBytes,
          mime: "image/jpeg"
        }
      ],
      hostname: "yoga-6-tuan.donve.vn",
      title: "Yoga 6 tuần",
      runtimeConfig: { orgId: "org_1", campaignId: "camp_1", deployId: "dep_1" }
    });

    expect(out.assets).toHaveLength(1);
    const [asset] = out.assets;
    expect(asset.key).toMatch(/^assets\/[0-9a-f]{16}\.jpg$/);
    expect(out.html).toContain(`/${asset.key}`);
    expect(out.html).not.toContain("/original/hero.jpg");
    expect(out.html).not.toContain("alert(1)");
    expect(out.html).toContain('rel="canonical"');
    expect(out.html).toContain('href="https://yoga-6-tuan.donve.vn/"');
    expect(out.html).toContain('property="og:title"');
    expect(out.html).toContain("application/ld+json");
    expect(out.html).toContain("window.__DV__");
  });

  it("rewrites both <video src> and <video poster>, not just poster", async () => {
    const videoBytes = new TextEncoder().encode("fake-mp4-bytes");
    const posterBytes = new TextEncoder().encode("fake-poster-bytes");
    const html =
      `<html><head><title>T</title></head><body>` +
      `<video src="/original/clip.mp4" poster="/original/poster.webp"></video>` +
      `</body></html>`;

    const out = await buildPublishArtifacts({
      html,
      assets: [
        {
          originalUrl: "/original/clip.mp4",
          bytes: videoBytes,
          mime: "video/mp4"
        },
        {
          originalUrl: "/original/poster.webp",
          bytes: posterBytes,
          mime: "image/webp"
        }
      ],
      hostname: "x.donve.vn",
      title: "T",
      runtimeConfig: { orgId: "org_1", campaignId: null, deployId: "dep_1" }
    });

    expect(out.html).not.toContain("/original/clip.mp4");
    expect(out.html).not.toContain("/original/poster.webp");
    expect(out.html).toMatch(/<video src="\/assets\/[0-9a-f]{16}\.mp4"/);
    expect(out.html).toMatch(/poster="\/assets\/[0-9a-f]{16}\.webp"/);
  });

  it("uploads the runtime bundle as a content-hashed, deferred script when provided", async () => {
    const runtimeBytes = new TextEncoder().encode("console.log('runtime')");
    const out = await buildPublishArtifacts({
      html: "<html><head></head><body><h1>Hi</h1></body></html>",
      assets: [],
      hostname: "x.donve.vn",
      title: "X",
      runtimeConfig: { orgId: "org_1", campaignId: null, deployId: "dep_1" },
      runtimeScript: { bytes: runtimeBytes, mime: "application/javascript" }
    });

    const runtimeAsset = out.assets.find((a) =>
      a.key.startsWith("_dv-runtime.")
    );
    expect(runtimeAsset).toBeDefined();
    expect(out.html).toContain(`src="/${runtimeAsset?.key}"`);
    expect(out.html).toContain("defer");
  });

  it("adds preconnect + display=swap for a Google Fonts stylesheet link", async () => {
    const html =
      `<!DOCTYPE html><html><head>` +
      `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">` +
      `</head><body><h1>Hi</h1></body></html>`;

    const out = await buildPublishArtifacts({
      html,
      assets: [],
      hostname: "x.donve.vn",
      title: "X",
      runtimeConfig: { orgId: "org_1", campaignId: null, deployId: "dep_1" }
    });

    expect(out.html).toContain("family=Inter&display=swap");
    expect(out.html).toContain(
      'href="https://fonts.googleapis.com" rel="preconnect"'
    );
    expect(out.html).toContain(
      'crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"'
    );
  });

  it("doesn't duplicate an existing preconnect or re-append display=swap", async () => {
    const html =
      `<!DOCTYPE html><html><head>` +
      `<link rel="preconnect" href="https://fonts.googleapis.com">` +
      `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">` +
      `</head><body><h1>Hi</h1></body></html>`;

    const out = await buildPublishArtifacts({
      html,
      assets: [],
      hostname: "x.donve.vn",
      title: "X",
      runtimeConfig: { orgId: "org_1", campaignId: null, deployId: "dep_1" }
    });

    expect(
      out.html.match(/rel="preconnect" href="https:\/\/fonts.googleapis.com"/g)
    ).toHaveLength(1);
    expect(out.html.match(/display=swap/g)).toHaveLength(1);
  });

  it("preloads the first (hero) image using its rewritten asset path", async () => {
    const imageBytes = new TextEncoder().encode("fake-jpeg-bytes");
    const html =
      `<!DOCTYPE html><html><head></head>` +
      `<body><img src="/original/hero.jpg"><img src="/original/other.jpg"></body></html>`;

    const out = await buildPublishArtifacts({
      html,
      assets: [
        {
          originalUrl: "/original/hero.jpg",
          bytes: imageBytes,
          mime: "image/jpeg"
        },
        {
          originalUrl: "/original/other.jpg",
          bytes: imageBytes,
          mime: "image/jpeg"
        }
      ],
      hostname: "x.donve.vn",
      title: "X",
      runtimeConfig: { orgId: "org_1", campaignId: null, deployId: "dep_1" }
    });

    expect(out.html).toMatch(
      /<link href="\/assets\/[0-9a-f]{16}\.jpg" as="image" rel="preload">/
    );
  });
});
