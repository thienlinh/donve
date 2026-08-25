import { describe, expect, it } from "vitest";

import { restoreSensitiveProps } from "../src/lib/sensitive-props.js";

describe("restoreSensitiveProps", () => {
  it("restores a plain field path", () => {
    const result = restoreSensitiveProps(
      { headline: "New", guarantee: "AI làm giả 100% tiền" },
      { headline: "New", guarantee: "Hoàn tiền 30 ngày" },
      ["guarantee"]
    );
    expect(result.guarantee).toBe("Hoàn tiền 30 ngày");
    expect(result.headline).toBe("New");
  });

  it("restores an array-wildcard nested path", () => {
    const result = restoreSensitiveProps(
      { plans: [{ name: "Pro", price: "999k" }] },
      { plans: [{ name: "Pro cũ", price: "199k" }] },
      ["plans[].price"]
    );
    expect(result.plans).toEqual([{ name: "Pro", price: "199k" }]);
  });

  it("leaves non-sensitive fields untouched when path is absent in new data", () => {
    const result = restoreSensitiveProps({ headline: "X" }, {}, ["price"]);
    expect(result).toEqual({ headline: "X" });
  });
});
