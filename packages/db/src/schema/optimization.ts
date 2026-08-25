import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

/**
 * `product/vision.md` §Optimization Loop / `ai/agent-pipeline.md` §Agent roles — "Optimization
 * Agent đọc analytics + audit history, đề xuất hypothesis, cần approval, không tự publish."
 * `status` starts `proposed`; a human flips it to `approved`/`rejected` (`PATCH
 * /:id/optimization/:hypothesisId`) — nothing in this feature ever auto-publishes off one.
 */
export const optimizationHypotheses = pgTable("optimization_hypotheses", {
  id: id(),
  orgId: text("org_id").notNull(),
  landingPageId: text("landing_page_id").notNull(),
  hypothesis: text("hypothesis").notNull(),
  rationale: text("rationale").notNull(),
  /** Free-text pointers into the analytics/audit facts the hypothesis is based on (e.g.
   * "cta_clicked: 4% of page_viewed (30d)", "audit run 01AB…: seo score 62") — not a foreign
   * key, since evidence can span several rows/tables. */
  evidenceRefs: jsonb("evidence_refs").$type<string[]>().default([]),
  expectedImpact: text("expected_impact").notNull(),
  status: text("status", {
    enum: ["proposed", "approved", "rejected"]
  })
    .notNull()
    .default("proposed"),
  reviewedBy: text("reviewed_by"),
  ...timestamps
});
