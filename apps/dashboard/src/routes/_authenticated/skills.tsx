import { createFileRoute } from "@tanstack/react-router";

import { SkillsPage } from "@/features/skills/components/skills-page";

export const Route = createFileRoute("/_authenticated/skills")({
  component: SkillsPage
});
