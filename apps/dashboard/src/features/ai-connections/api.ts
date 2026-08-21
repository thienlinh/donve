import {
  aiModelsResponseSchema,
  aiUsageSummarySchema,
  publicAiConnectionSchema,
  type AiModelOption,
  type AiUsageSummary,
  type ConnectAiConnectionInput,
  type ListAiModelsInput,
  type PublicAiConnection,
  type UpdateAiConnectionInput
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/studio/api.ts` — cookie session lives on the API origin. */
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

const connectionListResponseSchema = z.object({
  connections: z.array(publicAiConnectionSchema)
});

export async function fetchAiConnections(): Promise<PublicAiConnection[]> {
  const res = await aiFetch("/connections");
  return connectionListResponseSchema.parse(await res.json()).connections;
}

export async function listAiModels(
  input: ListAiModelsInput
): Promise<AiModelOption[]> {
  const res = await aiFetch("/connections/models", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return aiModelsResponseSchema.parse(await res.json()).models;
}

export async function connectAiConnection(
  input: ConnectAiConnectionInput
): Promise<PublicAiConnection> {
  const res = await aiFetch("/connections", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return publicAiConnectionSchema.parse(await res.json());
}

export async function updateAiConnection(
  id: string,
  input: UpdateAiConnectionInput
): Promise<PublicAiConnection> {
  const res = await aiFetch(`/connections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return publicAiConnectionSchema.parse(await res.json());
}

export async function removeAiConnection(id: string): Promise<void> {
  await aiFetch(`/connections/${id}`, { method: "DELETE" });
}

export async function fetchAiUsage(): Promise<AiUsageSummary> {
  const res = await aiFetch("/usage");
  return aiUsageSummarySchema.parse(await res.json());
}
