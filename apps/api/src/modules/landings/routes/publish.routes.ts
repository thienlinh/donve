import { deploymentSchema, publishLandingPageInputSchema } from "@dv/contracts";
import { auditLogsRepository, deploymentsRepository } from "@dv/db";
import { Hono } from "hono";
import { z } from "zod";

import {
  previewLandingPage,
  publishLandingPage,
  rollbackDeployment,
  unpublishLandingPage
} from "@/lib/publish.js";
import type { AppEnv } from "@/types.js";

import { requireLandingPageContext } from "../shared.js";

export const publishRoutes = new Hono<AppEnv>();

// Publish (architecture.md §5.2, outbox pattern) — build_deploy pipeline runs inline in the
// request rather than a separate queued job (no job-queue infra wired up yet, see
// packages/drivers/src/jobs). That's fine for the pattern's actual guarantee: the outbox row
// is what makes a mid-pipeline crash recoverable, not which process runs the pipeline.
publishRoutes.post("/:id/publish", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);
  const body = publishLandingPageInputSchema.parse(await c.req.json());

  const { deployment, live } = await publishLandingPage(
    db,
    c.env,
    orgId,
    id,
    body.subdomain
  );

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "landing_page.publish",
    targetType: "landing_page",
    targetId: id,
    meta: { subdomain: body.subdomain, live }
  });

  return c.json(
    { deployment: deploymentSchema.parse(deployment), live },
    live ? 200 : 202
  );
});

// Pre-publish preview (`ui-ux-design.md` §Studio) — builds the real publish artifacts to a
// private token URL. Deliberately *not* a `deployments` row: nothing goes live, so there's
// nothing to roll back and nothing to show in deploy history.
publishRoutes.post("/:id/preview", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const { path } = await previewLandingPage(db, c.env, orgId, id);
  return c.json({ url: new URL(path, c.req.url).toString() });
});

// Deploy history for the current hostname (rollback target picker).
publishRoutes.get("/:id/deployments", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const all = await deploymentsRepository.list(db, orgId);
  const deployments = all
    .filter((deployment) => deployment.landingPageId === id)
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return c.json({ deployments: z.array(deploymentSchema).parse(deployments) });
});

// Rollback goes through the same outbox mechanism as publish, per architecture.md §5.2 —
// not a direct KV/pointer write.
publishRoutes.post("/:id/deployments/:deploymentId/rollback", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const deploymentId = c.req.param("deploymentId");
  const live = await rollbackDeployment(db, c.env, orgId, id, deploymentId);

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "landing_page.rollback",
    targetType: "landing_page",
    targetId: id,
    meta: { deploymentId, live }
  });

  return c.json({ live }, live ? 200 : 202);
});

// Unpublish (FR-G-02) — removes the hostname pointer directly, no outbox row (see
// lib/publish.ts unpublishLandingPage doc comment for why it doesn't fit that shape).
publishRoutes.post("/:id/unpublish", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const deployment = await unpublishLandingPage(db, c.env, orgId, id);

  await auditLogsRepository.insert(db, orgId, {
    actorId: c.get("userId"),
    action: "landing_page.unpublish",
    targetType: "landing_page",
    targetId: id,
    meta: {}
  });

  return c.json({ deployment: deploymentSchema.parse(deployment) }, 200);
});
