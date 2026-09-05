import {
  refundRequestListSchema,
  refundRequestSchema,
  refundRequestWithOrderListSchema,
  refundRequestWithOrderSchema,
  type RefundRequest,
  type RefundRequestWithOrder,
  type RefundStatus
} from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const paymentsFetch = createApiFetch("payments");

export async function fetchRefundRequests(
  status?: RefundStatus
): Promise<RefundRequestWithOrder[]> {
  const query = status ? `?status=${status}` : "";
  const res = await paymentsFetch(`/refund-requests${query}`);
  return refundRequestWithOrderListSchema.parse(await res.json())
    .refundRequests;
}

export async function fetchRefundRequest(
  id: string
): Promise<RefundRequestWithOrder> {
  const res = await paymentsFetch(`/refund-requests/${id}`);
  return refundRequestWithOrderSchema.parse(await res.json());
}

/** FR-D-12/13 checklist for one order + CRM duplicate-payment badge (FR-D-14). */
export async function fetchOrderRefundRequests(
  orderId: string
): Promise<RefundRequest[]> {
  const res = await paymentsFetch(`/orders/${orderId}/refund-requests`);
  return refundRequestListSchema.parse(await res.json()).refundRequests;
}

/** Direct `<img>` src for the uploaded receipt photo (mirrors `assetFileUrl` in studio/api.ts). */
export function refundEvidenceUrl(id: string): string {
  return `${import.meta.env.VITE_API_URL}/api/payments/refund-requests/${id}/evidence`;
}

export async function uploadRefundEvidence(
  id: string,
  file: Blob,
  fileName: string
): Promise<RefundRequest> {
  const body = new FormData();
  body.set("file", file, fileName);
  const res = await paymentsFetch(`/refund-requests/${id}/evidence`, {
    method: "POST",
    body
  });
  return refundRequestSchema.parse(await res.json());
}

export async function completeRefundRequest(
  id: string
): Promise<RefundRequest> {
  const res = await paymentsFetch(`/refund-requests/${id}/complete`, {
    method: "POST"
  });
  return refundRequestSchema.parse(await res.json());
}

export async function rejectRefundRequest(id: string): Promise<RefundRequest> {
  const res = await paymentsFetch(`/refund-requests/${id}/reject`, {
    method: "POST"
  });
  return refundRequestSchema.parse(await res.json());
}
