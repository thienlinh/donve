import { jsonb, pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

/**
 * Pre-built starting points offered in the "create landing page" flow — shared across every
 * org, not tenant content. No `org_id` and no RLS, same reasoning as `platform_staff`
 * (schema/platform.ts): this table has no tenant boundary to enforce, so it's queried directly
 * rather than through `withOrgScope`. `pageSpec`/`tokens`/`seo` are cloned verbatim into a new
 * landing page's first `pageVersion` on pick — same shape `pageVersions.spec` already stores,
 * generated once by running the real Page Architect → Content Agent pipeline against a
 * hand-written brief per industry (see `tooling/seed-templates`), not hand-authored PageSpec.
 */
export const templates = pgTable("templates", {
  id: id(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  thumbnailKey: text("thumbnail_key"),
  pageSpec: jsonb("page_spec").notNull(),
  tokens: jsonb("tokens").notNull(),
  seo: jsonb("seo"),
  // Carried through from the Page Architect run that generated this template so a cloned page
  // keeps working with the Quality Critic's "purpose coverage" check (page-system's flat
  // elementId-keyed side-map — same shape `pageVersions.spec.architectureNotes` uses).
  architectureNotes: jsonb("architecture_notes"),
  createdAt: timestamps.createdAt
});
