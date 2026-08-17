import { describe, expect, it } from "vitest";

import {
  encodeOrderCode,
  extractOrderCodes,
  isValidOrderCode
} from "../src/payments/order-code.js";

describe("encodeOrderCode / isValidOrderCode", () => {
  it("round-trips a valid code", () => {
    const code = encodeOrderCode("4F7K9M");
    expect(isValidOrderCode(code)).toBe(true);
  });

  it("rejects a single mistyped character", () => {
    const code = encodeOrderCode("4F7K9M");
    const mistyped = code.slice(0, 3) + "X" + code.slice(4);
    expect(isValidOrderCode(mistyped)).toBe(false);
  });

  it("rejects the wrong length", () => {
    expect(isValidOrderCode("4F7K9")).toBe(false);
    expect(isValidOrderCode("4F7K9M12")).toBe(false);
  });

  it("rejects characters outside the alphabet", () => {
    expect(() => encodeOrderCode("4F7K9O")).toThrow(RangeError);
  });
});

describe("extractOrderCodes", () => {
  it("finds an exact code embedded in free text", () => {
    const code = encodeOrderCode("4F7K9M");
    const { exact, corrected } = extractOrderCodes(
      `chuyen tien DV${code} thanh toan`,
      "DV"
    );
    expect(exact).toEqual([code]);
    expect(corrected).toEqual([]);
  });

  it("recovers a code after a confusable-character typo", () => {
    const data = "406789";
    const code = encodeOrderCode(data);
    // Mistype the '0' as the visually confusable letter 'O', checksum char untouched.
    const mangled = `4O6789${code[6]}`;

    const { exact, corrected } = extractOrderCodes(`DV${mangled}`, "DV");
    expect(exact).toEqual([]);
    expect(corrected).toEqual([code]);
  });

  it("returns nothing when no valid window is present", () => {
    const { exact, corrected } = extractOrderCodes("chuyen tien 500k", "DV");
    expect(exact).toEqual([]);
    expect(corrected).toEqual([]);
  });
});
