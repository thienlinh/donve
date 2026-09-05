import { describe, expect, it } from "vitest";

import { stampSrcmap } from "../src/html.js";
import { autoNameLayers } from "../src/layer-naming.js";

function nameFor(html: string, selectorMarker: string): string | null {
  const { html: named } = autoNameLayers(stampSrcmap(html));
  const el = new RegExp(
    `<[^>]*${selectorMarker}[^>]*data-cc-name="([^"]*)"`
  ).exec(named);
  return el ? el[1]! : null;
}

describe("autoNameLayers heuristic", () => {
  it("names an inline span by its own text", () => {
    const html = `<h1>Hello <span class="text-purple-500">World</span></h1>`;
    expect(nameFor(html, "span")).toBe("Text: World");
  });

  it("names a div wrapping a heading after that heading", () => {
    const html = `<div class="wrap"><h2>Pricing</h2></div>`;
    expect(nameFor(html, "div")).toBe("Group: Pricing");
  });

  it("falls back to a plain Group name for an empty decorative div", () => {
    const html = `<div class="spacer"></div>`;
    expect(nameFor(html, "div")).toBe("Group");
  });

  it("still names headings as before (unchanged coverage)", () => {
    expect(nameFor(`<h1>Title</h1>`, "h1")).toBe("Heading: Title");
  });

  it("still names buttons as before (unchanged coverage)", () => {
    expect(nameFor(`<button>Buy now</button>`, "button")).toBe(
      "Button: Buy now"
    );
  });
});
