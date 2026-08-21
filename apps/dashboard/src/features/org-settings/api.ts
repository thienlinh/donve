import {
  auditLogSchema,
  orgSettingsSchema,
  type OrgSettings
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/leads/api.ts` — cookie session lives on the API origin. */
async function orgSettingsFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/organizations${path}`,
    { ...init, credentials: "include", headers }
  );
  if (!res.ok)
    throw new Error(`org settings api ${path} failed: ${res.status}`);
  return res;
}

export async function fetchOrgSettings(): Promise<OrgSettings> {
  const res = await orgSettingsFetch("/settings");
  return orgSettingsSchema.parse(await res.json());
}

export async function updateOrgSettings(
  input: Partial<OrgSettings>
): Promise<OrgSettings> {
  const res = await orgSettingsFetch("/settings", {
    method: "PATCH",
    body: JSON.stringify(input)
  });
  return orgSettingsSchema.parse(await res.json());
}

const auditLogListResponseSchema = z.object({ logs: z.array(auditLogSchema) });

export async function fetchAuditLogs() {
  const res = await orgSettingsFetch("/audit-logs");
  return auditLogListResponseSchema.parse(await res.json()).logs;
}
