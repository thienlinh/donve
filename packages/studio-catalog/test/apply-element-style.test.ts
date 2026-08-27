import { createElement, type ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { applyElementStyle } from "../src/apply-element-style.js";

type StyledElement = ReactElement<{ style?: Record<string, unknown> }>;

describe("applyElementStyle", () => {
  it("merges style props onto an element with no prior style", () => {
    const node = createElement("section", {});
    const result = applyElementStyle(node, {
      "font-size": "16px",
      color: "#fff"
    }) as StyledElement;
    expect(result.props.style).toEqual({ fontSize: "16px", color: "#fff" });
  });

  it("merges onto (not replaces) an element that already has an inline style", () => {
    const node = createElement("section", { style: { display: "flex" } });
    const result = applyElementStyle(node, {
      padding: "10px"
    }) as StyledElement;
    expect(result.props.style).toEqual({ display: "flex", padding: "10px" });
  });

  it("is a no-op when style is undefined", () => {
    const node = createElement("section", {});
    expect(applyElementStyle(node, undefined)).toBe(node);
  });

  it("is a no-op when the rendered node isn't a valid element", () => {
    expect(applyElementStyle(null, { color: "red" })).toBeNull();
    expect(applyElementStyle("text", { color: "red" })).toBe("text");
  });
});
