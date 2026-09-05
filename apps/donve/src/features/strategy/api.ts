import {
  businessProfileSchema,
  strategyBriefSchema,
  type BusinessProfile,
  type GenerateBusinessProfileInput,
  type StrategyBrief,
  type UpdateBusinessProfileInput,
  type UpdateStrategyBriefInput
} from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const landingsFetch = createApiFetch("landings");

export async function fetchBusinessProfile(
  landingPageId: string
): Promise<BusinessProfile | null> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${landingPageId}/business`,
    { credentials: "include" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`business api failed: ${res.status}`);
  return businessProfileSchema.parse(await res.json());
}

export async function generateBusinessProfile(
  landingPageId: string,
  input: GenerateBusinessProfileInput
): Promise<BusinessProfile> {
  const res = await landingsFetch(`/${landingPageId}/business`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return businessProfileSchema.parse(await res.json());
}

export async function updateBusinessProfile(
  landingPageId: string,
  input: UpdateBusinessProfileInput
): Promise<BusinessProfile> {
  const res = await landingsFetch(`/${landingPageId}/business`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return businessProfileSchema.parse(await res.json());
}

export async function fetchStrategyBrief(
  landingPageId: string
): Promise<StrategyBrief | null> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${landingPageId}/strategy`,
    { credentials: "include" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`strategy api failed: ${res.status}`);
  return strategyBriefSchema.parse(await res.json());
}

export async function generateStrategyBrief(
  landingPageId: string
): Promise<StrategyBrief> {
  const res = await landingsFetch(`/${landingPageId}/strategy`, {
    method: "POST"
  });
  return strategyBriefSchema.parse(await res.json());
}

export async function updateStrategyBrief(
  landingPageId: string,
  input: UpdateStrategyBriefInput
): Promise<StrategyBrief> {
  const res = await landingsFetch(`/${landingPageId}/strategy`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return strategyBriefSchema.parse(await res.json());
}

export async function confirmStrategyBrief(
  landingPageId: string
): Promise<StrategyBrief> {
  const res = await landingsFetch(`/${landingPageId}/strategy/confirm`, {
    method: "POST"
  });
  return strategyBriefSchema.parse(await res.json());
}
