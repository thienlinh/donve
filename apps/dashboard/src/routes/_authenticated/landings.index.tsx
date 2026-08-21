import type {
  ImportLandingPageResponse,
  LandingPageListItem
} from "@dv/contracts";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@dv/ui/components/shadcn/select";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { toast } from "@dv/ui/components/shadcn/toast";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@dv/ui/components/shadcn/toggle-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";

import { authClient } from "@/features/auth/auth-client";
import { createLandingPage, fetchLandingPages } from "@/features/studio/api";
import { ImportLandingDialog } from "@/features/studio/components/import-dialog";
import { LandingCard } from "@/features/studio/components/landing-card";
import { LandingPromptBar } from "@/features/studio/components/landing-prompt-bar";
import { OnboardingChecklist } from "@/features/studio/components/onboarding-checklist";
import { landingKeys } from "@/features/studio/query-keys";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authenticated/landings/")({
  // FR-A-02: a fresh signup has zero orgs — send them to create one first.
  // Only this route (the post-login front door) checks; /onboarding itself
  // doesn't, so it stays reachable regardless of org count.
  beforeLoad: async () => {
    const { data: organizations } = await authClient.organization.list();
    if (!organizations || organizations.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: LandingsPage
});

type StatusFilter = "all" | "published" | "draft";
type SortOrder = "updated" | "name";

// Grid virtualizes only past this many cards (studio-builder-spec.md §2) — below it the
// plain responsive grid is simpler and just as fast.
const VIRTUALIZE_THRESHOLD = 30;

function LandingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery({
    queryKey: landingKeys.list(),
    queryFn: fetchLandingPages
  });

  const createMutation = useMutation({
    mutationFn: (input: { name: string; prompt: string }) =>
      createLandingPage({ name: input.name }),
    onSuccess: (created, input) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      navigate({
        to: "/landings/$id/studio",
        params: { id: created.id },
        search: { prompt: input.prompt }
      });
    },
    onError: () =>
      toast.add({ title: m.landingsCreateErrorToast(), type: "error" })
  });

  async function handlePromptSubmit(prompt: string) {
    try {
      await createMutation.mutateAsync({ name: prompt.slice(0, 120), prompt });
    } catch {
      // surfaced via createMutation's onError toast
    }
  }

  // FR-B-30/31: land straight in Studio, same as a fresh generate — `funnelGaps` rides the
  // URL as a one-shot search param so the studio page can offer the "chuẩn hoá phễu" wizard.
  // (list invalidation already happened in ImportLandingDialog's own mutation)
  function handleImported(result: ImportLandingPageResponse) {
    navigate({
      to: "/landings/$id/studio",
      params: { id: result.id },
      search: {
        missingLeadForm: result.funnelGaps.missingLeadForm || undefined,
        missingSeoMeta: result.funnelGaps.missingSeoMeta || undefined
      }
    });
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner /> {m.commonLoading()}
      </div>
    );
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{m.landingsLoadErrorTitle()}</EmptyTitle>
          <EmptyDescription>{error.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // Empty state (org mới, chưa có landing nào): prompt bar chiếm giữa màn hình, không có grid.
  if (data.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-center text-2xl font-semibold">
          {m.landingsPromptHeading()}
        </h1>
        <div className="w-full max-w-xl">
          <LandingPromptBar onSubmit={handlePromptSubmit} />
        </div>
        <ImportLandingDialog onImported={handleImported} />
        <div className="w-full max-w-xl">
          <OnboardingChecklist landingPages={data} />
        </div>
      </div>
    );
  }

  return (
    <LandingsGallery
      landingPages={data}
      onPromptSubmit={handlePromptSubmit}
      onImported={handleImported}
    />
  );
}

function LandingsGallery({
  landingPages,
  onPromptSubmit,
  onImported
}: {
  landingPages: LandingPageListItem[];
  onPromptSubmit: (prompt: string) => void | Promise<void>;
  onImported: (result: ImportLandingPageResponse) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("updated");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const campaignOptions = useMemo(() => {
    const byId = new Map<string, string>();
    for (const lp of landingPages) {
      if (lp.campaignId && lp.campaignName) {
        byId.set(lp.campaignId, lp.campaignName);
      }
    }
    return [...byId.entries()].map(([id, name]) => ({ id, name }));
  }, [landingPages]);

  const filtered = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();
    return landingPages
      .filter(
        (lp) =>
          statusFilter === "all" ||
          (statusFilter === "published") === lp.isPublished
      )
      .filter(
        (lp) => campaignFilter === "all" || lp.campaignId === campaignFilter
      )
      .filter((lp) => search === "" || lp.name.toLowerCase().includes(search))
      .toSorted((a, b) =>
        sortOrder === "name"
          ? a.name.localeCompare(b.name)
          : b.updatedAt.getTime() - a.updatedAt.getTime()
      );
  }, [landingPages, statusFilter, campaignFilter, debouncedSearch, sortOrder]);

  const statusToggleValue = useMemo(() => [statusFilter], [statusFilter]);

  return (
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
      <div className="flex flex-col gap-3 p-6 lg:w-80 lg:shrink-0">
        <h1 className="text-lg font-semibold">{m.landingsPromptHeading()}</h1>
        <LandingPromptBar onSubmit={onPromptSubmit} />
        <ImportLandingDialog onImported={onImported} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-6">
        <OnboardingChecklist landingPages={landingPages} />

        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            value={statusToggleValue}
            onValueChange={(values) => {
              const next = values[0] as StatusFilter | undefined;
              if (next) setStatusFilter(next);
            }}
          >
            <ToggleGroupItem value="all">
              {m.landingsFilterAll()}
            </ToggleGroupItem>
            <ToggleGroupItem value="published">
              {m.landingsFilterPublished()}
            </ToggleGroupItem>
            <ToggleGroupItem value="draft">
              {m.landingsFilterDraft()}
            </ToggleGroupItem>
          </ToggleGroup>

          {campaignOptions.length > 0 && (
            <Select
              value={campaignFilter}
              onValueChange={(value) => setCampaignFilter(value ?? "all")}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {m.landingsFilterAllCampaigns()}
                </SelectItem>
                {campaignOptions.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={m.landingsSearchPlaceholder()}
            className="w-full max-w-56 sm:ms-auto"
          />

          <Select
            value={sortOrder}
            onValueChange={(value) => value && setSortOrder(value)}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">{m.landingsSortUpdated()}</SelectItem>
              <SelectItem value="name">{m.landingsSortName()}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{m.landingsNoResultsTitle()}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : filtered.length > VIRTUALIZE_THRESHOLD ? (
          <VirtualizedLandingGrid landingPages={filtered} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((lp) => (
              <LandingCard key={lp.id} landingPage={lp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ponytail: fixed 3-column layout for the virtualized branch (only reached past
// VIRTUALIZE_THRESHOLD cards) rather than a responsive column count — the responsive
// 1/2/3-col grid above handles the common (non-virtualized) case.
const VIRTUAL_GRID_COLUMNS = 3;
const VIRTUAL_ROW_HEIGHT = 280;

function VirtualizedLandingGrid({
  landingPages
}: {
  landingPages: LandingPageListItem[];
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = Math.ceil(landingPages.length / VIRTUAL_GRID_COLUMNS);
  // oxlint-disable-next-line react/incompatible-library -- @tanstack/react-virtual returns functions the compiler can't memoize; informational only
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => VIRTUAL_ROW_HEIGHT,
    overscan: 4
  });

  return (
    <div ref={parentRef} className="h-[70vh] overflow-auto">
      <div
        style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * VIRTUAL_GRID_COLUMNS;
          const rowItems = landingPages.slice(
            start,
            start + VIRTUAL_GRID_COLUMNS
          );
          return (
            <div
              key={virtualRow.key}
              className="absolute inset-x-0 grid grid-cols-3 gap-4"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                height: virtualRow.size
              }}
            >
              {rowItems.map((lp) => (
                <LandingCard key={lp.id} landingPage={lp} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
