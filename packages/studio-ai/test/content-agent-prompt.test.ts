import type { StrategyBrief } from "@dv/contracts";
import { describe, expect, it } from "vitest";

import { compileContentAgentPrompt } from "../src/content-agent-prompt.js";

const brief: StrategyBrief = {
  id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  orgId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  landingPageId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  business: {},
  customer: {
    icp: "SME logistics",
    painPoints: [],
    desiredOutcomes: [],
    objections: [],
    jobsToBeDone: [],
    triggers: []
  },
  market: { alternatives: [], competitors: [], differentiators: [] },
  funnel: {},
  offer: { bonuses: [] },
  message: {
    valueProposition: "Quản lý kho realtime",
    supportingClaims: [{ claim: "Giảm 30% thất thoát", evidenceRef: "brief" }],
    objectionHandling: []
  },
  confirmedAt: new Date(),
  confirmedBy: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  createdAt: new Date(),
  updatedAt: new Date()
};

describe("compileContentAgentPrompt", () => {
  it("embeds the JSON schema verbatim and the relevant strategy fields", () => {
    const prompt = compileContentAgentPrompt({
      componentId: "hero",
      variant: "saas",
      purpose: "understanding",
      reason: "Rõ ràng ngay above-the-fold",
      strategyBrief: brief,
      propsJsonSchema: {
        type: "object",
        properties: { headline: { type: "string" } }
      }
    });

    expect(prompt).toContain('"headline":{"type":"string"}');
    expect(prompt).toContain("Rõ ràng ngay above-the-fold");
    expect(prompt).toContain("Quản lý kho realtime");
    expect(prompt).toContain('"Giảm 30% thất thoát" [evidenceRef: brief]');
  });

  it("appends fixGuidance only when set", () => {
    const withoutGuidance = compileContentAgentPrompt({
      componentId: "hero",
      variant: "saas",
      purpose: "understanding",
      reason: "r",
      strategyBrief: brief,
      propsJsonSchema: {}
    });
    expect(withoutGuidance).not.toContain("Feedback cần sửa");

    const withGuidance = compileContentAgentPrompt({
      componentId: "hero",
      variant: "saas",
      purpose: "understanding",
      reason: "r",
      strategyBrief: brief,
      propsJsonSchema: {},
      fixGuidance: "- Headline mơ hồ, thiếu số liệu cụ thể."
    });
    expect(withGuidance).toContain("Feedback cần sửa");
    expect(withGuidance).toContain("Headline mơ hồ, thiếu số liệu cụ thể.");
  });
});
