import { describe, expect, it } from "vitest";

import {
  detectFunnelGaps,
  InvalidGeneratedHtmlError,
  stampSrcmap
} from "../src/html.js";

describe("stampSrcmap", () => {
  it("stamps data-cc-id onto every element of a real document", () => {
    const html = "<html><body><h1>Hi</h1></body></html>";
    const stamped = stampSrcmap(html);
    expect(stamped).toContain('data-cc-id="cc-1"');
  });

  it("throws InvalidGeneratedHtmlError instead of a raw null-reference crash when the model's output isn't parseable HTML at all", () => {
    expect(() => stampSrcmap("")).toThrow(InvalidGeneratedHtmlError);
  });
});

describe("detectFunnelGaps", () => {
  it("flags both gaps on a bare imported document", () => {
    const gaps = detectFunnelGaps("<html><body><h1>Hi</h1></body></html>");
    expect(gaps).toEqual({ missingLeadForm: true, missingSeoMeta: true });
  });

  it("finds no gaps once the standard lead form and SEO meta are present", () => {
    const html = `<html><head><title>Khoá học X</title><meta name="description" content="Đăng ký ngay"></head><body><form data-dv-form="lead"><input name="fullName"></form></body></html>`;
    const gaps = detectFunnelGaps(html);
    expect(gaps).toEqual({ missingLeadForm: false, missingSeoMeta: false });
  });

  it("still flags missing SEO meta when only the description is empty", () => {
    const html = `<html><head><title>Khoá học X</title><meta name="description" content="  "></head><body></body></html>`;
    expect(detectFunnelGaps(html).missingSeoMeta).toBe(true);
  });
});
