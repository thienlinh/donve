import { orgSettingsSchema } from "@dv/contracts";
import {
  auditLogsRepository,
  leadActivitiesRepository,
  leadsRepository,
  organizationsRepository
} from "@dv/db";

import type { Bindings } from "../types.js";
import { createDbFromEnv } from "./db.js";
import { log } from "./logger.js";

const RETENTION_MONTHS = 12;

function retentionCutoff(now: Date): Date {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - RETENTION_MONTHS);
  return cutoff;
}

/**
 * NFR-11 (Nghị định 13/2023/NĐ-CP) — leads that never reached a paid order and have sat
 * untouched for 12 months get their personal-data columns scrubbed automatically. Orders/
 * payments are untouched (accounting evidence, NFR-11). A tenant can opt out via
 * `organizations.settings.leadRetentionAnonymizeDisabled`.
 */
export async function runLeadRetention(
  env: Bindings,
  now: Date = new Date()
): Promise<{ orgsProcessed: number; leadsAnonymized: number }> {
  const db = createDbFromEnv(env);
  const cutoff = retentionCutoff(now);
  const orgs = await organizationsRepository.listAll(db);

  const anonymizedPerOrg = await Promise.all(
    orgs.map(async (org) => {
      const settings = orgSettingsSchema.parse(org.settings ?? {});
      if (settings.leadRetentionAnonymizeDisabled) return 0;

      try {
        const candidates = await leadsRepository.listRetentionCandidates(
          db,
          org.id,
          cutoff
        );
        await Promise.all(
          candidates.map(async (lead) => {
            await leadsRepository.anonymize(db, org.id, lead.id);
            await leadActivitiesRepository.insert(db, org.id, {
              leadId: lead.id,
              type: "system",
              body: null,
              meta: { kind: "anonymized", reason: "retention" },
              actorId: null
            });
            await auditLogsRepository.insert(db, org.id, {
              actorId: null,
              action: "lead.retention_anonymize",
              targetType: "lead",
              targetId: lead.id,
              meta: {}
            });
          })
        );
        return candidates.length;
      } catch (err) {
        log("error", {
          requestId: "lead-retention",
          orgId: org.id,
          message: "lead retention run failed",
          error: err instanceof Error ? err.message : String(err)
        });
        return 0;
      }
    })
  );

  return {
    orgsProcessed: orgs.length,
    leadsAnonymized: anonymizedPerOrg.reduce((sum, n) => sum + n, 0)
  };
}
