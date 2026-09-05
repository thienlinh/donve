import { APICallError, NoOutputGeneratedError, RetryError } from "ai";
import { describe, expect, it } from "vitest";

import { classifyAiStreamError } from "../src/providers/shared.js";

function apiCallError(statusCode: number): APICallError {
  return new APICallError({
    message: "boom",
    url: "https://example.test",
    requestBodyValues: {},
    statusCode
  });
}

describe("classifyAiStreamError", () => {
  it("classifies a 429 as rate_limited", () => {
    expect(classifyAiStreamError(apiCallError(429))).toBe("rate_limited");
  });

  it("classifies a 503 as overloaded", () => {
    expect(classifyAiStreamError(apiCallError(503))).toBe("overloaded");
  });

  it("classifies a 404/410 as model_unavailable", () => {
    expect(classifyAiStreamError(apiCallError(404))).toBe("model_unavailable");
    expect(classifyAiStreamError(apiCallError(410))).toBe("model_unavailable");
  });

  it("classifies NoOutputGeneratedError as no_output", () => {
    expect(
      classifyAiStreamError(new NoOutputGeneratedError({ message: "empty" }))
    ).toBe("no_output");
  });

  it("classifies the first APICallError inside a RetryError", () => {
    const retry = new RetryError({
      message: "retries exhausted",
      reason: "maxRetriesExceeded",
      errors: [apiCallError(429)]
    });
    expect(classifyAiStreamError(retry)).toBe("rate_limited");
  });

  it("returns undefined for an unclassified error", () => {
    expect(classifyAiStreamError(new Error("something else"))).toBeUndefined();
    expect(classifyAiStreamError(apiCallError(400))).toBeUndefined();
  });
});
