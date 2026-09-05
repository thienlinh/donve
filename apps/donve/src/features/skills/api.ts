import {
  landingSkillOptionSchema,
  skillSchema,
  type CreateSkillInput,
  type LandingSkillOption,
  type Skill,
  type UpdateSkillInput
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const aiFetch = createApiFetch("ai");

const skillListResponseSchema = z.object({ skills: z.array(skillSchema) });

export async function fetchSkills(): Promise<Skill[]> {
  const res = await aiFetch("/skills");
  return skillListResponseSchema.parse(await res.json()).skills;
}

export async function createSkill(input: CreateSkillInput): Promise<Skill> {
  const res = await aiFetch("/skills", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return skillSchema.parse(await res.json());
}

export async function updateSkill(
  id: string,
  input: UpdateSkillInput
): Promise<Skill> {
  const res = await aiFetch(`/skills/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return skillSchema.parse(await res.json());
}

export async function removeSkill(id: string): Promise<void> {
  await aiFetch(`/skills/${id}`, { method: "DELETE" });
}

const landingSkillListResponseSchema = z.object({
  skills: z.array(landingSkillOptionSchema)
});

/** Studio's "skills for this page" control — org skills annotated with per-landing enabled state. */
export async function fetchLandingSkills(
  landingPageId: string
): Promise<LandingSkillOption[]> {
  const res = await aiFetch(`/landings/${landingPageId}/skills`);
  return landingSkillListResponseSchema.parse(await res.json()).skills;
}

export async function setLandingSkill(
  landingPageId: string,
  skillId: string,
  enabled: boolean
): Promise<void> {
  await aiFetch(`/landings/${landingPageId}/skills/${skillId}`, {
    method: "PUT",
    body: JSON.stringify({ enabled })
  });
}
