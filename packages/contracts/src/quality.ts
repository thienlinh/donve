import { z } from "zod";

import { orgIdSchema, idSchema } from "./common.js";

/** `quality/quality-spec.md` §Tầng 3 — the 8 category weights, summing to 100. */
export const auditCategoryValues = [
  "strategy_alignment",
  "messaging_copy",
  "page_structure",
  "seo",
  "performance",
  "tracking_completeness",
  "token_consistency",
  "visual_regression"
] as const;
export const auditCategorySchema = z.enum(auditCategoryValues);
export type AuditCategory = z.infer<typeof auditCategorySchema>;

export const AUDIT_CATEGORY_WEIGHTS: Record<AuditCategory, number> = {
  strategy_alignment: 15,
  messaging_copy: 15,
  page_structure: 15,
  seo: 15,
  performance: 15,
  tracking_completeness: 10,
  token_consistency: 5,
  visual_regression: 10
};

export const auditSeverityValues = [
  "critical",
  "high",
  "medium",
  "low"
] as const;
export const auditSeveritySchema = z.enum(auditSeverityValues);
export type AuditSeverity = z.infer<typeof auditSeveritySchema>;

/** "Engine giữ raw rule-level result — weighted score chỉ là bản tóm tắt": deducted per finding
 * from a 100 base, not derived from some finer-grained sub-metric. Same formula for every
 * category, rule-based or LLM-based, so there's one place to tune severity weight. */
const SEVERITY_DEDUCTION: Record<AuditSeverity, number> = {
  critical: 40,
  high: 20,
  medium: 10,
  low: 5
};

export const auditFindingSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  auditRunId: idSchema,
  category: auditCategorySchema,
  severity: auditSeveritySchema,
  message: z.string(),
  elementId: z.string().nullable(),
  createdAt: z.coerce.date()
});
export type AuditFinding = z.infer<typeof auditFindingSchema>;

// Audit runs are append-only (never updated after creation) — `createdAt` only, not the full
// `timestampsSchema` (which also has `updatedAt`, meaningless here).
export const auditRunSchema = z.object({
  id: idSchema,
  orgId: orgIdSchema,
  landingPageId: idSchema,
  pageVersionId: idSchema,
  overallScore: z.number().int().min(0).max(100),
  categoryScores: z.record(auditCategorySchema, z.number()),
  createdAt: z.coerce.date()
});
export type AuditRun = z.infer<typeof auditRunSchema>;

export const auditResultSchema = auditRunSchema.extend({
  findings: z.array(auditFindingSchema)
});
export type AuditResult = z.infer<typeof auditResultSchema>;

/** One category's score from its own findings — 100 minus each finding's severity deduction,
 * floored at 0. A category with 0 findings scores 100. */
export function computeCategoryScore(
  findings: { severity: AuditSeverity }[]
): number {
  const deduction = findings.reduce(
    (sum, f) => sum + SEVERITY_DEDUCTION[f.severity],
    0
  );
  return Math.max(0, 100 - deduction);
}

/** Weighted sum of every category's score (`AUDIT_CATEGORY_WEIGHTS` sums to 100, so this is
 * already a 0-100 overall score). */
export function computeOverallScore(
  categoryScores: Partial<Record<AuditCategory, number>>
): number {
  let total = 0;
  for (const category of auditCategoryValues) {
    const score = categoryScores[category] ?? 100;
    total += (score * AUDIT_CATEGORY_WEIGHTS[category]) / 100;
  }
  return Math.round(total);
}

/** `ai/agent-pipeline.md` §Self-critique loop — why the Auto Fixer loop stopped. */
export const autoFixStopReasonValues = [
  "threshold",
  "plateau",
  "max_iterations",
  "no_actionable_findings"
] as const;
export const autoFixStopReasonSchema = z.enum(autoFixStopReasonValues);
export type AutoFixStopReason = z.infer<typeof autoFixStopReasonSchema>;

export const autoFixResultSchema = z.object({
  iterations: z.number().int().min(0),
  stopReason: autoFixStopReasonSchema,
  audit: auditResultSchema
});
export type AutoFixResult = z.infer<typeof autoFixResultSchema>;

/** `quality/quality-spec.md` §Launch threshold: "Overall ≥ 90, không còn finding critical.
 * SEO ≥ 85, Performance đạt ngưỡng CWV cấu hình, Tracking completeness = 100%." (CWV threshold
 * itself is a later, config-driven refinement — this checks the category score proxy for now.) */
export function passesLaunchThreshold(run: AuditResult): {
  ok: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (run.overallScore < 90) reasons.push("overall_score_below_90");
  if (run.findings.some((f) => f.severity === "critical")) {
    reasons.push("has_critical_finding");
  }
  if ((run.categoryScores.seo ?? 100) < 85) reasons.push("seo_below_85");
  if ((run.categoryScores.tracking_completeness ?? 100) < 100) {
    reasons.push("tracking_incomplete");
  }
  return { ok: reasons.length === 0, reasons };
}
