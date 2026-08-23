import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useIsMobile } from "@dv/ui/hooks/use-mobile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

import { EMPTY_PIPELINE, fetchLeadsExport, fetchPipeline } from "../api";
import { downloadBlob } from "../csv";
import { filtersToSearch, searchToFilters, toLeadListQuery } from "../filters";
import { leadKeys } from "../query-keys";
import { LeadDetailSheet } from "./lead-detail-sheet";
import { LeadsFilterBar } from "./leads-filter-bar";
import { LeadsImportDialog } from "./leads-import-dialog";
import { LeadsKanban } from "./leads-kanban";
import { LeadsPageLayout } from "./leads-page-layout";
import { LeadsTable } from "./leads-table";

const PAGE_SIZE = 20;

// `getRouteApi` (not the `Route` object) avoids a circular import between the route file and
// this component — same pattern as `features/studio/components/studio-page.tsx`.
const routeApi = getRouteApi("/_authenticated/leads/");

export function LeadsPage() {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const filters = searchToFilters(search);
  const view = isMobile ? "list" : (search.view ?? "list");

  const { data: pipeline } = useQuery({
    queryKey: leadKeys.pipeline(),
    queryFn: fetchPipeline
  });

  const exportCsv = useMutation({
    mutationFn: () => fetchLeadsExport(toLeadListQuery(filters, 1, PAGE_SIZE)),
    onSuccess: (blob) =>
      downloadBlob(`leads-${new Date().toISOString().slice(0, 10)}.csv`, blob),
    onError: () =>
      toast.add({ title: m.leadsExportErrorToast(), type: "error" })
  });

  function updateFilters(next: typeof filters) {
    setPage(1);
    void navigate({
      search: { ...filtersToSearch(next), view: search.view },
      replace: true
    });
  }

  return (
    <LeadsPageLayout>
      <Card>
        <CardHeader>
          <CardTitle>{m.leadsTitle()}</CardTitle>
          <CardDescription>{m.leadsDescription()}</CardDescription>
          <CardAction className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={exportCsv.isPending}
              onClick={() => exportCsv.mutate()}
            >
              <Download />
              {exportCsv.isPending ? m.commonLoading() : m.leadsExportButton()}
            </Button>
            <LeadsImportDialog />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LeadsFilterBar
            value={filters}
            onChange={updateFilters}
            onApplySavedView={(savedFilters) => updateFilters(savedFilters)}
          />
          <Tabs
            value={view}
            onValueChange={(next) =>
              void navigate({
                search: { ...search, view: next as "list" | "kanban" },
                replace: true
              })
            }
          >
            {!isMobile && (
              <TabsList>
                <TabsTrigger value="list">{m.leadsViewList()}</TabsTrigger>
                <TabsTrigger value="kanban">{m.leadsViewKanban()}</TabsTrigger>
              </TabsList>
            )}
            <TabsContent value="list">
              <LeadsTable
                key={JSON.stringify(filters)}
                query={toLeadListQuery(filters, page, PAGE_SIZE)}
                pipeline={pipeline ?? EMPTY_PIPELINE}
                onPageChange={setPage}
                onOpenLead={(lead) => setSelectedLeadId(lead.id)}
              />
            </TabsContent>
            {!isMobile && (
              <TabsContent value="kanban">
                <LeadsKanban
                  query={toLeadListQuery(filters, 1, PAGE_SIZE)}
                  pipeline={pipeline ?? EMPTY_PIPELINE}
                  onOpenLead={(lead) => setSelectedLeadId(lead.id)}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <LeadDetailSheet
        leadId={selectedLeadId}
        onOpenChange={(open) => !open && setSelectedLeadId(null)}
      />
    </LeadsPageLayout>
  );
}
