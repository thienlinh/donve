import { createFileRoute } from "@tanstack/react-router";

import { PromptTemplateDetailPage } from "@/features/prompt-templates/components/prompt-template-detail-page";

export const Route = createFileRoute("/_authenticated/prompt-templates/$id")({
  component: PromptTemplateDetailPage
});
