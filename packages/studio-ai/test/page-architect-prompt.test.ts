import type { StrategyBrief } from "@dv/contracts";
import { describe, expect, it } from "vitest";

import {
  compileArchitectureFixPrompt,
  compilePageArchitectPrompt
} from "../src/page-architect-prompt.js";

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
  market: {
    alternatives: [],
    competitors: [],
    differentiators: ["Nhanh hơn 2x"]
  },
  funnel: { conversionGoal: "demo_booked" },
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

describe("compilePageArchitectPrompt", () => {
  it("includes the catalog list and the strategy brief's key fields", () => {
    const prompt = compilePageArchitectPrompt({
      strategyBrief: brief,
      catalog: [
        {
          componentId: "hero",
          category: "Hero",
          purpose: ["understanding", "action"],
          variants: ["saas", "leadgen"],
          description: "Above-the-fold"
        }
      ]
    });

    expect(prompt).toContain("hero [Hero, purpose: understanding/action]");
    expect(prompt).toContain("saas, leadgen");
    expect(prompt).toContain("Quản lý kho realtime");
    expect(prompt).toContain("demo_booked");
    expect(prompt).toContain("Nhanh hơn 2x");
  });
});

describe("compileArchitectureFixPrompt", () => {
  it("lists existing components and only the missing purposes", () => {
    const prompt = compileArchitectureFixPrompt({
      strategyBrief: brief,
      catalog: [
        {
          componentId: "hero",
          category: "Hero",
          purpose: ["understanding", "action"],
          variants: ["saas", "leadgen"],
          description: "Above-the-fold"
        }
      ],
      existingComponentIds: ["hero", "lead_form"],
      missingPurposes: ["proof"]
    });

    expect(prompt).toContain("hero, lead_form");
    expect(prompt).toContain("proof");
    expect(prompt).toContain("Quản lý kho realtime");
    expect(prompt).toContain("SỬA 1 trang đã tồn tại");
  });
});
