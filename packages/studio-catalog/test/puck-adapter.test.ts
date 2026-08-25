import type { Spec } from "@json-render/core";
import { describe, expect, it } from "vitest";

import { exampleProps } from "../src/example-props.js";
import { pageSpecToPuckData, puckDataToPageSpec } from "../src/puck-adapter.js";

function buildFixtureSpec(): Spec {
  const elements: Spec["elements"] = {
    "page-root": {
      type: "page_root",
      props: {},
      children: [...Object.keys(exampleProps), "custom-html-1"]
    },
    "custom-html-1": {
      type: "raw_html_block",
      props: { html: "<p>legacy</p>" },
      children: []
    }
  };
  for (const [componentId, props] of Object.entries(exampleProps)) {
    elements[componentId] = { type: componentId, props, children: [] };
  }
  return { root: "page-root", elements };
}

describe("PageSpec ⇄ Puck Data adapter", () => {
  it("round-trips every catalog component (incl. pricing_table's array-of-objects and raw_html_block) without loss", () => {
    const spec = buildFixtureSpec();

    const data = pageSpecToPuckData(spec);
    const roundTripped = puckDataToPageSpec(data, spec);

    expect(roundTripped).toEqual(spec);
  });

  it("preserves section order", () => {
    const spec = buildFixtureSpec();
    const data = pageSpecToPuckData(spec);

    expect(data.content.map((item) => item.props.id)).toEqual(
      spec.elements["page-root"]!.children
    );
  });

  it("injects Puck's required id into props and strips it back out on save", () => {
    const spec = buildFixtureSpec();
    const data = pageSpecToPuckData(spec);

    for (const item of data.content) {
      expect(typeof item.props.id).toBe("string");
    }

    const roundTripped = puckDataToPageSpec(data, spec);
    for (const elementId of spec.elements["page-root"]!.children!) {
      expect(roundTripped.elements[elementId]!.props).not.toHaveProperty("id");
    }
  });

  it("preserves the page_root element itself, which Puck never sees", () => {
    const spec = buildFixtureSpec();
    const data = pageSpecToPuckData(spec);
    const roundTripped = puckDataToPageSpec(data, spec);

    expect(roundTripped.elements["page-root"]!.type).toBe("page_root");
    expect(roundTripped.root).toBe("page-root");
  });
});
