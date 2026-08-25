import { describe, expect, it } from "vitest";

import { compileOptimizationPrompt } from "../src/optimization-prompt.js";

describe("compileOptimizationPrompt", () => {
  it("includes event counts and audit history", () => {
    const prompt = compileOptimizationPrompt({
      lookbackDays: 30,
      eventCounts: [
        { type: "page_viewed", count: 500 },
        { type: "cta_clicked", count: 20 }
      ],
      auditHistory: [
        {
          createdAt: "2026-08-01T00:00:00.000Z",
          overallScore: 78,
          categoryScores: { seo: 60 }
        }
      ]
    });

    expect(prompt).toContain("page_viewed: 500");
    expect(prompt).toContain("cta_clicked: 20");
    expect(prompt).toContain("overall 78");
    expect(prompt).toContain('"seo":60');
    expect(prompt).toContain("30 ngày");
  });

  it("renders explicit empty-state text instead of blank sections", () => {
    const prompt = compileOptimizationPrompt({
      lookbackDays: 30,
      eventCounts: [],
      auditHistory: []
    });

    expect(prompt).toContain("không có event nào");
    expect(prompt).toContain("chưa có audit run nào");
  });
});
