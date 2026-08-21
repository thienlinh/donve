import {
  Card,
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

import { EMPTY_PIPELINE, fetchPipeline } from "../api";
import { emptyLeadFilters, toLeadListQuery } from "../filters";
import { leadKeys } from "../query-keys";
import { LeadDetailSheet } from "./lead-detail-sheet";
import { LeadsFilterBar } from "./leads-filter-bar";
import { LeadsImportDialog } from "./leads-import-dialog";
import { LeadsKanban } from "./leads-kanban";
import { LeadsTable } from "./leads-table";

const PAGE_SIZE = 20;

export function LeadsPage() {
  const [filters, setFilters] = useState(emptyLeadFilters);
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const { data: pipeline } = useQuery({
    queryKey: leadKeys.pipeline(),
    queryFn: fetchPipeline
  });

  function updateFilters(next: typeof filters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{m.leadsTitle()}</CardTitle>
            <CardDescription>{m.leadsDescription()}</CardDescription>
          </div>
          <LeadsImportDialog />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LeadsFilterBar value={filters} onChange={updateFilters} />
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">{m.leadsViewList()}</TabsTrigger>
              <TabsTrigger value="kanban">{m.leadsViewKanban()}</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <LeadsTable
                query={toLeadListQuery(filters, page, PAGE_SIZE)}
                pipeline={pipeline ?? EMPTY_PIPELINE}
                onPageChange={setPage}
                onOpenLead={(lead) => setSelectedLeadId(lead.id)}
              />
            </TabsContent>
            <TabsContent value="kanban">
              <LeadsKanban
                query={toLeadListQuery(filters, 1, PAGE_SIZE)}
                pipeline={pipeline ?? EMPTY_PIPELINE}
                onOpenLead={(lead) => setSelectedLeadId(lead.id)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <LeadDetailSheet
        leadId={selectedLeadId}
        onOpenChange={(open) => !open && setSelectedLeadId(null)}
      />
    </div>
  );
}
