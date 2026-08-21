import {
  customDomainSchema,
  type CreateCustomDomainInput,
  type CustomDomain
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/ai-connections/api.ts` — cookie session lives on the API origin. */
async function domainsFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/domains${path}`,
    { ...init, credentials: "include", headers }
  );
  if (!res.ok) throw new Error(`domains api ${path} failed: ${res.status}`);
  return res;
}

const domainListResponseSchema = z.object({
  domains: z.array(customDomainSchema)
});

export async function fetchCustomDomains(): Promise<CustomDomain[]> {
  const res = await domainsFetch("");
  return domainListResponseSchema.parse(await res.json()).domains;
}

export async function createCustomDomain(
  input: CreateCustomDomainInput
): Promise<CustomDomain> {
  const res = await domainsFetch("", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return customDomainSchema.parse(await res.json());
}

export async function verifyCustomDomain(id: string): Promise<CustomDomain> {
  const res = await domainsFetch(`/${id}/verify`, { method: "POST" });
  return customDomainSchema.parse(await res.json());
}

export async function removeCustomDomain(id: string): Promise<void> {
  await domainsFetch(`/${id}`, { method: "DELETE" });
}
