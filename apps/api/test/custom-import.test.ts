import type { storage } from "@dv/drivers";
import { describe, expect, it, vi } from "vitest";

import {
  applyCustomChatEdits,
  detectImportForms,
  tryStampForCanvas,
  wireLeadForm
} from "../src/lib/custom-import.js";

function fakeStorage() {
  const put = vi.fn().mockResolvedValue({ key: "x", size: 0 });
  const driver: storage.StorageDriver = {
    put,
    get: vi.fn().mockResolvedValue(null),
    delete: vi.fn().mockResolvedValue(undefined)
  };
  return { driver, put };
}

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

  it("falls back to id when a field has no name attribute", () => {
    const html = `<html><body>
      <form><input id="f-name" type="text"/><input id="f-phone"/></form>
    </body></html>`;

    const forms = detectImportForms(html);
    expect(forms[0]?.fields.map((f) => f.name)).toEqual(["f-name", "f-phone"]);
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

  it("wires an id-only field (no name attribute) by matching on id", () => {
    const idOnlyHtml = `<html><body>
      <form><input id="f-name" type="text"/><input id="f-phone"/></form>
    </body></html>`;
    const result = wireLeadForm(idOnlyHtml, "import-form-0", {
      fullName: "f-name",
      phone: "f-phone"
    });
    expect(result).toContain('name="fullName"');
    expect(result).toContain('name="phone"');
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

describe("tryStampForCanvas", () => {
  it("stamps data-cc-ids, writes a srcmap JSON object, and returns a non-null srcmapKey", async () => {
    const { driver, put } = fakeStorage();
    const html = "<html><body><h1>Hello</h1></body></html>";

    const result = await tryStampForCanvas(driver, "lp-1", 1, html);

    expect(result.srcmapKey).toBe(
      "landing-pages/lp-1/v1/index.html.srcmap.json"
    );
    expect(result.html).toContain("data-cc-id");
    // autoNameLayers runs after stampSrcmap — a heading gets a friendly data-cc-name, not just
    // a raw data-cc-id.
    expect(result.html).toContain('data-cc-name="Heading: Hello"');
    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "landing-pages/lp-1/v1/index.html.srcmap.json",
        contentType: "application/json"
      })
    );
  });

  it("falls back to srcmapKey: null on genuinely unparseable input, without throwing", async () => {
    const { driver, put } = fakeStorage();

    const result = await tryStampForCanvas(driver, "lp-1", 1, "");

    expect(result.srcmapKey).toBeNull();
    expect(result.html).toBe("");
    expect(put).not.toHaveBeenCalled();
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
