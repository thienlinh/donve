import {
  customPageBundlesRepository,
  landingPagesRepository,
  schema
} from "@dv/db";
import { and, eq, isNull, ne } from "drizzle-orm";

import type { Bindings } from "../types.js";
import { detectImportForms } from "./custom-import.js";
import { createDbFromEnv } from "./db.js";
import { createStorageFromEnv } from "./storage.js";

/**
 * `roadmap/roadmap.md` §Migration dữ liệu cũ — "Landing page tạo trước bản thiết kế này tự
 * động coi là custom_import (customPageBundles tạo tự động, không cần re-upload)". Cross-org
 * by design (an operator-triggered backfill has to span every tenant at once, same reasoning
 * as `publishOutboxRepository.listPendingAcrossOrgs`) — `landing_pages`/`page_versions` carry
 * no RLS policy, so there's nothing to bypass.
 *
 * A page qualifies once: its current version has no `spec` (the legacy srcmap shape — the
 * native/manual flows always set `spec`, so this is exactly "never touched the rewrite") and
 * its `source` isn't already `custom_import`. Idempotent — re-running only ever finds pages
 * the previous run didn't already flip.
 */
export async function runLegacyImportMigration(
  env: Bindings
): Promise<{ migrated: number }> {
  const db = createDbFromEnv(env);
  const storage = createStorageFromEnv(env);

  const rows = await db.raw
    .select({
      id: schema.landingPages.id,
      orgId: schema.landingPages.orgId,
      htmlKey: schema.pageVersions.htmlKey
    })
    .from(schema.landingPages)
    .innerJoin(
      schema.pageVersions,
      eq(schema.landingPages.currentVersionId, schema.pageVersions.id)
    )
    .where(
      and(
        ne(schema.landingPages.source, "custom_import"),
        isNull(schema.landingPages.deletedAt),
        isNull(schema.pageVersions.spec)
      )
    );

  const migrated = await Promise.all(
    rows
      .filter(
        (row): row is typeof row & { htmlKey: string } => row.htmlKey !== null
      )
      .map(async (row) => {
        const object = await storage.get(row.htmlKey);
        const html = object ? await new Response(object.body).text() : "";
        const detectedForms = detectImportForms(html);

        await landingPagesRepository.update(db, row.orgId, row.id, {
          source: "custom_import"
        });
        await customPageBundlesRepository.insert(db, row.orgId, {
          landingPageId: row.id,
          // Original upload shape was never recorded pre-rewrite — "paste_html" is a neutral
          // placeholder, never read for anything but display.
          sourceKind: "paste_html",
          detectedForms: detectedForms.map((f) => ({
            selector: f.selector,
            wired: false
          }))
        });
        return row.id;
      })
  );

  return { migrated: migrated.length };
}
