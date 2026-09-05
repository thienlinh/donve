import { describe, expect, it } from "vitest";

import { pickMaxOutputTokens, pickModel } from "../src/model-tiering.js";
import type { ByokProviderId } from "../src/providers/types.js";

const CHEAP_MODEL: Record<ByokProviderId, string> = {
  openrouter: "deepseek/deepseek-chat-v3",
  anthropic: "claude-haiku-4-5",
  openai: "gpt-5-mini",
  groq: "qwen/qwen3.8-27b",
  nvidia: "nvidia/nemotron-3-nano-30b-a3b"
};

const PROVIDERS: ByokProviderId[] = [
  "openrouter",
  "anthropic",
  "openai",
  "groq",
  "nvidia"
];

describe("pickModel", () => {
  for (const provider of PROVIDERS) {
    it(`returns the connection's default model for "${provider}" on generate`, () => {
      expect(pickModel(provider, "generate", "connection-default")).toBe(
        "connection-default"
      );
    });

    it(`returns the cheap-tier model for "${provider}" on patch`, () => {
      expect(pickModel(provider, "patch", "connection-default")).toBe(
        CHEAP_MODEL[provider]
      );
    });
  }
});

describe("pickMaxOutputTokens", () => {
  it("returns 8000 for generate", () => {
    expect(pickMaxOutputTokens("generate")).toBe(8000);
  });

  it("returns 2000 for patch", () => {
    expect(pickMaxOutputTokens("patch")).toBe(2000);
  });
});
