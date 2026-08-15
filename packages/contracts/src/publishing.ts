import { z } from "zod"

import { orgIdSchema, ulidSchema } from "./common.js"

export const deploymentStatusValues = [
  "building",
  "live",
  "superseded",
  "failed",
  "unpublished",
] as const
export const deploymentStatusSchema = z.enum(deploymentStatusValues)
export type DeploymentStatus = z.infer<typeof deploymentStatusSchema>

/** deployments.meta — e.g. lighthouse score, output size. */
export const deploymentMetaSchema = z
  .object({
    lighthouseScore: z.number().min(0).max(100).optional(),
    sizeBytes: z.number().int().nonnegative().optional(),
  })
  .catchall(z.unknown())
  .default({})
export type DeploymentMeta = z.infer<typeof deploymentMetaSchema>

export const deploymentSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  landingPageId: ulidSchema,
  pageVersionId: ulidSchema,
  hostname: z.string(),
  status: deploymentStatusSchema,
  r2Prefix: z.string(),
  meta: deploymentMetaSchema,
  createdAt: z.coerce.date(),
})
export type Deployment = z.infer<typeof deploymentSchema>

export const customDomainStatusValues = ["pending", "active", "failed"] as const
export const customDomainStatusSchema = z.enum(customDomainStatusValues)
export type CustomDomainStatus = z.infer<typeof customDomainStatusSchema>

export const customDomainSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  hostname: z.string(),
  status: customDomainStatusSchema,
  /** Cloudflare for SaaS custom hostname id. */
  cfHostnameId: z.string().nullable(),
  createdAt: z.coerce.date(),
})
export type CustomDomain = z.infer<typeof customDomainSchema>

export const publishOutboxStatusValues = [
  "pending",
  "applied",
  "failed",
] as const
export const publishOutboxStatusSchema = z.enum(publishOutboxStatusValues)
export type PublishOutboxStatus = z.infer<typeof publishOutboxStatusSchema>

export const publishOutboxSchema = z.object({
  id: ulidSchema,
  orgId: orgIdSchema,
  deploymentId: ulidSchema,
  hostname: z.string(),
  /** deployment this hostname should point to once applied (publish or rollback). */
  targetDeployId: ulidSchema,
  status: publishOutboxStatusSchema.default("pending"),
  createdAt: z.coerce.date(),
  appliedAt: z.coerce.date().nullable(),
})
export type PublishOutbox = z.infer<typeof publishOutboxSchema>
