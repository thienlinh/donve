import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { id } from "./columns.js";

/**
 * `page-system/custom-import.md` §`customPageBundles` — per-import-cycle bookkeeping for a
 * `landingPages.source = "custom_import"` page. Doesn't duplicate `pageVersions.htmlKey`
 * (already the HTML's source of truth, same as the legacy `import` flow) or a
 * `trackingInjected` flag (the publish pipeline's `window.__DV__`/beacon injection is
 * unconditional for every page regardless of source — nothing to track there).
 */
export const customPageBundles = pgTable("custom_page_bundles", {
  id: id(),
  orgId: uuid("org_id").notNull(),
  landingPageId: uuid("landing_page_id").notNull(),
  sourceKind: text("source_kind", {
    enum: ["zip", "files", "paste_html", "url_fetch"]
  }).notNull(),
  /** 1 row per `<form>` the wizard found in the imported HTML at import/reupload time. */
  detectedForms: jsonb("detected_forms")
    .$type<{ selector: string; wired: boolean }[]>()
    .default([]),
  importedAt: timestamp("imported_at").notNull().defaultNow(),
  lastReuploadedAt: timestamp("last_reuploaded_at")
});
