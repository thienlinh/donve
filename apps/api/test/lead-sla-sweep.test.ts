import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `runLeadSlaSweep` (apps/api/src/lib/lead-sla-sweep.ts) runs every 30 minutes — the critical
 * property to prove is idempotency: a lead that's still breaching 3 sweeps in a row must be
 * acted on exactly once, not every single sweep, until something resets its clock (a fresh
 * assignment). Mocking `@dv/db` the same way lead-routing.test.ts does, no live DB needed.
 */
const state = vi.hoisted(() => ({
  orgs: [{ id: "org1", name: "Org One" }] as { id: string; name: string }[],
  rules: [] as Record<string, unknown>[],
  leads: [] as Record<string, unknown>[],
  activitiesByLead: new Map<string, Record<string, unknown>[]>(),
  leadUpdates: [] as { id: string; values: Record<string, unknown> }[],
  insertedActivities: [] as Record<string, unknown>[]
}));

vi.mock("@dv/db", () => ({
  organizationsRepository: {
    listAll: vi.fn(async () => state.orgs)
  },
  assignmentRulesRepository: {
    listActive: vi.fn(async () => state.rules)
  },
  // notify_manager's org-owner lookup (lead-sla-sweep.ts -> lib/user-email.ts) — no org has an
  // owner in this test, so `resolveOwnerEmail` short-circuits to null before ever touching
  // `schema.user`/`db.raw`, meaning the email push is skipped (`canSend` sees no email) without
  // needing a `schema` mock here.
  membershipsRepository: {
    listByRole: vi.fn(async () => [])
  },
  leadsRepository: {
    listOpenAssigned: vi.fn(async () => state.leads),
    update: vi.fn(
      async (
        _db: unknown,
        _orgId: string,
        id: string,
        values: Record<string, unknown>
      ) => {
        state.leadUpdates.push({ id, values });
        const lead = state.leads.find((l) => l.id === id);
        if (lead) Object.assign(lead, values);
        return lead;
      }
    )
  },
  leadActivitiesRepository: {
    listForLead: vi.fn(
      async (_db: unknown, _orgId: string, leadId: string) =>
        state.activitiesByLead.get(leadId) ?? []
    ),
    insert: vi.fn(
      async (_db: unknown, _orgId: string, values: Record<string, unknown>) => {
        state.insertedActivities.push(values);
        const leadId = values.leadId as string;
        const existing = state.activitiesByLead.get(leadId) ?? [];
        // newest-first, matching the real repository's `orderBy(desc(createdAt))`
        state.activitiesByLead.set(leadId, [values, ...existing]);
        return values;
      }
    )
  }
}));

vi.mock("../src/lib/db.js", () => ({
  createDbFromEnv: vi.fn(() => ({}))
}));

const { runLeadSlaSweep } = await import("../src/lib/lead-sla-sweep.js");

function baseLead(overrides: Record<string, unknown> = {}) {
  return {
    id: "lead1",
    orgId: "org1",
    campaignId: "camp1",
    persona: null,
    assigneeId: "u1",
    hoursSinceActivity: 100,
    ...overrides
  };
}

function baseRule(overrides: Record<string, unknown> = {}) {
  return {
    id: "rule1",
    orgId: "org1",
    matchCampaignId: null,
    matchPersona: null,
    slaHours: 24,
    onSlaBreach: "reassign_next_in_pool",
    assigneePoolIds: ["u1", "u2", "u3"],
    ...overrides
  };
}

describe("runLeadSlaSweep", () => {
  beforeEach(() => {
    state.rules.length = 0;
    state.leads.length = 0;
    state.activitiesByLead.clear();
    state.leadUpdates.length = 0;
    state.insertedActivities.length = 0;
  });

  it("reassigns a breaching lead to the next pool member and logs it", async () => {
    state.rules.push(baseRule());
    state.leads.push(baseLead());

    const result = await runLeadSlaSweep({} as never);

    expect(result.leadsBreached).toBe(1);
    expect(state.leadUpdates).toEqual([
      { id: "lead1", values: { assigneeId: "u2" } }
    ]);
    expect(state.insertedActivities).toHaveLength(1);
    const inserted = state.insertedActivities[0];
    expect((inserted?.meta as { kind: string } | undefined)?.kind).toBe(
      "sla_breach"
    );
  });

  it("idempotent: a second sweep on the same still-breaching lead is a no-op", async () => {
    state.rules.push(baseRule());
    state.leads.push(baseLead());

    await runLeadSlaSweep({} as never);
    state.leadUpdates.length = 0; // clear to isolate the second sweep's effect

    // Second sweep sees the lead now assigned to u2 (from the first sweep's reassignment),
    // with the "sla_breach" activity still the newest marker for it.
    const second = await runLeadSlaSweep({} as never);

    expect(second.leadsBreached).toBe(0);
    expect(state.leadUpdates).toHaveLength(0);
  });

  it("can breach again after a fresh assignment resets the clock", async () => {
    state.rules.push(baseRule());
    state.leads.push(baseLead());
    await runLeadSlaSweep({} as never);
    state.leadUpdates.length = 0;

    // Someone manually reassigns the lead — a new "assignment" marker newer than the
    // "sla_breach" one, which must re-open the SLA clock.
    state.activitiesByLead.set("lead1", [
      { leadId: "lead1", meta: { kind: "assignment" } },
      ...(state.activitiesByLead.get("lead1") ?? [])
    ]);
    if (state.leads[0]) state.leads[0].hoursSinceActivity = 999;

    const third = await runLeadSlaSweep({} as never);
    expect(third.leadsBreached).toBe(1);
  });

  it("does not touch leads under a rule with no slaHours configured", async () => {
    state.rules.push(baseRule({ slaHours: null }));
    state.leads.push(baseLead());

    const result = await runLeadSlaSweep({} as never);
    expect(result.leadsBreached).toBe(0);
    expect(state.leadUpdates).toHaveLength(0);
  });

  it("does not touch leads that haven't exceeded slaHours yet", async () => {
    state.rules.push(baseRule({ slaHours: 200 }));
    state.leads.push(baseLead({ hoursSinceActivity: 5 }));

    const result = await runLeadSlaSweep({} as never);
    expect(result.leadsBreached).toBe(0);
  });

  it("notify_manager logs an activity but does not reassign", async () => {
    state.rules.push(baseRule({ onSlaBreach: "notify_manager" }));
    state.leads.push(baseLead());

    const result = await runLeadSlaSweep({} as never);
    expect(result.leadsBreached).toBe(1);
    expect(state.leadUpdates).toHaveLength(0);
    expect(state.insertedActivities).toHaveLength(1);
  });
});
