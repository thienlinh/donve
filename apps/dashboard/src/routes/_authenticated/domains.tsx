import { createFileRoute } from "@tanstack/react-router";

import { DomainsPage } from "@/features/domains/components/domains-page";

export const Route = createFileRoute("/_authenticated/domains")({
  component: DomainsPage
});
