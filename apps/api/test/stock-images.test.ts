import { describe, expect, it } from "vitest";

import { isAllowedStockImageUrl } from "../src/lib/stock-images.js";

describe("isAllowedStockImageUrl", () => {
  it("allows a candidate url on the provider's known CDN host", () => {
    expect(
      isAllowedStockImageUrl({
        provider: "unsplash",
        url: "https://images.unsplash.com/photo-123"
      })
    ).toBe(true);
    expect(
      isAllowedStockImageUrl({
        provider: "pexels",
        url: "https://images.pexels.com/photos/123/pexels-photo-123.jpeg"
      })
    ).toBe(true);
  });

  it("rejects a url on a mismatched or arbitrary host (SSRF via echoed candidate.url)", () => {
    expect(
      isAllowedStockImageUrl({
        provider: "unsplash",
        url: "https://images.pexels.com/photos/123/pexels-photo-123.jpeg"
      })
    ).toBe(false);
    expect(
      isAllowedStockImageUrl({
        provider: "unsplash",
        url: "http://169.254.169.254/latest/meta-data/"
      })
    ).toBe(false);
    expect(
      isAllowedStockImageUrl({
        provider: "unsplash",
        url: "https://images.unsplash.com.evil.example/photo-123"
      })
    ).toBe(false);
  });

  it("rejects an unparseable url", () => {
    expect(
      isAllowedStockImageUrl({ provider: "pexels", url: "not-a-url" })
    ).toBe(false);
  });
});
