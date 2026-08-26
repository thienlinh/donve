import { businessProfileSchema, strategyBriefSchema } from "@dv/contracts";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, expect, it } from "vitest";

import { createPostgresDb } from "../src/client/postgres-js.js";
import { businessProfilesRepository } from "../src/repositories/business-profiles.js";
import { strategyBriefsRepository } from "../src/repositories/strategy-briefs.js";
import * as schema from "../src/schema/index.js";

let container: StartedPostgreSqlContainer;
let db: ReturnType<typeof createPostgresDb>;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:18-alpine").start();
  const connectionUri = container.getConnectionUri();
  const migratorClient = postgres(connectionUri, { max: 1 });
  await migrate(drizzle(migratorClient, { schema }), {
    migrationsFolder: new URL("../migrations", import.meta.url).pathname
  });
  await migratorClient.end();
  db = createPostgresDb(connectionUri);
}, 60_000);

afterAll(async () => {
  await container.stop();
});

it("round-trips a businessProfile and a strategyBrief through the real repositories + contracts schemas", async () => {
  const orgId = crypto.randomUUID();
  const landingPageId = crypto.randomUUID();

  const profile = await businessProfilesRepository.insert(db, orgId, {
    landingPageId,
    product: [
      {
        label: "category",
        value: "SaaS B2B",
        status: "fact",
        sourceRef: "brief"
      }
    ],
    customer: [{ label: "ICP", value: "SME logistics", status: "inference" }],
    market: [{ label: "pricing model", value: "chưa rõ", status: "unknown" }],
    sources: [{ kind: "brief", value: "..." }]
  });
  expect(profile).toBeDefined();
  const parsedProfile = businessProfileSchema.parse(profile);
  expect(parsedProfile.product[0]?.status).toBe("fact");

  const foundProfile = await businessProfilesRepository.findByLandingPage(
    db,
    orgId,
    landingPageId
  );
  expect(foundProfile?.id).toBe(profile?.id);

  const brief = await strategyBriefsRepository.insert(db, orgId, {
    landingPageId,
    business: { product: "SaaS B2B", category: "logistics" },
    customer: { icp: "SME logistics", painPoints: ["tồn kho thất thoát"] },
    market: { competitors: ["A", "B"] },
    funnel: { conversionGoal: "demo_booked" },
    offer: { coreOffer: "14-day trial" },
    message: {
      supportingClaims: [
        { claim: "Giảm 30% thời gian kiểm kho", evidenceRef: "brief" }
      ]
    },
    confirmedAt: null,
    confirmedBy: null
  });
  expect(brief).toBeDefined();
  const parsedBrief = strategyBriefSchema.parse(brief);
  expect(parsedBrief.confirmedAt).toBeNull();
  expect(parsedBrief.message.supportingClaims[0]?.evidenceRef).toBe("brief");

  const confirmed = await strategyBriefsRepository.update(
    db,
    orgId,
    brief!.id,
    {
      confirmedAt: new Date(),
      confirmedBy: crypto.randomUUID()
    }
  );
  expect(strategyBriefSchema.parse(confirmed).confirmedAt).not.toBeNull();
});
