import { z } from "zod";

import { orgIdSchema, timestampsSchema, idSchema } from "./common.js";

/**
 * `strategy/strategy-brief.md` §Business Knowledge Graph — every extracted finding is tagged
 * fact/inference/unknown, "3 loại này không trộn lẫn khi hiển thị cho user".
 */
export const knowledgeStatusValues = ["fact", "inference", "unknown"] as const;
export const knowledgeStatusSchema = z.enum(knowledgeStatusValues);
export type KnowledgeStatus = z.infer<typeof knowledgeStatusSchema>;

export const knowledgeItemSchema = z.object({
  label: z.string(),
  value: z.string(),
  status: knowledgeStatusSchema,
  /** Where this came from — a URL, "brief", a filename. Required for `status: "fact"`. */
  sourceRef: z.string().optional()
});
export type KnowledgeItem = z.infer<typeof knowledgeItemSchema>;

export const businessProfileSourceSchema = z.object({
  kind: z.enum(["brief", "url", "competitor_url"]),
  value: z.string()
});
export type BusinessProfileSource = z.infer<typeof businessProfileSourceSchema>;

export const businessProfileSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  product: z.array(knowledgeItemSchema),
  customer: z.array(knowledgeItemSchema),
  market: z.array(knowledgeItemSchema),
  sources: z.array(businessProfileSourceSchema),
  ...timestampsSchema.shape
});
export type BusinessProfile = z.infer<typeof businessProfileSchema>;

/** `POST /api/landings/:id/business` — Research Agent input (page-system's "nguồn" list). */
export const generateBusinessProfileInputSchema = z.object({
  brief: z.string().trim().min(1).max(8000),
  urls: z.array(z.string()).max(5).default([])
});
export type GenerateBusinessProfileInput = z.infer<
  typeof generateBusinessProfileInputSchema
>;

export const updateBusinessProfileInputSchema = z.object({
  product: z.array(knowledgeItemSchema),
  customer: z.array(knowledgeItemSchema),
  market: z.array(knowledgeItemSchema)
});
export type UpdateBusinessProfileInput = z.infer<
  typeof updateBusinessProfileInputSchema
>;

// --- Strategy Brief (strategy/strategy-brief.md) ---

export const strategyBusinessSchema = z.object({
  product: z.string().optional(),
  category: z.string().optional(),
  businessModel: z.string().optional(),
  pricingModel: z.string().optional(),
  marginNotes: z.string().optional(),
  geoScope: z.string().optional()
});

export const strategyCustomerSchema = z.object({
  icp: z.string().optional(),
  buyerRole: z.string().optional(),
  userRole: z.string().optional(),
  awarenessLevel: z.string().optional(),
  jobsToBeDone: z.array(z.string()).default([]),
  painPoints: z.array(z.string()).default([]),
  desiredOutcomes: z.array(z.string()).default([]),
  objections: z.array(z.string()).default([]),
  triggers: z.array(z.string()).default([])
});

export const strategyMarketSchema = z.object({
  categoryLanguage: z.string().optional(),
  alternatives: z.array(z.string()).default([]),
  competitors: z.array(z.string()).default([]),
  differentiators: z.array(z.string()).default([]),
  proofAvailability: z.string().optional()
});

export const strategyFunnelSchema = z.object({
  trafficSource: z.string().optional(),
  awarenessStage: z.string().optional(),
  intentLevel: z.string().optional(),
  conversionGoal: z.string().optional(),
  conversionWindow: z.string().optional(),
  qualificationRules: z.string().optional()
});

export const strategyOfferSchema = z.object({
  coreOffer: z.string().optional(),
  bonuses: z.array(z.string()).default([]),
  guarantee: z.string().optional(),
  pricing: z.string().optional(),
  urgencyPolicy: z.string().optional(),
  riskReversal: z.string().optional()
});

/** Every claim carries `evidenceRef` — "không để trống khi generate proof section". */
export const strategyClaimSchema = z.object({
  claim: z.string(),
  evidenceRef: z.string()
});

export const strategyMessageSchema = z.object({
  valueProposition: z.string().optional(),
  corePromise: z.string().optional(),
  supportingClaims: z.array(strategyClaimSchema).default([]),
  objectionHandling: z.array(z.string()).default([]),
  primaryCta: z.string().optional(),
  secondaryCta: z.string().optional()
});

export const strategyBriefSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  business: strategyBusinessSchema,
  customer: strategyCustomerSchema,
  market: strategyMarketSchema,
  funnel: strategyFunnelSchema,
  offer: strategyOfferSchema,
  message: strategyMessageSchema,
  confirmedAt: z.coerce.date().nullable(),
  confirmedBy: idSchema.nullable(),
  ...timestampsSchema.shape
});
export type StrategyBrief = z.infer<typeof strategyBriefSchema>;

/** Editable body — everything except id/orgId/landingPageId/confirm/timestamps. */
export const updateStrategyBriefInputSchema = z.object({
  business: strategyBusinessSchema,
  customer: strategyCustomerSchema,
  market: strategyMarketSchema,
  funnel: strategyFunnelSchema,
  offer: strategyOfferSchema,
  message: strategyMessageSchema
});
export type UpdateStrategyBriefInput = z.infer<
  typeof updateStrategyBriefInputSchema
>;
