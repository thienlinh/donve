import {
  auditLogSchema,
  orgSettingsSchema,
  type OrgSettings
} from "@dv/contracts";
import { z } from "zod";

import { createApiFetch } from "@/lib/api-client";

const orgSettingsFetch = createApiFetch("organizations", "org settings");

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
