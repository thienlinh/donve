import type { KnowledgeItem } from "@dv/contracts";
import { describe, expect, it } from "vitest";

import { compileStrategyPrompt } from "../src/strategy-prompt.js";

describe("compileStrategyPrompt", () => {
  it("formats each knowledge item with its status and lists all 3 categories", () => {
    const product: KnowledgeItem[] = [
      {
        label: "category",
        value: "SaaS B2B",
        status: "fact",
        sourceRef: "brief"
      }
    ];
    const customer: KnowledgeItem[] = [
      { label: "ICP", value: "SME logistics", status: "inference" }
    ];
    const market: KnowledgeItem[] = [
      { label: "pricing model", value: "chưa rõ", status: "unknown" }
    ];

    const prompt = compileStrategyPrompt({ product, customer, market });

    expect(prompt).toContain("- [fact] category: SaaS B2B");
    expect(prompt).toContain("- [inference] ICP: SME logistics");
    expect(prompt).toContain("- [unknown] pricing model: chưa rõ");
    expect(prompt).toContain("evidenceRef");
    expect(prompt).toContain("--- Product ---");
    expect(prompt).toContain("--- Customer ---");
    expect(prompt).toContain("--- Market ---");
  });
});
