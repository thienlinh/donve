import {
  optimizationHypothesisSchema,
  type OptimizationHypothesis,
  type OptimizationHypothesisStatus
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const landingsFetch = createApiFetch("landings");

export async function fetchOptimizationHypotheses(
  landingPageId: string
): Promise<OptimizationHypothesis[]> {
  const res = await landingsFetch(`/${landingPageId}/optimization`);
  return z.array(optimizationHypothesisSchema).parse(await res.json());
}

/** `product/vision.md` §Optimization Loop — 409 `no_traffic_yet` when the page has no events
 * in the lookback window yet; callers should show that as a friendly empty state, not an error. */
export async function generateOptimizationHypotheses(
  landingPageId: string
): Promise<OptimizationHypothesis[]> {
  const res = await landingsFetch(`/${landingPageId}/optimization`, {
    method: "POST"
  });
  return z.array(optimizationHypothesisSchema).parse(await res.json());
}

export async function reviewOptimizationHypothesis(
  landingPageId: string,
  hypothesisId: string,
  status: Extract<OptimizationHypothesisStatus, "approved" | "rejected">
): Promise<OptimizationHypothesis> {
  const res = await landingsFetch(
    `/${landingPageId}/optimization/${hypothesisId}`,
    { method: "PATCH", body: JSON.stringify({ status }) }
  );
  return optimizationHypothesisSchema.parse(await res.json());
}
