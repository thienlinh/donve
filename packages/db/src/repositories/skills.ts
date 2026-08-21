import { and, eq, isNull, or } from "drizzle-orm";

import type { Db } from "../client/types.js";
import { withOrgScope } from "../org-scope.js";
import { landingSkills, skills } from "../schema/ai.js";

type SkillRow = typeof skills.$inferSelect;
type SkillInsert = typeof skills.$inferInsert;

/** platform skill (orgId null) or one belonging to this tenant. */
function ownedBy(orgId: string) {
  return or(isNull(skills.orgId), eq(skills.orgId, orgId));
}

export const skillsRepository = {
  /** Every skill usable by this org — platform skills plus the org's own (FR-F-01). */
  async list(db: Db, orgId: string) {
    return withOrgScope<SkillRow[]>(db, orgId, (qb) =>
      qb.select().from(skills).where(ownedBy(orgId))
    );
  },

  /** A single skill, platform or the org's own — for edit/preview screens. */
  async findById(db: Db, orgId: string, id: string) {
    const rows = await withOrgScope<SkillRow[]>(db, orgId, (qb) =>
      qb
        .select()
        .from(skills)
        .where(and(eq(skills.id, id), ownedBy(orgId)))
        .limit(1)
    );
    return rows[0];
  },

  /** Tenants only ever create their own skills — platform skills are curated separately. */
  async insert(db: Db, orgId: string, values: Omit<SkillInsert, "orgId">) {
    const rows = await withOrgScope<SkillRow[]>(db, orgId, (qb) =>
      qb
        .insert(skills)
        .values({ ...values, orgId })
        .returning()
    );
    return rows[0];
  },

  /**
   * Scoped strictly to `eq(orgId, orgId)`, not `ownedBy` — a tenant can never edit a
   * platform skill (orgId null) through this, only its own rows.
   */
  async update(
    db: Db,
    orgId: string,
    id: string,
    values: Omit<Partial<SkillInsert>, "id" | "orgId">
  ) {
    const rows = await withOrgScope<SkillRow[]>(db, orgId, (qb) =>
      qb
        .update(skills)
        .set(values)
        .where(and(eq(skills.orgId, orgId), eq(skills.id, id)))
        .returning()
    );
    return rows[0];
  },

  async remove(db: Db, orgId: string, id: string) {
    const rows = await withOrgScope<SkillRow[]>(db, orgId, (qb) =>
      qb
        .delete(skills)
        .where(and(eq(skills.orgId, orgId), eq(skills.id, id)))
        .returning()
    );
    return rows[0];
  },

  /**
   * Every skill's per-landing-page override row (FR-B-24), keyed by skillId — an absent entry
   * means "no override, use the skill's org default".
   */
  async listOverridesForLandingPage(
    db: Db,
    orgId: string,
    landingPageId: string
  ): Promise<Map<string, boolean>> {
    const rows = await withOrgScope<{ skillId: string; enabled: boolean }[]>(
      db,
      orgId,
      (qb) =>
        qb
          .select({
            skillId: landingSkills.skillId,
            enabled: landingSkills.enabled
          })
          .from(landingSkills)
          .innerJoin(skills, eq(skills.id, landingSkills.skillId))
          .where(
            and(eq(landingSkills.landingPageId, landingPageId), ownedBy(orgId))
          )
    );
    return new Map(rows.map((r) => [r.skillId, r.enabled]));
  },

  /**
   * Skills a landing page actually generates/patches with (FR-B-24): every org skill whose
   * per-landing override says on, or — absent an override — whose org-level `isActiveDefault`
   * is on.
   */
  async listEnabledForLandingPage(
    db: Db,
    orgId: string,
    landingPageId: string
  ): Promise<SkillRow[]> {
    const [all, overrides] = await Promise.all([
      this.list(db, orgId),
      this.listOverridesForLandingPage(db, orgId, landingPageId)
    ]);
    return all.filter(
      (skill) => overrides.get(skill.id) ?? skill.isActiveDefault
    );
  },

  /** Sets (or overwrites) this landing page's override of one skill's enabled state. */
  async setLandingOverride(
    db: Db,
    orgId: string,
    landingPageId: string,
    skillId: string,
    enabled: boolean
  ): Promise<void> {
    await withOrgScope<void>(db, orgId, (qb) =>
      qb
        .insert(landingSkills)
        .values({ landingPageId, skillId, enabled })
        .onConflictDoUpdate({
          target: [landingSkills.landingPageId, landingSkills.skillId],
          set: { enabled }
        })
    );
  }
};
