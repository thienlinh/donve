import {
  and,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lte,
  notInArray,
  or,
  sql
} from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { leadActivities, leads, orders } from "../schema/crm.js";
import { createOrgScopedRepository } from "./scoped-repository.js";

const base = createOrgScopedRepository(leads);

const PAID_ORDER_STATUSES = ["paid", "fulfilled"] as const;

export interface LeadListFilters {
  campaignId?: string;
  productId?: string;
  stage?: string;
  utmSource?: string;
  /** `"unassigned"` matches `assigneeId IS NULL`. */
  assigneeId?: string;
  paid?: boolean;
  /** `true` means 2+ orders exist for this lead — a returning customer, not a one-time lead. */
  repeatCustomer?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  page: number;
  pageSize: number;
}

function listFilterConditions(orgId: string, filters: LeadListFilters) {
  const conditions = [eq(leads.orgId, orgId), isNull(leads.deletedAt)];

  if (filters.campaignId) {
    conditions.push(eq(leads.campaignId, filters.campaignId));
  }
  if (filters.stage) {
    conditions.push(eq(leads.stage, filters.stage));
  }
  if (filters.utmSource) {
    conditions.push(sql`${leads.utm}->>'source' = ${filters.utmSource}`);
  }
  if (filters.assigneeId === "unassigned") {
    conditions.push(isNull(leads.assigneeId));
  } else if (filters.assigneeId) {
    conditions.push(eq(leads.assigneeId, filters.assigneeId));
  }
  if (filters.dateFrom) {
    conditions.push(gte(leads.createdAt, filters.dateFrom));
  }
  if (filters.dateTo) {
    conditions.push(lte(leads.createdAt, filters.dateTo));
  }
  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      // oxlint-disable-next-line no-non-null-assertion -- `or()` with 1+ args always returns a SQL node
      or(
        ilike(leads.fullName, term),
        ilike(leads.phone, term),
        ilike(leads.email, term)
      )!
    );
  }
  if (filters.productId) {
    conditions.push(
      inArray(
        leads.id,
        sql`(select ${orders.leadId} from ${orders} where ${orders.orgId} = ${orgId} and ${orders.productId} = ${filters.productId})`
      )
    );
  }
  if (filters.paid !== undefined) {
    const membership = sql`(select ${orders.leadId} from ${orders} where ${orders.orgId} = ${orgId} and ${orders.status} in ${PAID_ORDER_STATUSES})`;
    conditions.push(
      filters.paid
        ? inArray(leads.id, membership)
        : sql`${leads.id} not in ${membership}`
    );
  }
  if (filters.repeatCustomer) {
    conditions.push(
      inArray(
        leads.id,
        sql`(select ${orders.leadId} from ${orders} where ${orders.orgId} = ${orgId} group by ${orders.leadId} having count(*) >= 2)`
      )
    );
  }

  return and(...conditions);
}

/** Terminal pipeline stages — excluded from the `least_active_leads` routing strategy's
 * "open leads" count and from `least_active_leads`-style workload comparisons. */
const OPEN_LEAD_STAGES_EXCLUDED = ["won", "lost"] as const;

/** `hoursSinceActivity` (age/SLA badge) — hours since the later of the lead's own
 * `createdAt` and its most recent `leadActivities.createdAt`, computed in-query via a
 * correlated subquery so the list endpoint stays a single round trip (no N+1).
 *
 * The outer correlation (`leads.id`/`leads.created_at`) is written as a literal identifier,
 * NOT `${leads.id}`/`${leads.createdAt}` — both `leads` and `lead_activities`/`orders` have
 * their own `id` column, and interpolating the outer `Column` object renders unqualified
 * (`"id"`, not `"leads"."id"`; verified via `.toSQL()`), so Postgres resolves the bare `id`
 * to the SUBQUERY's own table instead of correlating outward — silently comparing e.g.
 * `lead_activities.lead_id = lead_activities.id` (always false) rather than `= leads.id`. */
const hoursSinceActivitySql = sql<number>`
  (extract(epoch from (now() - coalesce(
    (select max(${leadActivities.createdAt}) from ${leadActivities} where ${leadActivities.leadId} = leads.id),
    leads.created_at
  ))) / 3600)::float8
`;

/** Lifetime order count/spend, same correlated-subquery technique (and the same outer-reference
 * qualification requirement, see `hoursSinceActivitySql`'s doc comment) — a lead's phone is
 * unique per org (`findOrCreateLead` merges resubmits into the same row), so this already
 * reflects every campaign the person ever ordered from, not just the current one. Powers the
 * "khách quen" (repeat customer) badge and the `repeatCustomer` filter. */
const orderCountSql = sql<number>`
  (select count(*) from ${orders} where ${orders.leadId} = leads.id)::int
`;
const totalPaidAmountSql = sql<number>`
  (select coalesce(sum(${orders.amount}), 0) from ${orders}
    where ${orders.leadId} = leads.id and ${orders.status} in ${PAID_ORDER_STATUSES})::int
`;

/** One row of `listFiltered` — the lead plus the computed age badge, in the same query the
 * caller already runs (no second round trip). Assignee display info is resolved client-side
 * from `activeOrganization.members` (dashboard already has it), so it isn't duplicated here. */
function listRowSelection() {
  return {
    ...getTableColumns(leads),
    hoursSinceActivity: hoursSinceActivitySql,
    orderCount: orderCountSql,
    totalPaidAmount: totalPaidAmountSql
  };
}

/** The actual row shape `listRowSelection()` produces once queried — `ReturnType<typeof
 * listRowSelection>` itself is the *selection object* (column refs), not the row, so
 * `withOrgScope`'s explicit type param needs this instead. */
type LeadListRow = typeof leads.$inferSelect & {
  hoursSinceActivity: number;
  orderCount: number;
  totalPaidAmount: number;
};

export const leadsRepository = {
  ...base,

  /** dedupe check for FR-E-06 — active (non-deleted) lead with this phone in this org */
  async findByPhone(db: Db, orgId: string, phone: string) {
    const rows = await withOrgScope<(typeof leads.$inferSelect)[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select()
          .from(leads)
          .where(
            and(
              eq(leads.orgId, orgId),
              eq(leads.phone, phone),
              isNull(leads.deletedAt)
            )
          )
          .limit(1)
    );
    return rows[0];
  },

  /** Bulk PATCH/DELETE (`/api/leads/bulk`) — one query for every id in the batch instead of
   * one `findById` per row. Non-deleted only, same as every other list-ish query here. */
  async findManyByIds(db: Db, orgId: string, ids: string[]) {
    if (ids.length === 0) return [];
    return withOrgScope<(typeof leads.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.orgId, orgId),
            inArray(leads.id, ids),
            isNull(leads.deletedAt)
          )
        )
    );
  },

  /** FR-E-01 — filtered, searched, paginated lead list. Two round trips (rows + count) since
   * `withOrgScope` only allows a single query per call (see org-scope.js doc comment). */
  async listFiltered(db: Db, orgId: string, filters: LeadListFilters) {
    const where = listFilterConditions(orgId, filters);
    const [rows, countRows] = await Promise.all([
      withOrgScope<LeadListRow[]>(db, orgId, (qb) =>
        qb
          .select(listRowSelection())
          .from(leads)
          .where(where)
          .orderBy(desc(leads.createdAt))
          .limit(filters.pageSize)
          .offset((filters.page - 1) * filters.pageSize)
      ),
      withOrgScope<{ count: number }[]>(db, orgId, (qb) =>
        qb
          .select({ count: sql<number>`count(*)::int` })
          .from(leads)
          .where(where)
      )
    ]);
    return { rows, total: countRows[0]?.count ?? 0 };
  },

  /** FR-E-07 — same filters as `listFiltered`, no pagination.
   * ponytail: capped at 5000 rows, same reasoning as the lead-digest page cap —
   * a single CSV export past that size wants a background job, not this endpoint. */
  async listForExport(
    db: Db,
    orgId: string,
    filters: Omit<LeadListFilters, "page" | "pageSize">
  ) {
    const where = listFilterConditions(orgId, {
      ...filters,
      page: 1,
      pageSize: 0
    });
    return withOrgScope<(typeof leads.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(leads)
        .where(where)
        .orderBy(desc(leads.createdAt))
        .limit(5000)
    );
  },

  /** NFR-10 — right to erasure, triggered from an ops-handled deletion/export request
   * (email SLA 72h) or self-serve. Keeps the row (and orders/payments, which stay
   * intact as accounting evidence per NFR-11) but scrubs the personal-data columns.
   * `phone` can't be nulled (NOT NULL + unique per org while active), so it gets a
   * placeholder that can't collide with a real phone number. */
  async anonymize(db: Db, orgId: string, id: string) {
    return base.update(db, orgId, id, {
      phone: `anonymized-${id}`,
      email: null,
      customFields: {},
      anonymizedAt: new Date()
    });
  },

  /** `least_active_leads` routing strategy — count of each candidate's open (non-`won`/`lost`,
   * non-deleted) leads, one grouped query instead of one count per candidate. */
  async countOpenLeadsByAssignee(
    db: Db,
    orgId: string,
    assigneeIds: string[]
  ): Promise<Map<string, number>> {
    if (assigneeIds.length === 0) return new Map();
    const rows = await withOrgScope<
      { assigneeId: string | null; count: number }[]
    >(db, orgId, (qb) =>
      qb
        .select({
          assigneeId: leads.assigneeId,
          count: sql<number>`count(*)::int`
        })
        .from(leads)
        .where(
          and(
            eq(leads.orgId, orgId),
            isNull(leads.deletedAt),
            inArray(leads.assigneeId, assigneeIds),
            notInArray(leads.stage, [...OPEN_LEAD_STAGES_EXCLUDED])
          )
        )
        .groupBy(leads.assigneeId)
    );
    return new Map(
      rows
        .filter((row): row is { assigneeId: string; count: number } =>
          Boolean(row.assigneeId)
        )
        .map((row) => [row.assigneeId, row.count])
    );
  },

  /** SLA-breach sweep (`lib/lead-sla-sweep.ts`) — every open, assigned lead in the org, plus
   * the same `hoursSinceActivity` computed column `listFiltered` exposes, so the sweep and the
   * dashboard's age badge always agree on what "how long has this been sitting" means. Only
   * assigned leads matter here — there's no assignee to escalate away from otherwise. */
  async listOpenAssigned(db: Db, orgId: string) {
    return withOrgScope<LeadListRow[]>(db, orgId, (qb) =>
      qb
        .select(listRowSelection())
        .from(leads)
        .where(
          and(
            eq(leads.orgId, orgId),
            isNull(leads.deletedAt),
            isNotNull(leads.assigneeId),
            notInArray(leads.stage, [...OPEN_LEAD_STAGES_EXCLUDED])
          )
        )
    );
  },

  /** NFR-11 — candidates for the periodic retention job: never `paid`/`fulfilled`,
   * not already anonymized/deleted, untouched for at least `cutoff`.
   * ponytail: capped at 500/run, same as the lead-digest page cap — a daily job
   * catches up over subsequent runs instead of needing a pagination loop here. */
  async listRetentionCandidates(db: Db, orgId: string, cutoff: Date) {
    const paidLeadIds = sql`(select ${orders.leadId} from ${orders} where ${orders.orgId} = ${orgId} and ${orders.status} in ${PAID_ORDER_STATUSES})`;
    return withOrgScope<(typeof leads.$inferSelect)[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(leads)
        .where(
          and(
            eq(leads.orgId, orgId),
            isNull(leads.deletedAt),
            isNull(leads.anonymizedAt),
            lte(leads.updatedAt, cutoff),
            sql`${leads.id} not in ${paidLeadIds}`
          )
        )
        .limit(500)
    );
  }
};
