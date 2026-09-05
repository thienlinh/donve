import { describe, expect, it } from "vitest";

import { sanitizeLandingHtml } from "../src/sanitize.js";

describe("sanitizeLandingHtml", () => {
  it("strips <script> tags and their content", () => {
    const out = sanitizeLandingHtml(
      "<html><body><script>alert(document.cookie)</script><p>Hi</p></body></html>"
    );
    expect(out).not.toContain("<script");
    expect(out).not.toContain("alert(document.cookie)");
    expect(out).toContain("<p>Hi</p>");
  });

  it("strips inline event-handler attributes", () => {
    const out = sanitizeLandingHtml(
      `<button onclick="stealCookies()" data-cc-id="cc-1">Click</button>`
    );
    expect(out).not.toContain("onclick");
    expect(out).toContain('data-cc-id="cc-1"');
  });

  it("strips javascript: URLs from href/src but keeps normal ones", () => {
    const out = sanitizeLandingHtml(
      `<a href="javascript:alert(1)">bad</a><a href="https://example.com">good</a>` +
        `<img src="javascript:alert(2)"><img src="/assets/a.png">`
    );
    expect(out).not.toContain("javascript:alert(1)");
    expect(out).not.toContain("javascript:alert(2)");
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('src="/assets/a.png"');
  });

  it("unwraps <noscript> content instead of dropping it, since scripts never run here", () => {
    const out = sanitizeLandingHtml(
      `<noscript><style>.reveal{opacity:1}</style></noscript><p onclick="bad()">Hi</p>`
    );
    expect(out).not.toContain("noscript");
    expect(out).toContain("<style>.reveal{opacity:1}</style>");
    expect(out).not.toContain("onclick");
  });

  it("preserves full document structure, inline <style>, and normal attributes", () => {
    const html =
      `<!DOCTYPE html><html><head><style>body{color:red}</style></head>` +
      `<body class="hero" style="padding:8px"><h1 data-cc-id="cc-1">Hello</h1></body></html>`;
    const out = sanitizeLandingHtml(html);
    expect(out).toContain("<style>body{color:red}</style>");
    expect(out).toContain('class="hero"');
    expect(out).toContain('style="padding:8px"');
    expect(out).toContain('data-cc-id="cc-1"');
  });
});
