import type { Bindings } from "../types.js";
import { ApiError } from "./errors.js";

const CF_API_BASE = "https://api.cloudflare.com/client/v4";

interface CfOwnershipVerification {
  type: string;
  name: string;
  value: string;
}

interface CfCustomHostname {
  id: string;
  hostname: string;
  // "pending" | "active" | "moved" | "deleted" | "blocked" | ...
  status: string;
  ssl: {
    // "pending_validation" | "pending_issuance" | "pending_deployment" | "active" | ...
    status: string;
  };
  ownership_verification?: CfOwnershipVerification;
}

interface CfEnvelope<T> {
  success: boolean;
  result: T;
  errors: { message: string }[];
}

async function cfRequest<T>(
  env: Bindings,
  path: string,
  init?: RequestInit
): Promise<T> {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) {
    throw new ApiError(501, "cloudflare_saas_unconfigured");
  }
  const res = await fetch(`${CF_API_BASE}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.CF_API_TOKEN}`,
      "content-type": "application/json"
    }
  });
  const body = (await res.json()) as CfEnvelope<T>;
  if (!res.ok || !body.success) {
    throw new ApiError(
      502,
      "cloudflare_saas_request_failed",
      body.errors[0]?.message ?? `HTTP ${res.status}`
    );
  }
  return body.result;
}

/** FR-G-04 — registers the tenant's hostname as a Cloudflare for SaaS custom hostname.
 * `ssl.method: "http"` needs no separate ownership TXT record once the CNAME below is live:
 * CF validates by requesting `http://<hostname>/.well-known/...` through it. */
export async function createCustomHostname(
  env: Bindings,
  hostname: string
): Promise<CfCustomHostname> {
  return cfRequest<CfCustomHostname>(
    env,
    `/zones/${env.CF_ZONE_ID}/custom_hostnames`,
    {
      method: "POST",
      body: JSON.stringify({
        hostname,
        ssl: { method: "http", type: "dv" }
      })
    }
  );
}

export async function getCustomHostname(
  env: Bindings,
  cfHostnameId: string
): Promise<CfCustomHostname> {
  return cfRequest<CfCustomHostname>(
    env,
    `/zones/${env.CF_ZONE_ID}/custom_hostnames/${cfHostnameId}`
  );
}

export async function deleteCustomHostname(
  env: Bindings,
  cfHostnameId: string
): Promise<void> {
  await cfRequest<unknown>(
    env,
    `/zones/${env.CF_ZONE_ID}/custom_hostnames/${cfHostnameId}`,
    { method: "DELETE" }
  );
}

const FAILED_CF_STATUSES = new Set(["blocked", "deleted"]);

/** Collapses Cloudflare's two independent status enums (hostname activation + SSL
 * issuance) into the three-value status this platform shows the tenant. */
export function mapCustomHostnameStatus(
  cf: Pick<CfCustomHostname, "status" | "ssl">
): "pending" | "active" | "failed" {
  if (FAILED_CF_STATUSES.has(cf.status)) return "failed";
  if (cf.status === "active" && cf.ssl.status === "active") return "active";
  return "pending";
}

export function toVerification(cf: CfCustomHostname, cnameTarget: string) {
  return {
    cnameTarget,
    ownershipVerification: cf.ownership_verification,
    sslStatus: cf.ssl.status
  };
}
