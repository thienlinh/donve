import { createFileRoute } from "@tanstack/react-router";

import { RefundRequestsPage } from "@/features/refund-requests/components/refund-requests-page";

export const Route = createFileRoute("/_authenticated/refund-requests")({
  component: RefundRequestsPage
});
