import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { LeadsPage } from "@/features/leads/components/leads-page";

const inboxSearchSchema = z.object({
  view: z.enum(["list", "kanban"]).optional(),
  search: z.string().optional(),
  campaignId: z.string().optional(),
  productId: z.string().optional(),
  utmSource: z.string().optional(),
  assigneeId: z.string().optional(),
  paid: z.enum(["true", "false"]).optional(),
  repeatCustomer: z.enum(["true"]).optional(),
  stage: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  selectedLeadId: z.string().optional()
});

function InboxPage() {
  return <LeadsPage surface="inbox" />;
}

export const Route = createFileRoute("/_authenticated/inbox/")({
  validateSearch: inboxSearchSchema,
  component: InboxPage
});
