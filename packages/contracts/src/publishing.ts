import { z } from "zod";

import { orgIdSchema, idSchema } from "./common.js";

export const deploymentStatusValues = [
  "building",
  "live",
  "superseded",
  "failed",
  "unpublished"
] as const;
export const deploymentStatusSchema = z.enum(deploymentStatusValues);
export type DeploymentStatus = z.infer<typeof deploymentStatusSchema>;

/** deployments.meta — e.g. lighthouse score, output size. */
export const deploymentMetaSchema = z
  .object({
    lighthouseScore: z.number().min(0).max(100).optional(),
    sizeBytes: z.number().int().nonnegative().optional()
  })
  .catchall(z.unknown())
  .default({});
export type DeploymentMeta = z.infer<typeof deploymentMetaSchema>;

export const deploymentSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  pageVersionId: idSchema,
  hostname: z.string(),
  status: deploymentStatusSchema,
  r2Prefix: z.string(),
  meta: deploymentMetaSchema,
  createdAt: z.coerce.date()
});
export type Deployment = z.infer<typeof deploymentSchema>;

export const customDomainStatusValues = [
  "pending",
  "active",
  "failed"
] as const;
export const customDomainStatusSchema = z.enum(customDomainStatusValues);
export type CustomDomainStatus = z.infer<typeof customDomainStatusSchema>;

/** Cloudflare for SaaS's DCV instructions, shown as-is so the tenant knows exactly what DNS
 * record to add — `cnameTarget` is the platform's fixed fallback origin (same for every
 * tenant); `ownershipVerification` is per-hostname, returned only while still pending. */
export const customDomainVerificationSchema = z
  .object({
    cnameTarget: z.string().optional(),
    ownershipVerification: z
      .object({ type: z.string(), name: z.string(), value: z.string() })
      .optional(),
    sslStatus: z.string().optional()
  })
  .catchall(z.unknown())
  .default({});
export type CustomDomainVerification = z.infer<
  typeof customDomainVerificationSchema
>;

export const customDomainSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  hostname: z.string(),
  status: customDomainStatusSchema,
  /** Cloudflare for SaaS custom hostname id. */
  cfHostnameId: z.string().nullable(),
  verification: customDomainVerificationSchema,
  createdAt: z.coerce.date()
});
export type CustomDomain = z.infer<typeof customDomainSchema>;

// Same lowercase-hostname shape as a subdomain claim, minus the reserved-word/length rules
// that only make sense for a platform-issued subdomain — a custom domain is the tenant's own.
export const createCustomDomainInputSchema = z.object({
  hostname: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(253)
    .regex(
      /^(?=.{3,253}$)([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/,
      "Enter a valid domain, e.g. shop.yourbrand.com"
    ),
  landingPageId: idSchema
});
export type CreateCustomDomainInput = z.infer<
  typeof createCustomDomainInputSchema
>;

export const publishOutboxStatusValues = [
  "pending",
  "applied",
  "failed"
] as const;
export const publishOutboxStatusSchema = z.enum(publishOutboxStatusValues);
export type PublishOutboxStatus = z.infer<typeof publishOutboxStatusSchema>;

// Reserved so a tenant can't claim infra-looking subdomains (architecture.md §7 "subdomain
// takeover / trùng"). Same host string used in wrangler/env vars — kept in sync by hand.
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "staging",
  "mail",
  "smtp",
  "pop",
  "imap",
  "ftp",
  "cdn",
  "static",
  "assets",
  "blog",
  "app",
  "dev",
  "test",
  "ns1",
  "ns2",
  "mx",
  "autodiscover",
  "root",
  "support",
  "status",
  "docs"
]);

export const publishLandingPageInputSchema = z.object({
  subdomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(63)
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Subdomain must be lowercase letters, digits, hyphens; no leading/trailing hyphen"
    )
    .refine((v) => !RESERVED_SUBDOMAINS.has(v), "Subdomain is reserved")
});
export type PublishLandingPageInput = z.infer<
  typeof publishLandingPageInputSchema
>;

export const publishOutboxSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  deploymentId: idSchema,
  hostname: z.string(),
  /** deployment this hostname should point to once applied (publish or rollback). */
  targetDeployId: idSchema,
  status: publishOutboxStatusSchema.default("pending"),
  createdAt: z.coerce.date(),
  appliedAt: z.coerce.date().nullable()
});
export type PublishOutbox = z.infer<typeof publishOutboxSchema>;
