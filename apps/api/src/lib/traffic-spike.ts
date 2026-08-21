import { eventsRepository } from "@dv/db";
import { email } from "@dv/drivers";

import type { Bindings } from "../types.js";
import { createDbFromEnv } from "./db.js";
import { log } from "./logger.js";

// NFR-14: "vượt >10x request/ngày so với trung bình 7 ngày trước" — alert only, never block.
const SPIKE_MULTIPLIER = 10;
const DAY_MS = 24 * 60 * 60 * 1000;
// Below this, a day's count is too small for a x10 ratio to mean anything (e.g. 1 -> 11
// request is "10x" but not a real spike) — same reasoning as lead-digest's FIRST_RUN_WINDOW_MS
// guard against noise on thin data.
const MIN_TODAY_COUNT = 50;

/**
 * NFR-14 — once/day, compares each hostname's request count for "today so far" against its
 * trailing-7-day average and emails the founder (no auto-block) when it's >10x. Meant to run
 * late in the UTC day so "today" is nearly complete before the comparison.
 */
export async function runTrafficSpikeCheck(
  env: Bindings,
  now: Date = new Date()
): Promise<{ hostnamesChecked: number; alertsSent: number }> {
  if (!env.RESEND_API_KEY || !env.FOUNDER_ALERT_EMAIL) {
    return { hostnamesChecked: 0, alertsSent: 0 };
  }
  const db = createDbFromEnv(env);
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const trailingStart = new Date(todayStart.getTime() - 7 * DAY_MS);

  const [today, trailing] = await Promise.all([
    eventsRepository.countByHostnameInRange(db, todayStart, now),
    eventsRepository.countByHostnameInRange(db, trailingStart, todayStart)
  ]);
  const trailingByHost = new Map(
    trailing.map((row) => [row.hostname, row.count])
  );

  const sender = email.createResendEmailSender({ apiKey: env.RESEND_API_KEY });
  const founderEmail = env.FOUNDER_ALERT_EMAIL;
  const sent = await Promise.all(
    today.map(async ({ hostname, count: todayCount }) => {
      if (todayCount < MIN_TODAY_COUNT) return false;
      const trailingAverage = (trailingByHost.get(hostname) ?? 0) / 7;
      if (trailingAverage <= 0) return false;
      const multiplier = todayCount / trailingAverage;
      if (multiplier < SPIKE_MULTIPLIER) return false;

      try {
        await sender.send({
          to: founderEmail,
          template: "traffic_spike_alert",
          props: { hostname, todayCount, trailingAverage, multiplier }
        });
        return true;
      } catch (err) {
        log("error", {
          requestId: "traffic-spike",
          orgId: null,
          message: "traffic spike alert send failed",
          hostname,
          error: err instanceof Error ? err.message : String(err)
        });
        return false;
      }
    })
  );
  return {
    hostnamesChecked: today.length,
    alertsSent: sent.filter(Boolean).length
  };
}
