import type { NativePageDocument } from "@dv/contracts";
import type { ComponentMeta } from "@dv/studio-catalog";
import { describe, expect, it } from "vitest";

import {
  checkPageStructure,
  checkSeo,
  checkTokenConsistency,
  checkTrackingCompleteness
} from "../src/lib/quality-audit.js";

const tokens: NativePageDocument["tokens"] = {
  colorPrimary: "#111827",
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

describe("checkPageStructure", () => {
  it("flags every purpose with no covering section", () => {
    const doc: NativePageDocument = {
      pageSpec: {
        root: "page-root",
        elements: {
          "page-root": { type: "page_root", props: {}, children: ["hero-1"] },
          "hero-1": { type: "hero", props: {}, children: [] }
        }
      },
      tokens,
      architectureNotes: {
        "hero-1": { purpose: "understanding", reason: "test" }
      }
    };
    const findings = checkPageStructure(doc);
    const purposes = findings.map((f) => f.message);
    expect(purposes.some((m) => m.includes("desire"))).toBe(true);
    expect(purposes.some((m) => m.includes("understanding"))).toBe(false);
  });
});

describe("checkSeo", () => {
  it("flags missing title/canonical/og:title/h1", () => {
    const findings = checkSeo("<html><head></head><body></body></html>");
    const categories = findings.map((f) => f.message);
    expect(categories.some((m) => m.includes("title"))).toBe(true);
    expect(categories.some((m) => m.includes("canonical"))).toBe(true);
    expect(categories.some((m) => m.includes("h1"))).toBe(true);
  });

  it("passes a well-formed head with exactly 1 h1", () => {
    const html = `<html><head>
      <title>Test</title>
      <meta name="description" content="desc">
      <link rel="canonical" href="https://x.com/">
      <meta property="og:title" content="Test">
    </head><body><h1>Hi</h1></body></html>`;
    expect(checkSeo(html)).toEqual([]);
  });
});

describe("checkTrackingCompleteness", () => {
  it("flags a component missing one of its declared tracking events", () => {
    const doc: NativePageDocument = {
      pageSpec: {
        root: "page-root",
        elements: {
          "page-root": { type: "page_root", props: {}, children: ["hero-1"] },
          "hero-1": { type: "hero", props: {}, children: [] }
        }
      },
      tokens
    };
    const metaById: Map<string, ComponentMeta> = new Map([
      [
        "hero",
        {
          componentId: "hero",
          category: "Hero",
          variants: [],
          purpose: [],
          trackingEvents: ["cta_clicked"],
          sensitiveProps: []
        }
      ]
    ] as never);

    const missing = checkTrackingCompleteness(doc, "<html></html>", metaById);
    expect(missing).toHaveLength(1);

    const present = checkTrackingCompleteness(
      doc,
      '<a data-lp-track="cta_clicked">Go</a>',
      metaById
    );
    expect(present).toHaveLength(0);
  });
});

describe("checkTokenConsistency", () => {
  it("ignores hex colors inside the :root token block but flags literal colors elsewhere", () => {
    const clean = `<style>:root{--lp-color-primary:#111827;}</style><div class="bg-[var(--lp-color-primary)]"></div>`;
    expect(checkTokenConsistency(clean)).toEqual([]);

    const dirty = `<style>:root{--lp-color-primary:#111827;}</style><div style="color:#ff0000"></div>`;
    expect(checkTokenConsistency(dirty)).toHaveLength(1);
  });
});
