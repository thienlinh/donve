import {
  assignmentRulesRepository,
  leadActivitiesRepository,
  leadsRepository,
  schema,
  type Db
} from "@dv/db";

import { log } from "../../lib/logger.js";

export type AssignmentRule = typeof schema.assignmentRules.$inferSelect;
export type Lead = typeof schema.leads.$inferSelect;

/** Exported so the SLA-breach sweep (`lib/lead-sla-sweep.ts`) evaluates "does this rule apply to
 * this lead" with the exact same campaign/persona matching `routeLead` uses for new leads —
 * one rule-matching definition, not two that could quietly drift apart. */
export function ruleMatches(rule: AssignmentRule, lead: Lead): boolean {
  if (rule.matchCampaignId && rule.matchCampaignId !== lead.campaignId) {
    return false;
  }
  if (rule.matchPersona && rule.matchPersona !== lead.persona) return false;
  return true;
}

/** Applies one matched rule's strategy — an empty pool (or a rule with no usable target)
 * leaves the lead unassigned rather than throwing, per FR-E routing spec. */
async function pickAssignee(
  db: Db,
  orgId: string,
  rule: AssignmentRule
): Promise<string | null> {
  const pool = rule.assigneePoolIds ?? [];

  switch (rule.strategy) {
    case "fixed_assignee":
      return rule.fixedAssigneeId ?? null;

    case "round_robin": {
      if (pool.length === 0) return null;
      const index = rule.lastAssignedIndex % pool.length;
      await assignmentRulesRepository.update(db, orgId, rule.id, {
        lastAssignedIndex: rule.lastAssignedIndex + 1
      });
      return pool[index] ?? null;
    }

    case "least_active_leads": {
      if (pool.length === 0) return null;
      const openCounts = await leadsRepository.countOpenLeadsByAssignee(
        db,
        orgId,
        pool
      );
      return pool.reduce((best, candidate) =>
        (openCounts.get(candidate) ?? 0) < (openCounts.get(best) ?? 0)
          ? candidate
          : best
      );
    }

    default:
      return null;
  }
}

/**
 * FR-E auto-assignment routing engine — call once, right after `findOrCreateLead` inserts a
 * genuinely new lead (never on a resubmit/dedupe merge). Evaluates the org's `assignmentRules`
 * top-to-bottom by priority, applies the first match's strategy, and logs a `system` activity
 * when an assignee is actually set.
 *
 * Never throws: bad rule data, an empty pool, or a DB hiccup here must not undo the lead that
 * was already committed — every failure is caught and logged instead of propagating.
 *
 * ponytail: if `findOrCreateLead` already set `assigneeId` via the campaign-level
 * `assignmentMode: "round_robin"` (packages/db campaigns table, pre-existing), this engine
 * defers to it and no-ops — the two assignment mechanisms aren't meant to fight over the same
 * lead. Add an explicit precedence rule if a campaign ever needs both at once.
 */
export async function routeLead(
  db: Db,
  orgId: string,
  lead: Lead
): Promise<void> {
  if (lead.assigneeId) return;

  try {
    const rules = await assignmentRulesRepository.listActive(db, orgId);
    const rule = rules.find((candidate) => ruleMatches(candidate, lead));
    if (!rule) return;

    const assigneeId = await pickAssignee(db, orgId, rule);
    if (!assigneeId) return;

    await leadsRepository.update(db, orgId, lead.id, { assigneeId });
    await leadActivitiesRepository.insert(db, orgId, {
      leadId: lead.id,
      type: "system",
      body: `Tự động gán cho ${assigneeId}`,
      meta: { kind: "assignment", from: null, to: assigneeId, ruleId: rule.id },
      actorId: null
    });
  } catch (err) {
    log("error", {
      requestId: "lead-routing",
      orgId,
      message: "auto-assignment routing failed",
      leadId: lead.id,
      error: err instanceof Error ? err.message : String(err)
    });
  }
}
