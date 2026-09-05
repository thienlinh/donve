import type {
  ImportCustomPageResponse,
  LandingPageDetail,
  LandingPageListItem
} from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Empty, EmptyHeader, EmptyTitle } from "@dv/ui/components/shadcn/empty";
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
import { useMediaQuery } from "@dv/ui/hooks/use-media-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Bot, FolderInput, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { QueryState } from "@/components/query-state";
import { CustomImportDialog } from "@/features/custom-import/components/custom-import-dialog";
import * as m from "@/paraglide/messages.js";

import {
  createLandingPage,
  createManualLandingPage,
  fetchLandingPages
} from "../api";
import { landingKeys } from "../query-keys";
import { LandingCard } from "./landing-card";
import { OnboardingChecklist } from "./onboarding-checklist";
import { TemplatePickerDialog } from "./template-picker-dialog";

type StatusFilter = "all" | "published" | "draft";
type SortOrder = "updated" | "name";

export type LandingListFilters = {
  status: StatusFilter;
  campaignId: string;
  search: string;
  sort: SortOrder;
};

type LandingsPageProps = {
  initialFilters?: Partial<LandingListFilters>;
  onFiltersChange?: (filters: LandingListFilters) => void;
  surface?: "landing-pages" | "offers";
};

// Grid virtualizes only past this many cards (studio-builder-spec.md §2) — below it the
// plain responsive grid is simpler and just as fast.
const VIRTUALIZE_THRESHOLD = 30;

export function LandingsPage({
  initialFilters,
  onFiltersChange,
  surface = "landing-pages"
}: LandingsPageProps = {}) {
  const isOfferSurface = surface === "offers";

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, error, isPending, refetch } = useQuery({
    queryKey: landingKeys.list(),
    queryFn: fetchLandingPages
  });

  // `component-library/component-library.md` §Ba con đường tạo trang — thủ công, không AI.
  const createManualMutation = useMutation({
    mutationFn: () => createManualLandingPage({ name: "Trang bán hàng mới" }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      navigate({
        to: "/landings/$id/studio-native",
        params: { id: created.id }
      });
    },
    onError: () =>
      toast.add({ title: m.landingsCreateErrorToast(), type: "error" })
  });

  // `ai/agent-pipeline.md` — the business→strategy→architecture wizard, one of the 3 equal
  // creation paths (`docs/features/landing-pages/technical/ui-ux-design.md` §Chọn chế độ tạo).
  const createWizardMutation = useMutation({
    mutationFn: () =>
      createLandingPage({ name: "Trang bán hàng mới (trợ lý)" }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      navigate({ to: "/landings/$id/business", params: { id: created.id } });
    },
    onError: () =>
      toast.add({ title: m.landingsCreateErrorToast(), type: "error" })
  });

  // `page-system/custom-import.md` — lands on the wire-lead-form/audit/publish page, never
  // the srcmap Studio editor (list invalidation already happened in CustomImportDialog's own
  // mutation, same as `handleImported`).
  function handleCustomImported(result: ImportCustomPageResponse) {
    navigate({
      to: "/landings/$id/custom-import",
      params: { id: result.id }
    });
  }

  function handleCreatedFromTemplate(created: LandingPageDetail) {
    navigate({ to: "/landings/$id/studio-native", params: { id: created.id } });
  }

  if (isPending) {
    return <CardGridSkeleton count={8} />;
  }

  if (error) {
    return (
      <QueryState
        error={error}
        emptyTitle=""
        errorTitle={m.landingsLoadErrorTitle()}
        isEmpty={false}
        isPending={false}
        onRetry={async () => {
          await refetch();
        }}
      />
    );
  }

  const createActions = {
    onCustomImported: handleCustomImported,
    onCreateWizard: () => createWizardMutation.mutate(),
    creatingWizard: createWizardMutation.isPending,
    onCreateManual: () => createManualMutation.mutate(),
    creatingManual: createManualMutation.isPending,
    onCreatedFromTemplate: handleCreatedFromTemplate
  };

  // Empty state (org mới, chưa có landing nào): 3 thẻ chọn chế độ tạo chiếm giữa màn hình,
  // không có grid — `ui-ux-design.md` §Chọn chế độ tạo.
  if (data.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-6 px-4">
        <h1 className="text-center text-2xl font-semibold">
          {m.landingsCreateHeading()}
        </h1>
        <LandingsCreateCards {...createActions} />
        <div className="w-full max-w-xl">
          <OnboardingChecklist landingPages={data} />
        </div>
      </div>
    );
  }

  return (
    <LandingsGallery
      createActions={createActions}
      initialFilters={initialFilters}
      isOfferSurface={isOfferSurface}
      landingPages={data}
      onFiltersChange={onFiltersChange}
    />
  );
}

type CreateActions = {
  onCustomImported: (result: ImportCustomPageResponse) => void;
  onCreateWizard: () => void;
  creatingWizard: boolean;
  onCreateManual: () => void;
  creatingManual: boolean;
  onCreatedFromTemplate: (created: LandingPageDetail) => void;
};

// Compact header actions for the gallery (org already has landing pages) — the equal-weight
// 3-card layout below is reserved for the dedicated "choose creation mode" moment (empty state).
function LandingsCreateActions({
  onCustomImported,
  onCreateWizard,
  creatingWizard,
  onCreateManual,
  creatingManual,
  onCreatedFromTemplate
}: CreateActions) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <CustomImportDialog onImported={onCustomImported} />
      <Button
        variant="outline"
        disabled={creatingWizard}
        onClick={onCreateWizard}
      >
        {creatingWizard ? m.commonLoading() : m.landingsCreateAiButton()}
      </Button>
      <Button
        variant="outline"
        disabled={creatingManual}
        onClick={onCreateManual}
      >
        {m.landingsCreateManualButton()}
      </Button>
      <TemplatePickerDialog onCreated={onCreatedFromTemplate} />
    </div>
  );
}

const CREATE_CARD_CLASS =
  "h-auto w-full flex-col items-start gap-2 whitespace-normal p-6 text-left";

function CreateCardContent({
  icon: Icon,
  title,
  description,
  loading
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <span className="flex w-full items-center justify-center gap-2 py-6">
        <Spinner /> {m.commonLoading()}
      </span>
    );
  }
  return (
    <>
      <Icon className="size-6 text-primary" />
      <span className="font-medium">{title}</span>
      <span className="font-normal text-muted-foreground">{description}</span>
    </>
  );
}

// 3 con đường tạo trang bình đẳng — AI/thủ công/import, cùng kích thước, không badge "Recommended"
// (`ui-ux-design.md` §Chọn chế độ tạo).
function LandingsCreateCards({
  onCustomImported,
  onCreateWizard,
  creatingWizard,
  onCreateManual,
  creatingManual
}: Omit<CreateActions, "onCreatedFromTemplate">) {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
      <Button
        variant="outline"
        className={CREATE_CARD_CLASS}
        disabled={creatingWizard}
        onClick={onCreateWizard}
      >
        <CreateCardContent
          icon={Bot}
          title={m.landingsCreateAiTitle()}
          description={m.landingsCreateAiDescription()}
          loading={creatingWizard}
        />
      </Button>
      <Button
        variant="outline"
        className={CREATE_CARD_CLASS}
        disabled={creatingManual}
        onClick={onCreateManual}
      >
        <CreateCardContent
          icon={Wrench}
          title={m.landingsCreateManualTitle()}
          description={m.landingsCreateManualDescription()}
          loading={creatingManual}
        />
      </Button>
      <CustomImportDialog
        onImported={onCustomImported}
        trigger={
          <Button variant="outline" className={CREATE_CARD_CLASS}>
            <CreateCardContent
              icon={FolderInput}
              title={m.landingsCreateImportTitle()}
              description={m.landingsCreateImportDescription()}
            />
          </Button>
        }
      />
    </div>
  );
}

function LandingsGallery({
  landingPages,
  createActions,
  initialFilters,
  onFiltersChange,
  isOfferSurface
}: {
  landingPages: LandingPageListItem[];
  createActions: CreateActions;
  initialFilters?: Partial<LandingListFilters>;
  onFiltersChange?: (filters: LandingListFilters) => void;
  isOfferSurface: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    initialFilters?.status ?? "all"
  );
  const [campaignFilter, setCampaignFilter] = useState(
    initialFilters?.campaignId ?? "all"
  );
  const [searchInput, setSearchInput] = useState(initialFilters?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    initialFilters?.search ?? ""
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialFilters?.sort ?? "updated"
  );

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    onFiltersChange?.({
      campaignId: campaignFilter,
      search: searchInput,
      sort: sortOrder,
      status: statusFilter
    });
  }, [campaignFilter, onFiltersChange, searchInput, sortOrder, statusFilter]);

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
  const publishedCount = useMemo(
    () => landingPages.filter((lp) => lp.isPublished).length,
    [landingPages]
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isOfferSurface ? m.shellOffersNav() : m.shellLandingsNav()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isOfferSurface
              ? m.campaignsDescription()
              : m.landingsSummaryCount({
                  total: landingPages.length,
                  published: publishedCount
                })}
          </p>
        </div>
        <LandingsCreateActions {...createActions} />
      </header>

      {isOfferSurface && (
        <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          {m.offersSurfaceNotice()}
        </div>
      )}

      <OnboardingChecklist landingPages={landingPages} />

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-3">
        <ToggleGroup
          value={statusToggleValue}
          onValueChange={(values) => {
            const next = values[0] as StatusFilter | undefined;
            if (next) setStatusFilter(next);
          }}
        >
          <ToggleGroupItem value="all">{m.landingsFilterAll()}</ToggleGroupItem>
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
            <SelectTrigger aria-label="Lọc theo chiến dịch" size="sm">
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
          aria-label={m.landingsSearchPlaceholder()}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={m.landingsSearchPlaceholder()}
          className="w-full max-w-56 sm:ms-auto"
        />

        <Select
          value={sortOrder}
          onValueChange={(value) => value && setSortOrder(value)}
        >
          <SelectTrigger aria-label="Sắp xếp trang bán hàng" size="sm">
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
        <VirtualizedLandingGrid
          isOfferSurface={isOfferSurface}
          landingPages={filtered}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((lp) => (
            <LandingCard
              key={lp.id}
              landingPage={lp}
              surface={isOfferSurface ? "offers" : "landing-pages"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const VIRTUAL_ROW_HEIGHT = 280;
const VIRTUAL_GRID_COLUMN_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4"
} as const;

// Mirrors the non-virtualized grid's `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
// breakpoints — the virtualizer needs the column count as a number (to slice rows), so it can't
// rely on CSS breakpoints alone the way the plain grid above does.
function useVirtualGridColumns(): 1 | 2 | 3 | 4 {
  const isXl = useMediaQuery("(min-width: 1280px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isSm = useMediaQuery("(min-width: 640px)");
  if (isXl) return 4;
  if (isLg) return 3;
  if (isSm) return 2;
  return 1;
}

function VirtualizedLandingGrid({
  landingPages,
  isOfferSurface
}: {
  landingPages: LandingPageListItem[];
  isOfferSurface: boolean;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const columns = useVirtualGridColumns();
  const rowCount = Math.ceil(landingPages.length / columns);
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
          const start = virtualRow.index * columns;
          const rowItems = landingPages.slice(start, start + columns);
          return (
            <div
              key={virtualRow.key}
              className={`absolute inset-x-0 grid gap-4 ${VIRTUAL_GRID_COLUMN_CLASSES[columns]}`}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                height: virtualRow.size
              }}
            >
              {rowItems.map((lp) => (
                <LandingCard
                  key={lp.id}
                  landingPage={lp}
                  surface={isOfferSurface ? "offers" : "landing-pages"}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
