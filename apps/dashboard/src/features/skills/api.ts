import {
  landingSkillOptionSchema,
  skillSchema,
  type CreateSkillInput,
  type LandingSkillOption,
  type Skill,
  type UpdateSkillInput
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/ai-connections/api.ts` — cookie session lives on the API origin. */
async function aiFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai${path}`, {
    ...init,
    credentials: "include",
    headers
  });
  if (!res.ok) throw new Error(`ai api ${path} failed: ${res.status}`);
  return res;
}

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
