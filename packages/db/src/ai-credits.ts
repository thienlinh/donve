import { sql } from "drizzle-orm";

import type { Db } from "./client/types.js";

export interface RecordAiUsageInput {
  orgId: string;
  connectionId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  creditCost: number;
  context?: Record<string, unknown>;
}

export interface AiDebitResult {
  /** false when the org didn't have enough balance/trial uses — nothing was written. */
  ok: boolean;
  /** New balance/remaining-uses after the debit, only present when `ok`. */
  remaining?: number;
}

const DEBIT_COLUMNS = {
  credits: "ai_credit_balance",
  trial: "trial_uses_remaining"
} as const;

/**
 * Atomically decrements one `organizations` counter and inserts the matching `ai_usage`
 * row in a single statement (database-schema.md note #8): a data-modifying CTE gates the
 * INSERT on whether the UPDATE actually matched a row, so a request that would go negative
 * neither bills nor gets recorded. One statement is atomic on both drivers this platform
 * runs on (org-scope.ts) without needing a real `.transaction()` — no driver branching.
 *
 * `ai_usage` carries `orgIsolationPolicy()`, so this statement must also set
 * `app.current_org` before the INSERT runs — the `scope` CTE does that via a `FROM scope`
 * cross join on `debit`'s UPDATE (guarantees `scope` is evaluated before `debit`, which the
 * INSERT already depends on via `exists (select 1 from debit)`), since a plain unreferenced
 * `set_config(...)` CTE isn't guaranteed to execute at all.
 */
async function debitAndRecordUsage(
  db: Db,
  column: (typeof DEBIT_COLUMNS)[keyof typeof DEBIT_COLUMNS],
  amount: number,
  input: RecordAiUsageInput
): Promise<AiDebitResult> {
  const query = sql`
    with scope as (
      select set_config('app.current_org', ${input.orgId}, true)
    ),
    debit as (
      update organizations
      set ${sql.raw(column)} = ${sql.raw(column)} - ${amount}
      from scope
      where id = ${input.orgId} and ${sql.raw(column)} >= ${amount}
      returning ${sql.raw(column)} as remaining
    )
    insert into ai_usage (org_id, connection_id, model, input_tokens, output_tokens, credit_cost, context)
    select ${input.orgId}, ${input.connectionId}, ${input.model}, ${input.inputTokens}, ${input.outputTokens}, ${input.creditCost}, ${JSON.stringify(input.context ?? {})}::jsonb
    where exists (select 1 from debit)
    returning (select remaining from debit) as remaining
  `;

  // Narrow on `kind` before touching `.raw` (same reasoning as org-scope.ts) — the two
  // drivers' `execute()` return shapes differ (neon-http: `{ rows }`, postgres-js: `Row[]`).
  const rows =
    db.kind === "postgres-js"
      ? await db.raw.execute(query)
      : (await db.raw.execute(query)).rows;
  const row = rows[0] as { remaining: number } | undefined;
  return row ? { ok: true, remaining: row.remaining } : { ok: false };
}

/** `connectionId=platform` path (FR-H-02, paid plans) — bills against `aiCreditBalance`. */
export function debitAiCreditsAndRecordUsage(
  db: Db,
  input: RecordAiUsageInput
): Promise<AiDebitResult> {
  return debitAndRecordUsage(
    db,
    DEBIT_COLUMNS.credits,
    input.creditCost,
    input
  );
}

/** Trial path (FR-H-05) — one free Workers AI generation per call, never billed in credits. */
export function debitTrialUseAndRecordUsage(
  db: Db,
  input: Omit<RecordAiUsageInput, "creditCost">
): Promise<AiDebitResult> {
  return debitAndRecordUsage(db, DEBIT_COLUMNS.trial, 1, {
    ...input,
    creditCost: 0
  });
}
