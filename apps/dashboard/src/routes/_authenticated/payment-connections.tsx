import { createFileRoute } from "@tanstack/react-router";

import { PaymentConnectionsPage } from "@/features/payment-connections/components/payment-connections-page";

export const Route = createFileRoute("/_authenticated/payment-connections")({
  component: PaymentConnectionsPage
});
