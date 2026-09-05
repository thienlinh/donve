import { asc, eq } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { promptLibraryEntries } from "../schema/prompt-library.js";

/** Global, read-only gallery (no `org_id`, no RLS) — read directly, same as `featureFlags`. */
export const promptLibraryRepository = {
  list(db: Db) {
    return db.raw
      .select()
      .from(promptLibraryEntries)
      .orderBy(asc(promptLibraryEntries.sortOrder));
  },

  async findBySlug(db: Db, slug: string) {
    const rows = await db.raw
      .select()
      .from(promptLibraryEntries)
      .where(eq(promptLibraryEntries.slug, slug))
      .limit(1);
    return rows[0];
  }
};
