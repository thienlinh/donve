import type { RefundStatus } from "@dv/contracts";

export const refundRequestKeys = {
  list: (status?: RefundStatus) =>
    ["refund-requests", status ?? "all"] as const,
  detail: (id: string) => ["refund-requests", "detail", id] as const,
  forOrder: (orderId: string) => ["refund-requests", "order", orderId] as const
};
