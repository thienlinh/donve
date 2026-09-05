import { usageSummarySchema, type UsageSummary } from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const telemetryFetch = createApiFetch("telemetry", "telemetry");

export async function fetchUsageSummary(): Promise<UsageSummary> {
  const res = await telemetryFetch("/summary");
  return usageSummarySchema.parse(await res.json());
}
