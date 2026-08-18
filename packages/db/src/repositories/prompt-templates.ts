import { and, eq, isNull, or, sql } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { promptTemplates } from "../schema/ai.js";

type PromptTemplateRow = typeof promptTemplates.$inferSelect;
type PromptTemplateInsert = typeof promptTemplates.$inferInsert;

/** platform template (orgId null) or one belonging to this tenant. */
function ownedBy(orgId: string) {
  return or(isNull(promptTemplates.orgId), eq(promptTemplates.orgId, orgId));
}

export const promptTemplatesRepository = {
  /** Every prompt template usable by this org — platform templates plus the org's own (FR-F-03). */
  async list(db: Db, orgId: string) {
    return withOrgScope<PromptTemplateRow[]>(db, orgId, (qb) =>
      qb.select().from(promptTemplates).where(ownedBy(orgId))
    );
  },

  async findById(db: Db, orgId: string, id: string) {
    const rows = await withOrgScope<PromptTemplateRow[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(promptTemplates)
        .where(and(eq(promptTemplates.id, id), ownedBy(orgId)))
        .limit(1)
    );
    return rows[0];
  },

  /** Tenants only ever create their own templates — platform templates are curated separately. */
  async insert(
    db: Db,
    orgId: string,
    values: Omit<PromptTemplateInsert, "orgId">
  ) {
    const rows = await withOrgScope<PromptTemplateRow[]>(db, orgId, (qb) =>
      qb
        .insert(promptTemplates)
        .values({ ...values, orgId })
        .returning()
    );
    return rows[0];
  },

  /**
   * Scoped strictly to `eq(orgId, orgId)`, not `ownedBy` — a tenant can never edit a
   * platform template through this. Bumps `version` on every edit (FR-F-03 versioning).
   */
  async update(
    db: Db,
    orgId: string,
    id: string,
    values: Omit<Partial<PromptTemplateInsert>, "id" | "orgId" | "version">
  ) {
    const rows = await withOrgScope<PromptTemplateRow[]>(db, orgId, (qb) =>
      qb
        .update(promptTemplates)
        .set({ ...values, version: sql`${promptTemplates.version} + 1` })
        .where(
          and(eq(promptTemplates.orgId, orgId), eq(promptTemplates.id, id))
        )
        .returning()
    );
    return rows[0];
  },

  async remove(db: Db, orgId: string, id: string) {
    const rows = await withOrgScope<PromptTemplateRow[]>(db, orgId, (qb) =>
      qb
        .delete(promptTemplates)
        .where(
          and(eq(promptTemplates.orgId, orgId), eq(promptTemplates.id, id))
        )
        .returning()
    );
    return rows[0];
  }
};

/**
 * Joins every section's content and substitutes `{{key}}` placeholders with the given
 * values (FR-F-03 "preview prompt cuối cùng đã compile") — no unresolved variable is left
 * silently blank, so a missing value surfaces as the literal `{{key}}` in the preview.
 */
export function compilePromptTemplate(
  template: Pick<PromptTemplateRow, "sections">,
  values: Record<string, string>
): string {
  const sections = template.sections as Array<{ key: string; content: string }>;
  const text = sections.map((section) => section.content).join("\n\n");
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : value;
  });
}
