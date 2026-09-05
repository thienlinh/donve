import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { LeadsPage } from "@/features/leads/components/leads-page";

/** Filter-bar + view-toggle state lives in the URL so a saved view (or an ad-hoc filter set) is
 * shareable via link (product ask, see saved-views UX). Kept as plain optional strings — same
 * shape as `LeadFilterState`, converted through `toLeadListQuery` at fetch time. */
const leadsSearchSchema = z.object({
  view: z.enum(["list", "kanban"]).optional(),
  search: z.string().optional(),
  campaignId: z.string().optional(),
  productId: z.string().optional(),
  utmSource: z.string().optional(),
  assigneeId: z.string().optional(),
  paid: z.enum(["true", "false"]).optional(),
  repeatCustomer: z.enum(["true"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  selectedLeadId: z.string().optional()
});

export const Route = createFileRoute("/_authenticated/leads/")({
  validateSearch: leadsSearchSchema,
  component: LeadsPage
});
