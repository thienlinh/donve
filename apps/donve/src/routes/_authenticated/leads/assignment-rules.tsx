import { createFileRoute } from "@tanstack/react-router";

import { AssignmentRulesPage } from "@/features/leads/components/settings/assignment-rules-page";

export const Route = createFileRoute("/_authenticated/leads/assignment-rules")({
  component: AssignmentRulesPage
});
