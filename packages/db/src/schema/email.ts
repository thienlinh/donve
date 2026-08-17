import { index, pgTable, text } from "drizzle-orm/pg-core";

import { id, timestamps } from "./columns.js";

export const emailLogs = pgTable(
  "email_logs",
  {
    id: id(),
    orgId: text("org_id"), // null for pre-org email (signup verification)
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
  (t) => [index("ix_email_org_time").on(t.orgId, t.createdAt)]
);
