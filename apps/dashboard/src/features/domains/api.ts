import {
  customDomainSchema,
  type CreateCustomDomainInput,
  type CustomDomain
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const domainsFetch = createApiFetch("domains");

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
