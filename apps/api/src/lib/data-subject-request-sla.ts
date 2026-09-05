import {
  dataSubjectRequestsRepository,
  emailLogsRepository,
  leadsRepository,
  membershipsRepository,
  organizationsRepository,
  schema,
  type Db
} from "@dv/db";
import { email } from "@dv/drivers";
import { eq } from "drizzle-orm";

import type { Bindings } from "../types.js";
import { createDbFromEnv } from "./db.js";
import { log } from "./logger.js";

type OrgRow = Awaited<
  ReturnType<typeof organizationsRepository.listAll>
>[number];

// NFR-10 (Nghị định 13/2023/NĐ-CP) — pending delete/export requests due within this window
// (or already overdue) go into the daily summary; comfortably clears of the 72h SLA before
// the org's actual deadline passes unnoticed.
const DUE_SOON_WINDOW_MS = 24 * 60 * 60 * 1000;

async function resolveUserEmail(
  db: Db,
  userId: string
): Promise<string | null> {
  const rows = await db.raw
    .select({ email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.id, userId))
    .limit(1);
  return rows[0]?.email ?? null;
}

/** owner + admin, same rationale as lead-digest's owner fallback — this is a compliance
 * deadline, so it goes to everyone who can act on it, not just the owner. */
async function resolveOwnerAndAdminEmails(
  db: Db,
  orgId: string
): Promise<string[]> {
  const [owners, admins] = await Promise.all([
    membershipsRepository.listByRole(db, orgId, "owner"),
    membershipsRepository.listByRole(db, orgId, "admin")
  ]);
  const emails = await Promise.all(
    [...owners, ...admins].map((member) => resolveUserEmail(db, member.userId))
  );
  return [...new Set(emails.filter((e): e is string => Boolean(e)))];
}

async function runSlaCheckForOrg(
  db: Db,
  env: Bindings,
  sender: email.EmailSender,
  org: OrgRow,
  now: Date
): Promise<number> {
  const pending = await dataSubjectRequestsRepository.listPending(db, org.id);
  const dueSoonCutoff = new Date(now.getTime() + DUE_SOON_WINDOW_MS);
  const affected = pending.filter((r) => r.dueAt <= dueSoonCutoff);
  if (affected.length === 0) return 0;

  const recipients = await resolveOwnerAndAdminEmails(db, org.id);
  if (recipients.length === 0) return 0;

  const requests = await Promise.all(
    affected.map(async (r) => {
      const lead = await leadsRepository.findById(db, org.id, r.leadId);
      return {
        leadFullName: lead?.fullName ?? "?",
        requestType: r.requestType,
        dueAt: r.dueAt.toISOString(),
        overdue: r.dueAt <= now
      };
    })
  );

  const sent = await Promise.all(
    recipients.map(async (recipient) => {
      const result = await sender.send({
        to: recipient,
        template: "data_subject_request_sla",
        props: {
          orgName: org.name,
          appUrl: `${env.APP_URL}/leads`,
          requests
        }
      });
      await emailLogsRepository.insert(db, {
        orgId: org.id,
        to: recipient,
        template: "data_subject_request_sla",
        resendId: result.id,
        status: "sent"
      });
      return true;
    })
  );
  return sent.filter(Boolean).length;
}

/**
 * NFR-10/NFR-12 — once/day, finds every org's `pending` data-subject requests that are
 * overdue or due within 24h and emails one summary to that org's owner/admin (the org is
 * the data controller responsible for its own 72h response SLA, not the platform).
 */
export async function runDataSubjectRequestSlaCheck(
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
        return await runSlaCheckForOrg(db, env, sender, org, now);
      } catch (err) {
        log("error", {
          requestId: "data-subject-request-sla",
          orgId: org.id,
          message: "data subject request SLA check failed",
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
