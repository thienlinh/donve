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

import { createApiFetch } from "@/lib/api-client";

const paymentsFetch = createApiFetch("payments");

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
