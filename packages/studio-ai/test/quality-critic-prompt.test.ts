import type { StrategyBrief } from "@dv/contracts";
import { describe, expect, it } from "vitest";

import { compileQualityCriticPrompt } from "../src/quality-critic-prompt.js";

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
    supportingClaims: [],
    objectionHandling: []
  },
  confirmedAt: new Date(),
  confirmedBy: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  createdAt: new Date(),
  updatedAt: new Date()
};

describe("compileQualityCriticPrompt", () => {
  it("lists every element with its componentId and props, and the strategy brief", () => {
    const prompt = compileQualityCriticPrompt({
      strategyBrief: brief,
      elements: [
        {
          elementId: "hero-1",
          componentId: "hero",
          props: { headline: "Xin chào" }
        }
      ]
    });

    expect(prompt).toContain("hero-1 (hero)");
    expect(prompt).toContain('"headline":"Xin chào"');
    expect(prompt).toContain("Quản lý kho realtime");
    expect(prompt).toContain("strategy_alignment");
    expect(prompt).toContain("messaging_copy");
  });
});
