import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";
import { orgIsolationOrNullPolicy } from "./rls.js";

export const emailLogs = pgTable(
  "email_logs",
  {
    id: id(),
    orgId: uuid("org_id"), // null for pre-org email (signup verification)
    to: text("to").notNull(),
    template: text("template").notNull(),
    resendId: text("resend_id"),
    status: text("status", {
      enum: ["queued", "sent", "delivered", "bounced", "failed"]
    })
      .notNull()
      .default("queued"),
    createdAt: timestamps.createdAt
  },
  (t) => [
    index("ix_email_org_time").on(t.orgId, t.createdAt),
    // orgId is nullable by design (pre-org signup email) — orgIsolationOrNullPolicy lets a
    // NULL-org row through unscoped while still enforcing org match once orgId is set.
    orgIsolationOrNullPolicy()
  ]
).enableRLS();
