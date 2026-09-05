import { decryptApiKey, importMasterKey } from "@dv/ai-gateway";
import { orgSettingsSchema } from "@dv/contracts";
import {
  assignmentRulesRepository,
  leadActivitiesRepository,
  leadsRepository,
  notifyCredentialsRepository,
  organizationsRepository,
  type Db
} from "@dv/db";
import { email, notify } from "@dv/drivers";

import {
  ruleMatches,
  type AssignmentRule,
  type Lead
} from "../modules/leads/routing.js";
import type { Bindings } from "../types.js";
import { createDbFromEnv } from "./db.js";
import { log } from "./logger.js";
import { resolveOwnerEmail } from "./user-email.js";

type OrgRow = Awaited<
  ReturnType<typeof organizationsRepository.listAll>
>[number];

interface OrgNotifyTarget {
  channel: notify.NotifyChannel;
  target: notify.NotifyTarget;
}

/** The email fallback every org gets when it hasn't configured (or picked) a BYOK channel —
 * same "no key configured, skip sending" guard as `runLeadDigest`. */
async function resolveEmailFallback(
  db: Db,
  org: OrgRow,
  env: Bindings
): Promise<OrgNotifyTarget> {
  const sender = env.RESEND_API_KEY
    ? email.createResendEmailSender({ apiKey: env.RESEND_API_KEY })
    : { send: () => Promise.resolve({ id: null }) };
  return {
    channel: notify.createEmailNotifyChannel(sender),
    target: { email: await resolveOwnerEmail(db, org.id) }
  };
}

/**
 * Resolves which `notify_manager` channel an org actually gets, per its own
 * `organizations.settings.notifyChannel` choice (packages/contracts/src/tenancy.ts) — falls
 * back to email whenever the chosen BYOK channel has no credential configured yet or
 * `NOTIFY_KEY_MASTER_SECRET` isn't set, rather than silently dropping the alert.
 */
async function resolveOrgNotifyTarget(
  db: Db,
  org: OrgRow,
  env: Bindings
): Promise<OrgNotifyTarget> {
  const settings = orgSettingsSchema.parse(org.settings ?? {});
  const channelKind = settings.notifyChannel ?? "email";
  if (channelKind === "email" || !env.NOTIFY_KEY_MASTER_SECRET) {
    return resolveEmailFallback(db, org, env);
  }

  const provider = channelKind === "zalo_zns" ? "zalo_zns" : "esms";
  const credential = await notifyCredentialsRepository.findByOrgAndProvider(
    db,
    org.id,
    provider
  );
  if (!credential) return resolveEmailFallback(db, org, env);

  const masterKey = await importMasterKey(env.NOTIFY_KEY_MASTER_SECRET);
  const secretJson = await decryptApiKey(credential.encryptedSecret, masterKey);
  const target: notify.NotifyTarget = { phone: settings.notifyPhone ?? null };

  if (provider === "zalo_zns") {
    const { accessToken } = JSON.parse(secretJson) as { accessToken: string };
    return {
      channel: notify.createZaloZnsNotifyChannel({
        accessToken,
        templateId: credential.config?.templateId ?? ""
      }),
      target
    };
  }
  const { apiKey, secretKey } = JSON.parse(secretJson) as {
    apiKey: string;
    secretKey: string;
  };
  return {
    channel: notify.createEsmsNotifyChannel({
      apiKey,
      secretKey,
      brandname: credential.config?.brandname
    }),
    target
  };
}

/** A `system` activity's `meta.kind` marks the SLA clock's state for a lead:
 * `"assignment"` (written by both `routeLead` and the manual assignee-change endpoint) means a
 * fresh clock started at that moment; `"sla_breach"` (written below) means the CURRENT clock
 * already triggered once. The newest of either marker wins — if it's `"sla_breach"`, this sweep
 * already acted on the lead's present assignment and must not act again; if it's `"assignment"`
 * (or neither marker exists yet), the lead is eligible. This is what makes a sweep that runs
 * every 30 minutes safe to re-run against a lead that's still breaching 3 sweeps in a row. */
async function alreadyBreachedSinceLastAssignment(
  db: Db,
  orgId: string,
  leadId: string
): Promise<boolean> {
  const activities = await leadActivitiesRepository.listForLead(
    db,
    orgId,
    leadId
  );
  for (const activity of activities) {
    const kind = (activity.meta as { kind?: string } | null)?.kind;
    if (kind === "sla_breach") return true;
    if (kind === "assignment") return false;
  }
  return false;
}

async function applyBreach(
  db: Db,
  org: OrgRow,
  rule: AssignmentRule,
  lead: Lead,
  orgNotify: OrgNotifyTarget | null,
  appUrl: string
): Promise<void> {
  const orgId = org.id;
  if (rule.onSlaBreach === "reassign_next_in_pool") {
    const pool = rule.assigneePoolIds ?? [];
    const currentIndex = pool.indexOf(lead.assigneeId ?? "");
    const next =
      currentIndex >= 0 && pool.length > 1
        ? pool[(currentIndex + 1) % pool.length]
        : null;

    if (next && next !== lead.assigneeId) {
      await leadsRepository.update(db, orgId, lead.id, { assigneeId: next });
      await leadActivitiesRepository.insert(db, orgId, {
        leadId: lead.id,
        type: "system",
        body: `Quá SLA (${rule.slaHours}h không hoạt động) — tự động chuyển sang người kế tiếp trong nhóm`,
        meta: {
          kind: "sla_breach",
          ruleId: rule.id,
          from: lead.assigneeId,
          to: next
        },
        actorId: null
      });
      return;
    }
    // Empty/single-member pool — nothing to rotate to. Still log the breach so it isn't
    // silently re-evaluated forever without a visible trail (and so the marker above makes
    // this a no-op on the next sweep, same as the reassign path).
    await leadActivitiesRepository.insert(db, orgId, {
      leadId: lead.id,
      type: "system",
      body: `Quá SLA (${rule.slaHours}h không hoạt động) — không có người kế tiếp trong nhóm để tự động chuyển`,
      meta: {
        kind: "sla_breach",
        ruleId: rule.id,
        from: lead.assigneeId,
        to: null
      },
      actorId: null
    });
    return;
  }

  // `notify_manager` — activity-timeline entry plus an actual push via the channel-agnostic
  // notify dispatcher (packages/drivers/src/notify) — email, Zalo ZNS, or SMS per the org's
  // own `notifyChannel` setting (resolved once per org by `resolveOrgNotifyTarget`, not per lead).
  await leadActivitiesRepository.insert(db, orgId, {
    leadId: lead.id,
    type: "system",
    body: `Quá SLA (${rule.slaHours}h không hoạt động) — cần quản lý chú ý`,
    meta: {
      kind: "sla_breach",
      ruleId: rule.id,
      from: lead.assigneeId,
      to: lead.assigneeId
    },
    actorId: null
  });

  // `orgNotify` is only null when this org's active rules have no `notify_manager` at all
  // (`sweepOrg`'s guard) — impossible to reach here in that case, since this branch only runs
  // for a rule with `onSlaBreach === "notify_manager"`.
  if (!orgNotify) return;
  const { channel, target } = orgNotify;
  if (channel.canSend(target)) {
    await channel.send(target, {
      type: "sla_breach",
      props: {
        orgName: org.name,
        appUrl,
        leadFullName: lead.fullName,
        slaHours: rule.slaHours ?? 0
      }
    });
  }
}

async function sweepOrg(
  db: Db,
  org: OrgRow,
  env: Bindings,
  appUrl: string
): Promise<number> {
  const rules = await assignmentRulesRepository.listActive(db, org.id);
  if (!rules.some((rule) => rule.slaHours != null)) return 0;

  const leads = await leadsRepository.listOpenAssigned(db, org.id);
  // Resolved once per org (not per lead) — skipped entirely for an org whose active rules are
  // all `reassign_next_in_pool`, since only `notify_manager` ever reads it.
  const orgNotify = rules.some((rule) => rule.onSlaBreach === "notify_manager")
    ? await resolveOrgNotifyTarget(db, org, env)
    : null;

  // Each lead's breach handling only reads/writes that lead's own row + activity trail — safe
  // to run concurrently across leads (unlike within one lead, where order matters).
  const results = await Promise.all(
    leads.map(async (lead) => {
      try {
        const rule = rules.find((candidate) => ruleMatches(candidate, lead));
        if (!rule?.slaHours || !rule.onSlaBreach) return false;
        if (lead.hoursSinceActivity < rule.slaHours) return false;

        const alreadyHandled = await alreadyBreachedSinceLastAssignment(
          db,
          org.id,
          lead.id
        );
        if (alreadyHandled) return false;

        await applyBreach(db, org, rule, lead, orgNotify, appUrl);
        return true;
      } catch (err) {
        log("error", {
          requestId: "lead-sla-sweep",
          orgId: org.id,
          message: "SLA breach handling failed for one lead",
          leadId: lead.id,
          error: err instanceof Error ? err.message : String(err)
        });
        return false;
      }
    })
  );
  return results.filter(Boolean).length;
}

/**
 * FR-E follow-up — every 30 minutes, finds every org's open+assigned leads that have exceeded
 * their matched `assignmentRules.slaHours` and applies `onSlaBreach` (reassign to the next pool
 * member, or just flag for a manager). SLA is measured in hours, so 30-minute granularity is
 * plenty — this isn't a near-realtime alert path.
 */
export async function runLeadSlaSweep(
  env: Bindings
): Promise<{ orgsProcessed: number; leadsBreached: number }> {
  const db = createDbFromEnv(env);
  const orgs = await organizationsRepository.listAll(db);
  const appUrl = `${env.APP_URL}/leads`;

  const perOrg = await Promise.all(
    orgs.map(async (org) => {
      try {
        return await sweepOrg(db, org, env, appUrl);
      } catch (err) {
        log("error", {
          requestId: "lead-sla-sweep",
          orgId: org.id,
          message: "SLA sweep failed for org",
          error: err instanceof Error ? err.message : String(err)
        });
        return 0;
      }
    })
  );
  return {
    orgsProcessed: orgs.length,
    leadsBreached: perOrg.reduce((sum, n) => sum + n, 0)
  };
}
