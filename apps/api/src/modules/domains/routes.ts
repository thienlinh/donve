import {
  createCustomDomainInputSchema,
  customDomainSchema
} from "@dv/contracts";
import { customDomainsRepository, landingPagesRepository } from "@dv/db";
import { Hono, type Context } from "hono";
import { z } from "zod";

import {
  createCustomHostname,
  deleteCustomHostname,
  getCustomHostname,
  mapCustomHostnameStatus,
  toVerification
} from "../../lib/cloudflare-saas.js";
import { createDbFromEnv } from "../../lib/db.js";
import { ApiError } from "../../lib/errors.js";
import { log } from "../../lib/logger.js";
import {
  clearCustomDomainPointer,
  syncCustomDomainPointer
} from "../../lib/publish.js";
import type { AppEnv } from "../../types.js";

export const domainsRoutes = new Hono<AppEnv>();

function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

domainsRoutes.get("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);

  const domains = await customDomainsRepository.list(db, orgId);
  return c.json({
    domains: z.array(customDomainSchema).parse(domains)
  });
});

// FR-G-04: CNAME + auto cert via Cloudflare for SaaS. Ownership/SSL validation happens
// entirely async on Cloudflare's side once the tenant points the CNAME below — this call
// just registers the hostname and hands back the exact DNS instructions to show them.
domainsRoutes.post("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createCustomDomainInputSchema.parse(await c.req.json());

  const landingPage = await landingPagesRepository.findById(
    db,
    orgId,
    body.landingPageId
  );
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }

  // A hostname another org already claims (any status) can't be re-registered here — same
  // takeover concern as FR-G-01's subdomain check (lib/publish.ts).
  const claimedElsewhere =
    await customDomainsRepository.findByHostnameAcrossOrgs(
      db,
      body.hostname,
      orgId
    );
  if (claimedElsewhere) throw new ApiError(409, "hostname_taken");

  const cfHostname = await createCustomHostname(c.env, body.hostname);
  const cnameTarget = c.env.CF_CUSTOM_DOMAIN_TARGET ?? "";

  // If the local insert fails (e.g. the `hostname` UNIQUE constraint catching a race the
  // findByHostnameAcrossOrgs check above missed), the Cloudflare hostname we just registered
  // would otherwise be orphaned — nothing left in our DB references `cfHostname.id`, so it
  // could never be cleaned up and would block re-registering the same hostname later.
  let domain;
  try {
    domain = await customDomainsRepository.insert(db, orgId, {
      landingPageId: body.landingPageId,
      hostname: body.hostname,
      status: mapCustomHostnameStatus(cfHostname),
      cfHostnameId: cfHostname.id,
      verification: toVerification(cfHostname, cnameTarget)
    });
  } catch (err) {
    await deleteCustomHostname(c.env, cfHostname.id).catch(
      (cleanupErr: unknown) => {
        log("warn", {
          requestId: "domains",
          orgId,
          message: "failed to roll back orphaned cloudflare custom hostname",
          cfHostnameId: cfHostname.id,
          error:
            cleanupErr instanceof Error
              ? cleanupErr.message
              : String(cleanupErr)
        });
      }
    );
    throw err;
  }
  if (!domain) throw new ApiError(500, "custom_domain_create_failed");

  return c.json(customDomainSchema.parse(domain), 201);
});

async function requireCustomDomain(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  id: string
) {
  const domain = await customDomainsRepository.findById(db, orgId, id);
  if (!domain) throw new ApiError(404, "custom_domain_not_found");
  return domain;
}

// Re-checks Cloudflare's activation/SSL status for one hostname — the dashboard polls this
// so the tenant sees "trạng thái verify" update without waiting on a webhook.
domainsRoutes.post("/:id/verify", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const domain = await requireCustomDomain(db, orgId, c.req.param("id"));
  if (!domain.cfHostnameId)
    throw new ApiError(409, "custom_domain_not_registered");

  const cfHostname = await getCustomHostname(c.env, domain.cfHostnameId);
  const status = mapCustomHostnameStatus(cfHostname);
  const cnameTarget = c.env.CF_CUSTOM_DOMAIN_TARGET ?? "";

  const updated = await customDomainsRepository.update(db, orgId, domain.id, {
    status,
    verification: toVerification(cfHostname, cnameTarget)
  });
  if (!updated) throw new ApiError(500, "custom_domain_update_failed");

  if (status === "active" && domain.status !== "active") {
    await syncCustomDomainPointer(db, c.env, updated);
  }

  return c.json(customDomainSchema.parse(updated));
});

domainsRoutes.delete("/:id", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const domain = await requireCustomDomain(db, orgId, c.req.param("id"));

  if (domain.cfHostnameId) {
    // Best-effort — a hostname CF already dropped (e.g. tenant removed the CNAME and CF
    // expired it) shouldn't block deleting our own record of it. Logged rather than silently
    // swallowed: an orphaned Cloudflare hostname is otherwise unrecoverable once the local row
    // (the only place `cfHostnameId` lives) is gone.
    await deleteCustomHostname(c.env, domain.cfHostnameId).catch(
      (err: unknown) => {
        log("warn", {
          requestId: "domains",
          orgId,
          message: "failed to delete cloudflare custom hostname on removal",
          cfHostnameId: domain.cfHostnameId,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    );
  }
  await clearCustomDomainPointer(c.env, domain.hostname).catch(
    (err: unknown) => {
      log("warn", {
        requestId: "domains",
        orgId,
        message: "failed to clear pointer-store entry on domain removal",
        hostname: domain.hostname,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  );

  await customDomainsRepository.remove(db, orgId, domain.id);
  return c.json({ ok: true });
});
