import { describe, expect, it } from "vitest";

import { compileResearchPrompt } from "../src/research-prompt.js";

describe("compileResearchPrompt", () => {
  it("includes the brief, the fact/inference/unknown rule, and fetched sources", () => {
    const prompt = compileResearchPrompt({
      brief: "SaaS cho quản lý kho",
      sources: [{ url: "https://example.com", text: "Hàng tồn kho realtime" }]
    });

    expect(prompt).toContain("SaaS cho quản lý kho");
    expect(prompt).toContain('"fact"|"inference"|"unknown"');
    expect(prompt).toContain("https://example.com");
    expect(prompt).toContain("Hàng tồn kho realtime");
  });

  it("omits the sources block entirely when there are none", () => {
    const prompt = compileResearchPrompt({ brief: "Chỉ có brief" });
    expect(prompt).not.toContain("--- Nguồn:");
  });
});
