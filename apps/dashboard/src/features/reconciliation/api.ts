import {
  orderSearchResponseSchema,
  unmatchedTransactionSchema,
  unmatchedTransactionWithCandidatesSchema,
  type OrderSearchResult,
  type ResolveUnmatchedTransactionInput,
  type UnmatchedTransaction,
  type UnmatchedTransactionWithCandidates
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/payment-connections/api.ts` — cookie session lives on the API origin. */
async function paymentsFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/payments${path}`,
    { ...init, credentials: "include", headers }
  );
  if (!res.ok) throw new Error(`payments api ${path} failed: ${res.status}`);
  return res;
}

const unmatchedListResponseSchema = z.object({
  transactions: z.array(unmatchedTransactionWithCandidatesSchema)
});

export async function fetchUnmatchedTransactions(): Promise<
  UnmatchedTransactionWithCandidates[]
> {
  const res = await paymentsFetch("/unmatched");
  return unmatchedListResponseSchema.parse(await res.json()).transactions;
}

export async function resolveUnmatchedTransaction(
  id: string,
  input: ResolveUnmatchedTransactionInput
): Promise<UnmatchedTransaction> {
  const res = await paymentsFetch(`/unmatched/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return unmatchedTransactionSchema.parse(await res.json());
}

/** Manual order-attach picker for `no_candidate` transactions (FR-D-09). */
export async function searchOrders(
  query: string
): Promise<OrderSearchResult[]> {
  const res = await paymentsFetch(
    `/orders/search?q=${encodeURIComponent(query)}`
  );
  return orderSearchResponseSchema.parse(await res.json()).orders;
}
