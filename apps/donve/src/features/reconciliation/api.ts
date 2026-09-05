import {
  fulfillmentTaskResponseSchema,
  orderDeskResponseSchema,
  orderSearchResponseSchema,
  unmatchedTransactionSchema,
  unmatchedTransactionWithCandidatesSchema,
  type ExecuteFulfillmentInput,
  type FulfillmentTask,
  type OrderDeskItem,
  type OrderSearchResult,
  type ResolveUnmatchedTransactionInput,
  type UnmatchedTransaction,
  type UnmatchedTransactionWithCandidates
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const leadsFetch = createApiFetch("leads");
const paymentsFetch = createApiFetch("payments");

export async function fetchOrderDesk(
  status: OrderDeskItem["status"] | "all" = "all"
): Promise<OrderDeskItem[]> {
  const query = status === "all" ? "" : `?status=${status}`;

  const res = await leadsFetch(`/orders${query}`);
  return orderDeskResponseSchema.parse(await res.json()).orders;
}
export async function fetchFulfillmentTask(
  orderId: string
): Promise<FulfillmentTask> {
  const res = await paymentsFetch(`/orders/${orderId}/fulfillment`);
  return fulfillmentTaskResponseSchema.parse(await res.json()).task;
}

export async function executeFulfillment(
  orderId: string,
  input: ExecuteFulfillmentInput = {}
): Promise<FulfillmentTask> {
  const res = await paymentsFetch(`/orders/${orderId}/fulfillment/execute`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return fulfillmentTaskResponseSchema.parse(await res.json()).task;
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
