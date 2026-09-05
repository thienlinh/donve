import { describe, expect, it } from "vitest";

import { stampSrcmap } from "../src/html.js";
import { extractImageSources } from "../src/image-extract.js";

describe("extractImageSources", () => {
  it("reads a normal <img src>", () => {
    const html = stampSrcmap(`<img src="assets/a.webp" alt="a">`);
    const found = extractImageSources(html);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ src: "assets/a.webp", attr: "src" });
  });

  it("falls back to data-src for lazy-loaded <img> with no src (2026-09-04 fix)", () => {
    const html = stampSrcmap(
      `<img data-src="assets/kenh-phuong-mai-01.webp" alt="a" width="340" height="738">`
    );
    const found = extractImageSources(html);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({
      src: "assets/kenh-phuong-mai-01.webp",
      // always written to `src`, not `data-src` — there's no JS left to consume data-src.
      attr: "src",
      // caller must also strip `data-src` — lazy-load CSS like `img[data-src]{visibility:hidden}`
      // would otherwise keep the image invisible forever even once `src` resolves.
      removeDataSrc: true
    });
  });

  it("prefers src over data-src when both are present", () => {
    const html = stampSrcmap(
      `<img src="assets/real.webp" data-src="assets/placeholder.webp" alt="a">`
    );
    const found = extractImageSources(html);
    expect(found).toHaveLength(1);
    expect(found[0]?.src).toBe("assets/real.webp");
    expect(found[0]?.removeDataSrc).toBeFalsy();
  });

  it("still finds video src/poster and source src", () => {
    const html = stampSrcmap(
      `<video src="v.mp4" poster="p.jpg"><source src="v2.mp4"></video>`
    );
    const found = extractImageSources(html);
    expect(found.map((f) => f.src).toSorted()).toEqual(
      ["p.jpg", "v.mp4", "v2.mp4"].toSorted()
    );
  });
});
