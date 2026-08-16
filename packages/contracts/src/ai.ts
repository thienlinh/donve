import { z } from "zod";

import { orgIdSchema, timestampsSchema, ulidSchema } from "./common.js";

export const aiProviderValues = [
  "anthropic",
  "openai",
  "openrouter",
  "platform",
] as const;
export const aiProviderSchema = z.enum(aiProviderValues);
export type AiProvider = z.infer<typeof aiProviderSchema>;

export const aiConnectionStatusValues = ["active", "invalid"] as const;
export const aiConnectionStatusSchema = z.enum(aiConnectionStatusValues);
export type AiConnectionStatus = z.infer<typeof aiConnectionStatusSchema>;

export const aiConnectionSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  provider: aiProviderSchema,
  /** null when provider=platform. */
  encryptedKey: z.string().nullable(),
  keyLast4: z.string().nullable(),
  defaultModel: z.string(),
  isDefault: z.boolean().default(false),
  status: aiConnectionStatusSchema.default("active"),
  createdAt: z.coerce.date(),
});
export type AiConnection = z.infer<typeof aiConnectionSchema>;

/** aiUsage.context — e.g. pageId, sessionId, kept loose since callers vary. */
export const aiUsageContextSchema = z
  .object({
    pageId: z.string().optional(),
    sessionId: z.string().optional(),
  })
  .catchall(z.unknown())
  .default({});
export type AiUsageContext = z.infer<typeof aiUsageContextSchema>;

export const aiUsageSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  connectionId: ulidSchema,
  model: z.string(),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  creditCost: z.number().int().nonnegative().default(0),
  context: aiUsageContextSchema,
  createdAt: z.coerce.date(),
});
export type AiUsage = z.infer<typeof aiUsageSchema>;

export const skillSchema = z.object({
  id: ulidSchema,
  /** null = platform skill (read-only for tenants). */
  orgId: orgIdSchema.nullable(),
  slug: z.string(),
  name: z.string().min(1),
  content: z.string(),
  version: z.number().int().positive().default(1),
  isActiveDefault: z.boolean().default(false),
  ...timestampsSchema.shape,
});
export type Skill = z.infer<typeof skillSchema>;

const promptTemplateSectionSchema = z
  .object({
    key: z.string(),
    content: z.string(),
  })
  .catchall(z.unknown());

const promptTemplateVariableSchema = z
  .object({
    key: z.string(),
    label: z.string().optional(),
    required: z.boolean().optional(),
  })
  .catchall(z.unknown());

export const promptTemplateSchema = z.object({
  id: ulidSchema,
  /** null = platform-wide template. */
  orgId: orgIdSchema.nullable(),
  slug: z.string(),
  sections: z.array(promptTemplateSectionSchema).default([]),
  variables: z.array(promptTemplateVariableSchema).default([]),
  version: z.number().int().positive().default(1),
  ...timestampsSchema.shape,
});
export type PromptTemplate = z.infer<typeof promptTemplateSchema>;

/** join table: which skills are enabled on a given landing page. */
export const landingSkillSchema = z.object({
  orgId: orgIdSchema,
  landingPageId: ulidSchema,
  skillId: ulidSchema,
});
export type LandingSkill = z.infer<typeof landingSkillSchema>;
