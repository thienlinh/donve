import {
  auditResultSchema,
  autoFixResultSchema,
  type AuditResult,
  type AutoFixResult
} from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const landingsFetch = createApiFetch("landings");

export async function fetchLatestAudit(
  landingPageId: string
): Promise<AuditResult | null> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${landingPageId}/audit`,
    { credentials: "include" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`audit api failed: ${res.status}`);
  return auditResultSchema.parse(await res.json());
}

/** `quality/quality-spec.md` §Tầng 3 — rule checks + Quality Critic LLM call, ~a few seconds. */
export async function runAudit(landingPageId: string): Promise<AuditResult> {
  const res = await landingsFetch(`/${landingPageId}/audit`, {
    method: "POST"
  });
  return auditResultSchema.parse(await res.json());
}

/** `ai/agent-pipeline.md` §Self-critique loop — runs up to N audit→fix rounds server-side,
 * can take a while (multiple LLM calls per round). */
export async function runAutoFix(
  landingPageId: string
): Promise<AutoFixResult> {
  const res = await landingsFetch(`/${landingPageId}/auto-fix`, {
    method: "POST"
  });
  return autoFixResultSchema.parse(await res.json());
}
