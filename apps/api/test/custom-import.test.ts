import { describe, expect, it } from "vitest";

import {
  applyCustomChatEdits,
  detectImportForms,
  splitIntoSections,
  wireLeadForm
} from "../src/lib/custom-import.js";

describe("detectImportForms", () => {
  it("finds every form and its named fields", () => {
    const html = `<html><body>
      <form><input name="Name" type="text"/><input name="Phone"/><button type="submit"></button></form>
      <form><input type="hidden"/></form>
    </body></html>`;

    const forms = detectImportForms(html);
    expect(forms).toHaveLength(2);
    expect(forms[0]?.selector).toBe("import-form-0");
    expect(forms[0]?.fields.map((f) => f.name)).toEqual(["Name", "Phone"]);
    expect(forms[1]?.fields).toEqual([]);
  });
});

describe("wireLeadForm", () => {
  const html = `<html><body>
    <form><input name="Name" type="text"/><input name="Phone"/></form>
  </body></html>`;

  it("tags the form and renames mapped fields", () => {
    const result = wireLeadForm(html, "import-form-0", {
      fullName: "Name",
      phone: "Phone"
    });
    expect(result).toContain('data-dv-form="lead"');
    expect(result).toContain('name="fullName"');
    expect(result).toContain('name="phone"');
    expect(result).not.toContain('name="Name"');
  });

  it("injects consent and honeypot fields when missing", () => {
    const result = wireLeadForm(html, "import-form-0", {});
    expect(result).toContain('name="consent"');
    expect(result).toContain('name="_hp"');
  });

  it("does not duplicate consent/honeypot fields when already present", () => {
    const withConsent = `<html><body>
      <form><input name="consent" type="checkbox"/><input name="_hp"/></form>
    </body></html>`;
    const result = wireLeadForm(withConsent, "import-form-0", {});
    expect(result.match(/name="consent"/g)).toHaveLength(1);
    expect(result.match(/name="_hp"/g)).toHaveLength(1);
  });

  it("throws on an out-of-range selector", () => {
    expect(() => wireLeadForm(html, "import-form-5", {})).toThrow();
  });
});

describe("splitIntoSections", () => {
  it("returns 1 entry per direct body child, skipping non-content tags", () => {
    const html = `<html><body>
      <script>void 0;</script>
      <section id="a">A</section>
      <div id="b">B</div>
    </body></html>`;

    const sections = splitIntoSections(html);
    expect(sections).toHaveLength(2);
    expect(sections[0]).toEqual({
      index: 0,
      html: '<section id="a">A</section>'
    });
    expect(sections[1]).toEqual({ index: 1, html: '<div id="b">B</div>' });
  });
});

describe("applyCustomChatEdits", () => {
  it("applies an edit whose search occurs exactly once", () => {
    const { html, results } = applyCustomChatEdits("<h1>Chào</h1>", [
      { search: "Chào", replace: "Xin chào", reason: "user asked" }
    ]);
    expect(html).toBe("<h1>Xin chào</h1>");
    expect(results[0]?.status).toBe("applied");
  });

  it("reports not_found instead of applying a hallucinated search", () => {
    const { html, results } = applyCustomChatEdits("<h1>Chào</h1>", [
      { search: "Không tồn tại", replace: "X", reason: "r" }
    ]);
    expect(html).toBe("<h1>Chào</h1>");
    expect(results[0]?.status).toBe("not_found");
  });

  it("reports ambiguous instead of replacing every occurrence", () => {
    const { html, results } = applyCustomChatEdits("<p>Chào</p><p>Chào</p>", [
      { search: "Chào", replace: "X", reason: "r" }
    ]);
    expect(html).toBe("<p>Chào</p><p>Chào</p>");
    expect(results[0]?.status).toBe("ambiguous");
  });

  it("treats a literal $ in the replacement as a plain string", () => {
    const { html } = applyCustomChatEdits("<p>giá cũ</p>", [
      { search: "giá cũ", replace: "$1,000,000", reason: "r" }
    ]);
    expect(html).toBe("<p>$1,000,000</p>");
  });

  it("applies later edits against the already-updated html", () => {
    const { html, results } = applyCustomChatEdits("<h1>A</h1>", [
      { search: "A", replace: "B", reason: "r" },
      { search: "B", replace: "C", reason: "r" }
    ]);
    expect(html).toBe("<h1>C</h1>");
    expect(results.every((r) => r.status === "applied")).toBe(true);
  });
});
