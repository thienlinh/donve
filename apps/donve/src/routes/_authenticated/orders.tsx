import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import {
  ReconciliationPage,
  type OrderDeskFilter
} from "@/features/reconciliation/components/reconciliation-page";

const ordersSearchSchema = z.object({
  status: z
    .enum([
      "pending",
      "awaiting_confirmation",
      "paid",
      "fulfilled",
      "cancelled",
      "refunded"
    ])
    .optional()
});

export const Route = createFileRoute("/_authenticated/orders")({
  validateSearch: ordersSearchSchema,
  component: OrdersPage
});

function OrdersPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  return (
    <ReconciliationPage
      initialStatus={search.status ?? "all"}
      onStatusChange={(status: OrderDeskFilter) =>
        void navigate({
          replace: true,
          search: { status: status === "all" ? undefined : status },
          to: "/orders"
        })
      }
    />
  );
}
