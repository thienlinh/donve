import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { StudioPage } from "@/features/studio/components/studio-page";

// FR-B-21: the prompt bar's full text (its `name` on the created record is truncated to 120
// chars) rides here as a one-shot search param so the pending-state page can call `/generate`
// with it. Cleared from the URL once the call fires (see studio-page.tsx).
// FR-B-31: an import landed here with gaps the "chuẩn hoá phễu" wizard should offer to fix —
// carried the same one-shot way, cleared once the banner is dismissed/actioned.
const studioSearchSchema = z.object({
  prompt: z.string().optional(),
  missingLeadForm: z.boolean().optional(),
  missingSeoMeta: z.boolean().optional()
});

export const Route = createFileRoute("/_authenticated/landings/$id/studio")({
  validateSearch: studioSearchSchema,
  component: StudioPage
});
