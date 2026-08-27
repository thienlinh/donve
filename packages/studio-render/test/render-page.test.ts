import type { DesignTokens } from "@dv/studio-catalog";
import type { Spec } from "@json-render/core";
import { describe, expect, it } from "vitest";

import { renderPageArtifact } from "../src/render-page.js";

const tokens: DesignTokens = {
  colorPrimary: "#2563eb",
  colorPrimaryForeground: "#ffffff",
  colorAccent: "#4f46e5",
  colorAccentForeground: "#ffffff",
  colorSurface: "#ffffff",
  colorForeground: "#111827",
  colorMuted: "#6b7280",
  colorBorder: "#e5e7eb",
  fontHeading: "Inter",
  fontBody: "Inter",
  radius: "0.5rem"
};

const spec: Spec = {
  root: "page-root",
  elements: {
    "page-root": {
      type: "page_root",
      props: {},
      children: ["hero-1", "footer-1"]
    },
    "hero-1": {
      type: "hero",
      props: {
        headline: "Ra mắt landing page trong 5 phút",
        subheadline: "AI và thao tác thủ công cùng lên 1 hệ thống",
        ctaLabel: "Bắt đầu",
        ctaHref: "/signup",
        image: { src: "https://example.com/hero.jpg", alt: "demo" },
        variant: "saas"
      },
      children: []
    },
    "footer-1": {
      type: "footer",
      props: {
        logoText: "DonVe",
        copyrightText: "© 2026 DonVe",
        variant: "minimal"
      },
      children: []
    }
  }
};

describe("renderPageArtifact", () => {
  it("SSRs a hand-written PageSpec into publish-ready HTML + a CSS asset", async () => {
    const result = await renderPageArtifact({
      spec,
      tokens,
      title: "DonVe — Landing page AI-native",
      description: "Tạo, đo lường, tối ưu landing page",
      hostname: "demo.example.com",
      canonicalPath: "/",
      runtimeConfig: { orgId: "org_1", campaignId: null, deployId: "deploy_1" }
    });

    expect(result.html).toContain("Ra mắt landing page trong 5 phút");
    expect(result.html).toContain('data-lp-component="hero"');
    expect(result.html).toContain('data-lp-component="footer"');
    expect(result.html).toContain("DonVe — Landing page AI-native");
    expect(result.html).toContain('rel="canonical"');
    expect(result.html).toContain("https://demo.example.com/");
    expect(result.html).toContain("application/ld+json");
    expect(result.html).toContain("--lp-color-primary:#2563eb");

    const cssAsset = result.assets.find((asset) => asset.mime === "text/css");
    expect(cssAsset).toBeDefined();
    expect(new TextDecoder().decode(cssAsset?.bytes)).toContain(
      "var(--lp-color-primary)"
    );
  });
});
