import type { Spec } from "@json-render/core";
import { describe, expect, it } from "vitest";

import { exampleProps } from "../src/example-props.js";
import { renderSpecToHtml } from "../src/render.js";

describe("studio-catalog SSR smoke test", () => {
  it("renders every catalog component to non-empty static HTML", () => {
    const elements: Spec["elements"] = {
      "page-root": {
        type: "page_root",
        props: {},
        children: Object.keys(exampleProps)
      }
    };
    for (const [componentId, props] of Object.entries(exampleProps)) {
      elements[componentId] = { type: componentId, props, children: [] };
    }
    const spec: Spec = { root: "page-root", elements };

    const html = renderSpecToHtml(spec);

    expect(html.length).toBeGreaterThan(0);
    for (const componentId of Object.keys(exampleProps)) {
      expect(html).toContain(`data-lp-component="${componentId}"`);
    }
  });
});
