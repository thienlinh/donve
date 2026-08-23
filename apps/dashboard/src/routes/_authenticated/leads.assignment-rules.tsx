import { createFileRoute } from "@tanstack/react-router";

import { AssignmentRulesPage } from "@/features/leads/components/assignment-rules-page";

export const Route = createFileRoute("/_authenticated/leads/assignment-rules")({
  component: AssignmentRulesPage
});
