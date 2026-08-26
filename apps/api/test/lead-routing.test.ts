import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `routeLead` (apps/api/src/modules/leads/routing.ts) is pure decision logic wired to the
 * `@dv/db` repositories — mocking those (rather than spinning up a Postgres container like
 * the `*.integration.test.ts` suites) is enough to exercise the round_robin/least_active_leads
 * branches without a live DB.
 */
const state = vi.hoisted(() => ({
  rules: [] as Record<string, unknown>[],
  leadUpdates: [] as { id: string; values: Record<string, unknown> }[],
  activities: [] as Record<string, unknown>[],
  openCounts: new Map<string, number>()
}));

vi.mock("@dv/db", () => ({
  assignmentRulesRepository: {
    listActive: vi.fn(async () => state.rules),
    update: vi.fn(
      async (
        _db: unknown,
        _orgId: string,
        id: string,
        values: Record<string, unknown>
      ) => {
        const rule = state.rules.find((r) => r.id === id);
        if (rule) Object.assign(rule, values);
        return rule;
      }
    )
  },
  leadsRepository: {
    update: vi.fn(
      async (
        _db: unknown,
        _orgId: string,
        id: string,
        values: Record<string, unknown>
      ) => {
        state.leadUpdates.push({ id, values });
        return { id, ...values };
      }
    ),
    countOpenLeadsByAssignee: vi.fn(async () => state.openCounts)
  },
  leadActivitiesRepository: {
    insert: vi.fn(async (_db: unknown, _orgId: string, values: unknown) => {
      state.activities.push(values as Record<string, unknown>);
      return values;
    })
  },
  schema: {}
}));

const { routeLead } = await import("../src/modules/leads/routing.js");

function baseLead(overrides: Record<string, unknown> = {}) {
  return {
    id: "lead1",
    orgId: "org1",
    campaignId: "camp1",
    persona: null,
    assigneeId: null,
    ...overrides
    // oxlint-disable-next-line no-explicit-any -- test fixture, real shape is `schema.leads.$inferSelect`
  } as any;
}

function baseRule(overrides: Record<string, unknown> = {}) {
  return {
    id: "rule1",
    orgId: "org1",
    priority: 0,
    matchCampaignId: null,
    matchPersona: null,
    fixedAssigneeId: null,
    lastAssignedIndex: 0,
    deletedAt: null,
    ...overrides
  };
}

describe("routeLead", () => {
  beforeEach(() => {
    state.rules.length = 0;
    state.leadUpdates.length = 0;
    state.activities.length = 0;
    state.openCounts = new Map();
  });

  it("round_robin: assigns pool[lastAssignedIndex % pool.length] and persists the incremented cursor", async () => {
    state.rules.push(
      baseRule({
        id: "rule1",
        strategy: "round_robin",
        assigneePoolIds: ["u1", "u2", "u3"],
        lastAssignedIndex: 1
      })
    );

    // oxlint-disable-next-line no-explicit-any -- test fixture, real type is `Db`
    await routeLead({} as any, "org1", baseLead());

    expect(state.leadUpdates).toEqual([
      { id: "lead1", values: { assigneeId: "u2" } }
    ]);
    expect(state.rules[0]?.lastAssignedIndex).toBe(2);
    expect(state.activities).toHaveLength(1);
  });

  it("least_active_leads: picks the candidate with the fewest open leads, ties go to the first in the pool", async () => {
    state.rules.push(
      baseRule({
        id: "rule2",
        strategy: "least_active_leads",
        assigneePoolIds: ["u1", "u2", "u3"]
      })
    );
    state.openCounts = new Map([
      ["u1", 3],
      ["u2", 1],
      ["u3", 1]
    ]);

    // oxlint-disable-next-line no-explicit-any -- test fixture, real type is `Db`
    await routeLead({} as any, "org1", baseLead());

    expect(state.leadUpdates).toEqual([
      { id: "lead1", values: { assigneeId: "u2" } }
    ]);
  });

  it("leaves the lead unassigned when the matched rule's pool is empty", async () => {
    state.rules.push(
      baseRule({ id: "rule3", strategy: "round_robin", assigneePoolIds: [] })
    );

    // oxlint-disable-next-line no-explicit-any -- test fixture, real type is `Db`
    await routeLead({} as any, "org1", baseLead());

    expect(state.leadUpdates).toHaveLength(0);
    expect(state.activities).toHaveLength(0);
  });

  it("never overrides a lead that already has an assignee", async () => {
    state.rules.push(
      baseRule({
        id: "rule4",
        strategy: "fixed_assignee",
        fixedAssigneeId: "u9"
      })
    );

    // oxlint-disable-next-line no-explicit-any -- test fixture, real type is `Db`
    await routeLead({} as any, "org1", baseLead({ assigneeId: "u1" }));

    expect(state.leadUpdates).toHaveLength(0);
  });
});
