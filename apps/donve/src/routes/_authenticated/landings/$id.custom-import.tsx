import { createFileRoute } from "@tanstack/react-router";

import { CustomImportPage } from "@/features/custom-import/components/custom-import-page";

export const Route = createFileRoute(
  "/_authenticated/landings/$id/custom-import"
)({
  component: CustomImportPage
});
