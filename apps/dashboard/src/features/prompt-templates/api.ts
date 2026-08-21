import {
  compiledPromptSchema,
  promptTemplateSchema,
  promptTestRunSchema,
  type CompilePromptTemplateInput,
  type CompiledPrompt,
  type CreatePromptTemplateInput,
  type PromptTemplate,
  type PromptTestRun,
  type RunPromptTestInput,
  type UpdatePromptTemplateInput
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

const promptTemplateListResponseSchema = z.object({
  promptTemplates: z.array(promptTemplateSchema)
});

export async function fetchPromptTemplates(): Promise<PromptTemplate[]> {
  const res = await aiFetch("/prompt-templates");
  return promptTemplateListResponseSchema.parse(await res.json())
    .promptTemplates;
}

export async function createPromptTemplate(
  input: CreatePromptTemplateInput
): Promise<PromptTemplate> {
  const res = await aiFetch("/prompt-templates", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return promptTemplateSchema.parse(await res.json());
}

export async function updatePromptTemplate(
  id: string,
  input: UpdatePromptTemplateInput
): Promise<PromptTemplate> {
  const res = await aiFetch(`/prompt-templates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return promptTemplateSchema.parse(await res.json());
}

export async function removePromptTemplate(id: string): Promise<void> {
  await aiFetch(`/prompt-templates/${id}`, { method: "DELETE" });
}

export async function compilePromptTemplate(
  id: string,
  input: CompilePromptTemplateInput
): Promise<CompiledPrompt> {
  const res = await aiFetch(`/prompt-templates/${id}/compile`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return compiledPromptSchema.parse(await res.json());
}

const testRunListResponseSchema = z.object({
  testRuns: z.array(promptTestRunSchema)
});

export async function fetchPromptTestRuns(
  templateId: string
): Promise<PromptTestRun[]> {
  const res = await aiFetch(`/prompt-templates/${templateId}/test-runs`);
  return testRunListResponseSchema.parse(await res.json()).testRuns;
}

export async function runPromptTest(
  templateId: string,
  input: RunPromptTestInput
): Promise<PromptTestRun> {
  const res = await aiFetch(`/prompt-templates/${templateId}/test-run`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return promptTestRunSchema.parse(await res.json());
}
