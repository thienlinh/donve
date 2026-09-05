import { createFileRoute } from "@tanstack/react-router";

import { ReconciliationPage } from "@/features/reconciliation/components/reconciliation-page";

export const Route = createFileRoute("/_authenticated/reconciliation")({
  component: ReconciliationPage
});
