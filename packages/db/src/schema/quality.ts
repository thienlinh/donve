import { integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationPolicy, platformReadPolicy } from "./rls.js";

/**
 * `quality/quality-spec.md` §Tầng 3 — one run per audit call, `categoryScores` holds the
 * per-category rollup (`overall_score` = weighted sum, computed the same way both server and
 * client can via `@dv/contracts`'s `computeOverallScore`). "Engine giữ raw rule-level result —
 * weighted score chỉ là bản tóm tắt": the score is a summary, `auditFindings` is the real data.
 */
export const auditRuns = pgTable(
  "audit_runs",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    landingPageId: uuid("landing_page_id").notNull(),
    pageVersionId: uuid("page_version_id").notNull(),
    overallScore: integer("overall_score").notNull(),
    categoryScores: jsonb("category_scores").notNull().default({}),
    createdAt: timestamps.createdAt
  },
  () => [orgIsolationPolicy(), platformReadPolicy()]
).enableRLS();

export const auditFindings = pgTable(
  "audit_findings",
  {
    id: id(),
    orgId: uuid("org_id").notNull(),
    auditRunId: uuid("audit_run_id").notNull(),
    category: text("category").notNull(),
    severity: text("severity", {
      enum: ["critical", "high", "medium", "low"]
    }).notNull(),
    message: text("message").notNull(),
    /** `PageSpec.elements` key the finding is about, if any (page-level findings have none). */
    elementId: text("element_id"),
    createdAt: timestamps.createdAt
  },
  () => [orgIsolationPolicy(), platformReadPolicy()]
).enableRLS();
