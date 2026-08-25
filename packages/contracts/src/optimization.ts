import { z } from "zod";

import { orgIdSchema, ulidSchema } from "./common.js";

/** `product/vision.md` §Optimization Loop: proposed by the Optimization Agent, a human always
 * decides what happens next — nothing here auto-publishes. */
export const optimizationHypothesisStatusValues = [
  "proposed",
  "approved",
  "rejected"
] as const;
export const optimizationHypothesisStatusSchema = z.enum(
  optimizationHypothesisStatusValues
);
export type OptimizationHypothesisStatus = z.infer<
  typeof optimizationHypothesisStatusSchema
>;

export const optimizationHypothesisSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  landingPageId: ulidSchema,
  hypothesis: z.string(),
  rationale: z.string(),
  evidenceRefs: z.array(z.string()).default([]),
  expectedImpact: z.string(),
  status: optimizationHypothesisStatusSchema,
  reviewedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
});
export type OptimizationHypothesis = z.infer<
  typeof optimizationHypothesisSchema
>;

/** Model output for `POST /:id/optimization` — validated then persisted 1 row per hypothesis. */
export const generatedHypothesisSchema = z.object({
  hypothesis: z.string().min(1),
  rationale: z.string().min(1),
  evidenceRefs: z.array(z.string()).default([]),
  expectedImpact: z.string().min(1)
});
export const generateOptimizationHypothesesResultSchema = z.object({
  hypotheses: z.array(generatedHypothesisSchema).min(1)
});

export const reviewOptimizationHypothesisInputSchema = z.object({
  status: z.enum(["approved", "rejected"])
});
