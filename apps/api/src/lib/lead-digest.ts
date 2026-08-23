import { orgSettingsSchema } from "@dv/contracts";
import {
  emailLogsRepository,
  leadsRepository,
  organizationsRepository,
  type Db
} from "@dv/db";
import { email } from "@dv/drivers";

import type { Bindings } from "../types.js";
import { createDbFromEnv } from "./db.js";
import { log } from "./logger.js";
import { resolveOwnerEmail, resolveUserEmail } from "./user-email.js";

type OrgRow = Awaited<
  ReturnType<typeof organizationsRepository.listAll>
>[number];
type LeadRow = Awaited<
  ReturnType<typeof leadsRepository.listFiltered>
>["rows"][number];

// "cuối ngày" (FR-I-03) — fires once per UTC day at this hour; 15:00 UTC = 22:00 ICT.
const DAILY_DIGEST_HOUR_UTC = 15;
// First-ever run for an org has no prior `lead_digest` email_logs cursor — bound the
// lookback instead of dumping the org's entire lead history into one email.
const FIRST_RUN_WINDOW_MS = 24 * 60 * 60 * 1000;

function groupByAssignee(leads: LeadRow[]): Map<string, LeadRow[]> {
  const groups = new Map<string, LeadRow[]>();
  for (const lead of leads) {
    const key = lead.assigneeId ?? "unassigned";
    const group = groups.get(key);
    if (group) group.push(lead);
    else groups.set(key, [lead]);
  }
  return groups;
}

async function runDigestForOrg(
  db: Db,
  env: Bindings,
  sender: email.EmailSender,
  org: OrgRow,
  now: Date
): Promise<number> {
  const settings = orgSettingsSchema.parse(org.settings ?? {});
  const frequency = settings.leadDigestFrequency ?? "hourly";
  if (frequency === "daily" && now.getUTCHours() !== DAILY_DIGEST_HOUR_UTC) {
    return 0;
  }

  const lastSent = await emailLogsRepository.findLatestByOrgAndTemplate(
    db,
    org.id,
    "lead_digest"
  );
  const windowStart =
    lastSent?.createdAt ?? new Date(now.getTime() - FIRST_RUN_WINDOW_MS);

  // ponytail: single page, cap 500 — an org clearing 500 new leads inside one digest
  // window is not a case worth a pagination loop for a P1 batching feature.
  const { rows: leads } = await leadsRepository.listFiltered(db, org.id, {
    dateFrom: windowStart,
    dateTo: now,
    page: 1,
    pageSize: 500
  });
  if (leads.length === 0) return 0;

  const sent = await Promise.all(
    Array.from(groupByAssignee(leads)).map(async ([assigneeId, groupLeads]) => {
      const recipient =
        assigneeId === "unassigned"
          ? await resolveOwnerEmail(db, org.id)
          : await resolveUserEmail(db, assigneeId);
      if (!recipient) return false;

      const result = await sender.send({
        to: recipient,
        template: "lead_digest",
        props: {
          orgName: org.name,
          dashboardUrl: `${env.DASHBOARD_URL}/leads`,
          leads: groupLeads.map((lead) => ({
            fullName: lead.fullName,
            phone: lead.phone,
            createdAt: lead.createdAt.toISOString()
          }))
        }
      });
      await emailLogsRepository.insert(db, {
        orgId: org.id,
        to: recipient,
        template: "lead_digest",
        resendId: result.id,
        status: "sent"
      });
      return true;
    })
  );
  return sent.filter(Boolean).length;
}

/**
 * FR-I-03 — batches new leads per assignee (org owner fallback when unassigned) into one
 * email per configured window (org.settings.leadDigestFrequency, default hourly) instead
 * of emailing each lead individually. Sender/domain reused as-is from FR-I-05/06
 * (`email.createResendEmailSender`'s locked `no-reply@mail.donve.vn`).
 */
export async function runLeadDigest(
  env: Bindings,
  now: Date = new Date()
): Promise<{ orgsProcessed: number; emailsSent: number }> {
  if (!env.RESEND_API_KEY) {
    return { orgsProcessed: 0, emailsSent: 0 };
  }
  const db = createDbFromEnv(env);
  const sender = email.createResendEmailSender({ apiKey: env.RESEND_API_KEY });
  const orgs = await organizationsRepository.listAll(db);

  const sentPerOrg = await Promise.all(
    orgs.map(async (org) => {
      try {
        return await runDigestForOrg(db, env, sender, org, now);
      } catch (err) {
        log("error", {
          requestId: "lead-digest",
          orgId: org.id,
          message: "lead digest run failed",
          error: err instanceof Error ? err.message : String(err)
        });
        return 0;
      }
    })
  );
  return {
    orgsProcessed: orgs.length,
    emailsSent: sentPerOrg.reduce((sum, n) => sum + n, 0)
  };
}
