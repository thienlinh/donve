import type { Spec } from "@json-render/core";
import { describe, expect, it } from "vitest";

import { exampleProps } from "../src/example-props.js";
import { applySpecOps } from "../src/spec-ops.js";

function buildSpec(): Spec {
  return {
    root: "page-root",
    elements: {
      "page-root": {
        type: "page_root",
        props: {},
        children: ["hero-1", "faq-1"]
      },
      "hero-1": { type: "hero", props: exampleProps.hero!, children: [] },
      "faq-1": {
        type: "faq_accordion",
        props: exampleProps.faq_accordion!,
        children: []
      }
    }
  };
}

describe("applySpecOps", () => {
  it("shallow-merges setProps and re-validates the whole props object", () => {
    const { spec, errors } = applySpecOps(buildSpec(), [
      { op: "setProps", elementId: "hero-1", props: { headline: "Mới" } }
    ]);

    expect(errors).toEqual([]);
    expect(spec.elements["hero-1"]!.props).toMatchObject({
      headline: "Mới",
      ctaLabel: exampleProps.hero!.ctaLabel
    });
  });

  it("rejects the whole batch (leaving the spec untouched) when any op is invalid", () => {
    const input = buildSpec();
    const { spec, errors } = applySpecOps(input, [
      { op: "setProps", elementId: "hero-1", props: { headline: "Mới" } },
      { op: "setProps", elementId: "nope-1", props: {} }
    ]);

    expect(errors).toHaveLength(1);
    expect(spec).toEqual(input);
  });

  it("rejects props that don't match the component's schema", () => {
    const { errors } = applySpecOps(buildSpec(), [
      { op: "setProps", elementId: "hero-1", props: { headline: 42 } }
    ]);

    expect(errors[0]).toContain("hero");
  });

  it("inserts after an element (null = top of page) with a server-assigned id", () => {
    const { spec, errors } = applySpecOps(buildSpec(), [
      {
        op: "insertElement",
        componentId: "testimonial",
        props: exampleProps.testimonial!,
        afterElementId: "hero-1"
      },
      {
        op: "insertElement",
        componentId: "nav_bar",
        props: exampleProps.nav_bar!,
        afterElementId: null
      }
    ]);

    expect(errors).toEqual([]);
    const children = spec.elements["page-root"]!.children!;
    expect(children[0]).toMatch(/^nav_bar-/);
    expect(children[2]).toMatch(/^testimonial-/);
    expect(spec.elements[children[2]!]!.type).toBe("testimonial");
  });

  it("removes and moves elements", () => {
    const { spec, errors } = applySpecOps(buildSpec(), [
      { op: "moveElement", elementId: "faq-1", afterElementId: null },
      { op: "removeElement", elementId: "hero-1" }
    ]);

    expect(errors).toEqual([]);
    expect(spec.elements["page-root"]!.children).toEqual(["faq-1"]);
    expect(spec.elements["hero-1"]).toBeUndefined();
  });

  it("reports unknown componentIds instead of inventing a component", () => {
    const { errors } = applySpecOps(buildSpec(), [
      {
        op: "insertElement",
        componentId: "pricing_calculator",
        props: {},
        afterElementId: null
      }
    ]);

    expect(errors[0]).toContain("pricing_calculator");
  });
});
