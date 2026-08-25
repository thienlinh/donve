import { describe, expect, it } from "vitest";

import {
  compileClassifySectionsPrompt,
  compileExtractContentPrompt
} from "../src/convert-to-native-prompt.js";

describe("compileClassifySectionsPrompt", () => {
  it("lists the catalog and every section by index", () => {
    const prompt = compileClassifySectionsPrompt({
      catalog: [
        {
          componentId: "hero",
          category: "Hero",
          purpose: ["understanding"],
          variants: ["saas"],
          description: "Above-the-fold"
        }
      ],
      sections: [
        { index: 0, html: "<section>Xin chào</section>" },
        { index: 1, html: "<div>Liên hệ</div>" }
      ]
    });

    expect(prompt).toContain("hero [Hero]");
    expect(prompt).toContain("--- Section 0 ---");
    expect(prompt).toContain("Xin chào");
    expect(prompt).toContain("--- Section 1 ---");
    expect(prompt).toContain("Liên hệ");
  });
});

describe("compileExtractContentPrompt", () => {
  it("embeds the schema and the raw section html", () => {
    const prompt = compileExtractContentPrompt({
      componentId: "hero",
      variant: "saas",
      sectionHtml: "<section><h1>Chào</h1></section>",
      propsJsonSchema: { type: "object", properties: {} }
    });

    expect(prompt).toContain("Component: hero (variant: saas)");
    expect(prompt).toContain('"type":"object"');
    expect(prompt).toContain("<h1>Chào</h1>");
  });
});
