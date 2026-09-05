import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

/**
 * Platform-wide, read-only gallery of copy-paste AI prompts (docs/product) — identical for
 * every tenant, nobody ever writes a row per-org. Flat/no-RLS like `billing.ts`'s
 * `featureFlags`: no `orgId`, no `.enableRLS()`, no RLS policy.
 *
 * Only 4 entries (one per offer type — see `seed.ts`), so there's no category-filter UI reading
 * a category; a former `promptCategories` table + `categorySlug` column were dropped for this.
 */
export const promptLibraryEntries = pgTable("prompt_library_entries", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  promptText: text("prompt_text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  // References `templates.id` by value, not a FK constraint — same convention as
  // `planFeatures.featureKey` (billing.ts): the entry set is a small, curated, code-reviewed
  // list, not user input, so a DB-level FK buys little over the seed script itself staying
  // consistent. Every entry sets this (seed.ts) — each is a full-page prompt with a matching
  // real rendered template. May point at a template that doesn't exist in a given environment
  // (`tooling/seed-templates` is a separate, manually-invoked script) — callers must treat a
  // failed lookup the same as `null`.
  templateId: uuid("template_id"),
  ...timestamps
});
