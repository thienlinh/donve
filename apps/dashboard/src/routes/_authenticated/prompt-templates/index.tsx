import { createFileRoute } from "@tanstack/react-router";

import { PromptTemplatesPage } from "@/features/prompt-templates/components/prompt-templates-page";

export const Route = createFileRoute("/_authenticated/prompt-templates/")({
  component: PromptTemplatesPage
});
