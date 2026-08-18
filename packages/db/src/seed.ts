import { createPostgresDb } from "./client/postgres-js.js";
import { landingPagesRepository } from "./repositories/landing-pages.js";
import { organizationsRepository } from "./repositories/organizations.js";
import { pageVersionsRepository } from "./repositories/page-versions.js";
import { skills } from "./schema/ai.js";
import { organizations } from "./schema/core.js";

const PLATFORM_SKILLS = [
  {
    slug: "landing-hero",
    name: "Landing hero section",
    content: "# Hero\nDefault hero section skill."
  },
  {
    slug: "pricing-table",
    name: "Pricing table",
    content: "# Pricing\nDefault pricing table skill."
  }
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required to seed");

  const db = createPostgresDb(databaseUrl);

  await Promise.all(
    PLATFORM_SKILLS.map((skill) =>
      db.raw
        .insert(skills)
        .values({ orgId: null, ...skill })
        .onConflictDoNothing()
    )
  );

  await db.raw
    .insert(organizations)
    .values({ name: "Demo Org", slug: "demo-org" })
    .onConflictDoNothing({ target: organizations.slug });
  const demoOrg = await organizationsRepository.findBySlug(db, "demo-org");
  if (!demoOrg) throw new Error("demo org seed failed");

  const existingLandingPages = await landingPagesRepository.list(
    db,
    demoOrg.id
  );
  let demoLandingPage = existingLandingPages.find(
    (page) => page.name === "Demo Landing Page"
  );
  if (!demoLandingPage) {
    const inserted = await landingPagesRepository.insert(db, demoOrg.id, {
      name: "Demo Landing Page",
      campaignId: null,
      currentVersionId: null,
      thumbnailKey: null,
      chatSessionId: null,
      source: "import"
    });
    if (!inserted) throw new Error("demo landing page seed failed");
    demoLandingPage = inserted;

    const version = await pageVersionsRepository.insert(db, demoOrg.id, {
      landingPageId: demoLandingPage.id,
      seq: 1,
      // `wrangler r2 object put dv-landing-assets-dev/<key> --file=... --local`
      // to place a matching object for local `/api/landings/:id/html` reads.
      htmlKey: `landing-pages/${demoLandingPage.id}/v1/index.html`,
      srcmapKey: `landing-pages/${demoLandingPage.id}/v1/srcmap.json`,
      origin: "import",
      patch: null,
      chatMessageId: null,
      label: "Initial import",
      createdBy: null
    });
    if (!version) throw new Error("demo page version seed failed");

    await landingPagesRepository.update(db, demoOrg.id, demoLandingPage.id, {
      currentVersionId: version.id
    });
  }

  console.log(
    `Seeded ${PLATFORM_SKILLS.length} platform skills, org "${demoOrg.slug}" (${demoOrg.id}), landing page "${demoLandingPage.name}" (${demoLandingPage.id})`
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
