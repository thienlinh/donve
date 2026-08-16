import { createPostgresDb } from "./client/postgres-js.js"
import { organizationsRepository } from "./repositories/organizations.js"
import { skills } from "./schema/ai.js"
import { organizations } from "./schema/core.js"

const PLATFORM_SKILLS = [
  {
    slug: "landing-hero",
    name: "Landing hero section",
    content: "# Hero\nDefault hero section skill.",
  },
  {
    slug: "pricing-table",
    name: "Pricing table",
    content: "# Pricing\nDefault pricing table skill.",
  },
]

async function seed() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL is required to seed")

  const db = createPostgresDb(databaseUrl)

  await Promise.all(
    PLATFORM_SKILLS.map((skill) =>
      db.raw
        .insert(skills)
        .values({ orgId: null, ...skill })
        .onConflictDoNothing()
    )
  )

  await db.raw
    .insert(organizations)
    .values({ name: "Demo Org", slug: "demo-org" })
    .onConflictDoNothing({ target: organizations.slug })
  const demoOrg = await organizationsRepository.findBySlug(db, "demo-org")
  if (!demoOrg) throw new Error("demo org seed failed")

  console.log(
    `Seeded ${PLATFORM_SKILLS.length} platform skills and org "${demoOrg.slug}" (${demoOrg.id})`
  )
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
