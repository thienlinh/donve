import { z } from "zod";

import { orgIdSchema, timestampsSchema, idSchema } from "./common.js";

export const aiProviderValues = [
  "anthropic",
  "openai",
  "openrouter",
  "groq",
  "nvidia",
  "platform"
] as const;
export const aiProviderSchema = z.enum(aiProviderValues);
export type AiProvider = z.infer<typeof aiProviderSchema>;

export const aiConnectionStatusValues = ["active", "invalid"] as const;
export const aiConnectionStatusSchema = z.enum(aiConnectionStatusValues);
export type AiConnectionStatus = z.infer<typeof aiConnectionStatusSchema>;

/**
 * Internal DB-row shape — includes `encryptedKey`. For anything an API route returns,
 * use `publicAiConnectionSchema` instead: architecture.md's threat model for this table
 * is explicit that no response should ever contain the key, encrypted or not.
 */
export const aiConnectionSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  provider: aiProviderSchema,
  /** null when provider=platform. */
  encryptedKey: z.string().nullable(),
  keyLast4: z.string().nullable(),
  defaultModel: z.string(),
  isDefault: z.boolean().default(false),
  status: aiConnectionStatusSchema.default("active"),
  createdAt: z.coerce.date()
});
export type AiConnection = z.infer<typeof aiConnectionSchema>;

/** What API routes should actually serialize — never `encryptedKey`. */
export const publicAiConnectionSchema = aiConnectionSchema.omit({
  encryptedKey: true
});
export type PublicAiConnection = z.infer<typeof publicAiConnectionSchema>;

/** aiUsage.context — e.g. pageId, sessionId, kept loose since callers vary. */
export const aiUsageContextSchema = z
  .object({
    pageId: z.string().optional(),
    sessionId: z.string().optional()
  })
  .catchall(z.unknown())
  .default({});
export type AiUsageContext = z.infer<typeof aiUsageContextSchema>;

export const aiUsageSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  connectionId: idSchema,
  model: z.string(),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  creditCost: z.number().int().nonnegative().default(0),
  context: aiUsageContextSchema,
  createdAt: z.coerce.date()
});
export type AiUsage = z.infer<typeof aiUsageSchema>;

/** BYOK providers only — "platform"/"workers-ai" are routing modes, never a connection a tenant creates. */
export const byokProviderValues = [
  "anthropic",
  "openai",
  "openrouter",
  "groq",
  "nvidia"
] as const;
export const byokProviderSchema = z.enum(byokProviderValues);
export type ByokProvider = z.infer<typeof byokProviderSchema>;

/** POST /api/ai/connections body (FR-H-01) — the key is validated server-side before storage. */
export const connectAiConnectionSchema = z.object({
  provider: byokProviderSchema,
  apiKey: z.string().min(1),
  defaultModel: z.string().min(1)
});
export type ConnectAiConnectionInput = z.infer<
  typeof connectAiConnectionSchema
>;

/**
 * POST /api/ai/connections/models body — probes the provider's own `/models` endpoint with
 * the key the user just typed, before they've committed to connecting it. Same shape as
 * `connectAiConnectionSchema` minus `defaultModel` (that's what this call is choosing).
 * `apiKey` is optional because OpenRouter's and NVIDIA NIM's model catalogs are public
 * (verified: both return 200 with no Authorization header at all) — the dashboard fetches
 * those the moment the provider is picked, before the user has typed any key.
 */
export const listAiModelsSchema = z.object({
  provider: byokProviderSchema,
  apiKey: z.string().optional()
});
export type ListAiModelsInput = z.infer<typeof listAiModelsSchema>;

/** A short, non-fabricated hint (pricing/context for OpenRouter, `owned_by` for Groq/NVIDIA,
 * `display_name` for Anthropic) — omitted entirely where the provider's `/models` response
 * doesn't carry anything more useful than the bare id (OpenAI). */
export const aiModelOptionSchema = z.object({
  id: z.string(),
  description: z.string().optional()
});
export type AiModelOption = z.infer<typeof aiModelOptionSchema>;

export const aiModelsResponseSchema = z.object({
  models: z.array(aiModelOptionSchema)
});
export type AiModelsResponse = z.infer<typeof aiModelsResponseSchema>;

export const updateAiConnectionSchema = z.object({
  defaultModel: z.string().min(1).optional(),
  isDefault: z.boolean().optional()
});
export type UpdateAiConnectionInput = z.infer<typeof updateAiConnectionSchema>;

/** GET /api/ai/usage response (FR-H-02). */
export const aiUsageSummarySchema = z.object({
  aiCreditBalance: z.number().int().nonnegative(),
  trialUsesRemaining: z.number().int().nonnegative(),
  recentUsage: z.array(aiUsageSchema)
});
export type AiUsageSummary = z.infer<typeof aiUsageSummarySchema>;

export const aiUseCaseValues = ["generate", "patch"] as const;
export const aiUseCaseSchema = z.enum(aiUseCaseValues);
export type AiUseCase = z.infer<typeof aiUseCaseSchema>;

const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string()
});

/**
 * POST /api/ai/generate body. `connectionId` is a real `aiConnections.id`, or the literal
 * "platform" (paid-plan usage billed against `aiCreditBalance`), or "trial" (FR-H-05 — no
 * BYOK, no plan required, capped by `trialUsesRemaining`).
 */
export const generateAiRequestSchema = z.object({
  connectionId: z.union([idSchema, z.literal("platform"), z.literal("trial")]),
  useCase: aiUseCaseSchema,
  messages: z.array(chatMessageSchema).min(1)
});
export type GenerateAiRequest = z.infer<typeof generateAiRequestSchema>;

export const generateAiResponseSchema = z.object({
  text: z.string(),
  model: z.string(),
  usage: z.object({
    inputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    creditCost: z.number().int().nonnegative()
  }),
  remaining: z.number().int().nonnegative().optional()
});
export type GenerateAiResponse = z.infer<typeof generateAiResponseSchema>;

export const skillSchema = z.object({
  id: idSchema,
  /** null = platform skill (read-only for tenants). */
  orgId: orgIdSchema.nullable(),
  slug: z.string(),
  name: z.string().min(1),
  content: z.string(),
  version: z.number().int().positive().default(1),
  isActiveDefault: z.boolean().default(false),
  ...timestampsSchema.shape
});
export type Skill = z.infer<typeof skillSchema>;

/** POST /api/ai/skills body — always a tenant-owned skill (`orgId` comes from the session). */
export const createSkillSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  content: z.string()
});
export type CreateSkillInput = z.infer<typeof createSkillSchema>;

export const updateSkillSchema = z.object({
  name: z.string().min(1).optional(),
  content: z.string().optional(),
  isActiveDefault: z.boolean().optional()
});
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;

const promptTemplateSectionSchema = z
  .object({
    key: z.string(),
    content: z.string()
  })
  .catchall(z.unknown());

const promptTemplateVariableSchema = z
  .object({
    key: z.string(),
    label: z.string().optional(),
    required: z.boolean().optional()
  })
  .catchall(z.unknown());

export const promptTemplateSchema = z.object({
  id: idSchema,
  /** null = platform-wide template. */
  orgId: orgIdSchema.nullable(),
  slug: z.string(),
  sections: z.array(promptTemplateSectionSchema).default([]),
  variables: z.array(promptTemplateVariableSchema).default([]),
  version: z.number().int().positive().default(1),
  ...timestampsSchema.shape
});
export type PromptTemplate = z.infer<typeof promptTemplateSchema>;

/** POST /api/ai/prompt-templates body — always a tenant-owned template. */
export const createPromptTemplateSchema = z.object({
  slug: z.string().min(1),
  sections: z.array(promptTemplateSectionSchema).default([]),
  variables: z.array(promptTemplateVariableSchema).default([])
});
export type CreatePromptTemplateInput = z.infer<
  typeof createPromptTemplateSchema
>;

/** PATCH /api/ai/prompt-templates/:id body — `version` bumps automatically on every edit. */
export const updatePromptTemplateSchema = z.object({
  sections: z.array(promptTemplateSectionSchema).optional(),
  variables: z.array(promptTemplateVariableSchema).optional()
});
export type UpdatePromptTemplateInput = z.infer<
  typeof updatePromptTemplateSchema
>;

/** POST /api/ai/prompt-templates/:id/compile body — values for `{{brand}}`/`{{product}}`/`{{tone}}` etc. */
export const compilePromptTemplateSchema = z.object({
  values: z.record(z.string(), z.string()).default({})
});
export type CompilePromptTemplateInput = z.infer<
  typeof compilePromptTemplateSchema
>;

export const compiledPromptSchema = z.object({
  compiled: z.string()
});
export type CompiledPrompt = z.infer<typeof compiledPromptSchema>;

/** One Lighthouse category score, 0-100 (a null category means that audit didn't run/apply). */
const lighthouseScoreSchema = z.object({
  performance: z.number().min(0).max(100).nullable(),
  accessibility: z.number().min(0).max(100).nullable(),
  bestPractices: z.number().min(0).max(100).nullable(),
  seo: z.number().min(0).max(100).nullable()
});
export type LighthouseScore = z.infer<typeof lighthouseScoreSchema>;

/** POST /api/ai/prompt-templates/:id/test-run body (FR-F-04) — same routing as /api/ai/generate. */
export const runPromptTestSchema = z.object({
  connectionId: z.union([idSchema, z.literal("platform"), z.literal("trial")]),
  values: z.record(z.string(), z.string()).default({})
});
export type RunPromptTestInput = z.infer<typeof runPromptTestSchema>;

export const promptTestRunSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  promptTemplateId: idSchema,
  model: z.string(),
  compiledPrompt: z.string(),
  outputHtml: z.string(),
  /** null on a runtime that can't launch a sandboxed Chrome (CF Workers) — Bun/VPS only. */
  lighthouse: lighthouseScoreSchema.nullable(),
  usage: z.object({
    inputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    creditCost: z.number().int().nonnegative()
  }),
  createdAt: z.coerce.date()
});
export type PromptTestRun = z.infer<typeof promptTestRunSchema>;

/** join table: which skills are enabled on a given landing page. */
export const landingSkillSchema = z.object({
  orgId: orgIdSchema,
  landingPageId: idSchema,
  skillId: idSchema
});
export type LandingSkill = z.infer<typeof landingSkillSchema>;

/**
 * GET /api/ai/landings/:landingPageId/skills — every org skill, annotated with whether it's
 * enabled for THIS landing page (its per-landing override, falling back to `isActiveDefault`).
 */
export const landingSkillOptionSchema = skillSchema.extend({
  enabled: z.boolean()
});
export type LandingSkillOption = z.infer<typeof landingSkillOptionSchema>;

/** PUT /api/ai/landings/:landingPageId/skills/:skillId body. */
export const setLandingSkillSchema = z.object({
  enabled: z.boolean()
});
export type SetLandingSkillInput = z.infer<typeof setLandingSkillSchema>;
