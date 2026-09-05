import type { PromptLibraryEntry, Template } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@dv/ui/components/shadcn/resizable";
import { Skeleton } from "@dv/ui/components/shadcn/skeleton";
import { toast } from "@dv/ui/components/shadcn/toast";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@dv/ui/components/shadcn/toggle-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Copy,
  LayoutTemplate,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";
import { useMemo, useState } from "react";

import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { QueryState } from "@/components/query-state";
import { createManualLandingPage, fetchTemplates } from "@/features/studio/api";
import { TemplateThumbnail } from "@/features/studio/components/template-thumbnail";
import { landingKeys } from "@/features/studio/query-keys";
import * as m from "@/paraglide/messages.js";

import {
  fetchPromptLibrary,
  fetchPromptLibraryEntry,
  fetchTemplatePreviewHtml
} from "../api";
import { promptLibraryKeys } from "../query-keys";
import { GenerateFromPromptDialog } from "./generate-from-prompt-dialog";

function matchesSearch(
  entry: { title: string; description: string; promptText: string },
  query: string
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack =
    `${entry.title} ${entry.description} ${entry.promptText}`.toLowerCase();
  return haystack.includes(needle);
}

const previewWidths = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%"
} as const;
type PreviewDevice = keyof typeof previewWidths;

export function PromptLibraryGalleryPage() {
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const {
    data: entries,
    isPending,
    error
  } = useQuery({
    queryKey: promptLibraryKeys.list(),
    queryFn: fetchPromptLibrary
  });

  const filteredEntries = entries?.filter((entry) =>
    matchesSearch(entry, search)
  );

  // Same cache key `template-picker-dialog.tsx` uses — thumbnails share the fetch.
  const hasLinkedEntry = entries?.some((entry) => entry.templateId != null);
  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    enabled: !!hasLinkedEntry
  });
  const templateById = new Map(templates?.map((t) => [t.id, t]));

  // Default to the first loaded entry so the right pane isn't empty on first render.
  const activeSlug = selectedSlug ?? filteredEntries?.[0]?.slug ?? null;

  return (
    // `h-full` (not `flex-1`, inert here — the route wrapper this mounts inside,
    // `app-shell.tsx`'s `<div className="min-h-0 min-w-0 flex-1">`, is a plain block box, not a
    // flex container) so this fills exactly the space under the top bar instead of growing with
    // content and pushing the whole page into `<main>`'s scrollbar — each pane below scrolls on
    // its own instead.
    <div className="flex h-full min-h-0 flex-col gap-4 p-6">
      <div>
        <h1 className="text-lg font-semibold">{m.promptLibraryTitle()}</h1>
        <p className="text-sm text-muted-foreground">
          {m.promptLibraryDescription()}
        </p>
      </div>

      {isPending ? (
        <CardGridSkeleton withThumbnail={false} />
      ) : (
        <QueryState
          isPending={false}
          error={error}
          isEmpty={filteredEntries?.length === 0}
          errorTitle={m.promptLibraryLoadErrorTitle()}
          emptyTitle={m.promptLibraryEmptyTitle()}
          emptyIcon={<BookOpen />}
        />
      )}

      {filteredEntries && filteredEntries.length > 0 && (
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1 rounded-lg border"
        >
          <ResizablePanel
            defaultSize={32}
            minSize={22}
            className="flex min-h-0 flex-col"
          >
            <div className="border-b p-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={m.promptLibrarySearchPlaceholder()}
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
              {filteredEntries.map((entry) => {
                const template = entry.templateId
                  ? templateById.get(entry.templateId)
                  : undefined;
                const isActive = entry.slug === activeSlug;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setSelectedSlug(entry.slug)}
                    className={`flex flex-col gap-1.5 rounded-md border p-3 text-left transition hover:border-primary hover:shadow-sm ${
                      isActive ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    {template && <TemplateThumbnail template={template} />}
                    <span className="text-sm font-medium">{entry.title}</span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {entry.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={68} minSize={40}>
            {activeSlug && <PromptDetailPane slug={activeSlug} />}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}

function PromptDetailPane({ slug }: { slug: string }) {
  const { data: entry } = useQuery({
    queryKey: promptLibraryKeys.detail(slug),
    queryFn: () => fetchPromptLibraryEntry(slug)
  });

  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    enabled: entry?.templateId != null
  });
  const template = templates?.find((t) => t.id === entry?.templateId);

  if (!entry) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <SummaryDialogButton entry={entry} />
        <FullPromptDialogButton entry={entry} />
        <div className="ms-auto flex flex-wrap gap-2">
          <GenerateFromPromptDialog entry={entry} />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void navigator.clipboard.writeText(entry.promptText);
              toast.add({ title: m.promptLibraryCopiedToast() });
            }}
          >
            <Copy /> {m.commonCopy()}
          </Button>
          <Button
            type="button"
            variant="outline"
            render={<Link to="/offers" />}
          >
            {m.promptLibraryImportCta()}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {entry.templateId && template ? (
          <TemplatePreviewPane entry={entry} template={template} />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground">
            {m.promptLibraryNoPreview()}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryDialogButton({ entry }: { entry: PromptLibraryEntry }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="outline">
            {m.promptLibrarySummarySection()}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{m.promptLibrarySummarySection()}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{entry.description}</p>
      </DialogContent>
    </Dialog>
  );
}

function FullPromptDialogButton({ entry }: { entry: PromptLibraryEntry }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="outline">
            {m.promptLibraryFullPromptSection()}
          </Button>
        }
      />
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{m.promptLibraryFullPromptSection()}</DialogTitle>
        </DialogHeader>
        <div className="relative min-h-0 flex-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="absolute end-2 top-2"
            onClick={() => {
              void navigator.clipboard.writeText(entry.promptText);
              toast.add({ title: m.promptLibraryCopiedToast() });
            }}
          >
            <Copy /> {m.commonCopy()}
          </Button>
          <pre className="h-full overflow-auto rounded-md border bg-muted p-3 pt-12 font-mono text-xs whitespace-pre-wrap">
            {entry.promptText}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Live preview + "use this template" for entries linked to a `templateId` — same
 * `createManualLandingPage` mutation used elsewhere in this file, restyled with a
 * device-width toggle around the iframe. */
function TemplatePreviewPane({
  entry,
  template
}: {
  entry: PromptLibraryEntry;
  template: Template;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [device, setDevice] = useState<PreviewDevice>("desktop");

  const { data: previewHtml, isPending: previewPending } = useQuery({
    queryKey: ["template-preview-html", template.id],
    queryFn: () => fetchTemplatePreviewHtml(template.id)
  });

  // Stable reference across renders where `device` hasn't changed (react-perf/jsx-no-new-array-as-prop)
  // — this component also re-renders on every preview-html query tick, which would otherwise
  // allocate a new one-element array each time for no reason.
  const toggleGroupValue = useMemo(() => [device], [device]);

  const useTemplateMutation = useMutation({
    mutationFn: () =>
      createManualLandingPage({ name: entry.title, templateId: template.id }),
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

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between">
        <span className="text-sm font-medium">
          {m.promptLibraryPreviewSection()}
        </span>
        <ToggleGroup
          value={toggleGroupValue}
          onValueChange={(value) => {
            const next = value[0] as PreviewDevice | undefined;
            if (next) setDevice(next);
          }}
          size="sm"
        >
          <ToggleGroupItem
            value="mobile"
            aria-label={m.promptLibraryDeviceMobile()}
          >
            <Smartphone />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="tablet"
            aria-label={m.promptLibraryDeviceTablet()}
          >
            <Tablet />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="desktop"
            aria-label={m.promptLibraryDeviceDesktop()}
          >
            <Monitor />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex min-h-0 flex-1 justify-center overflow-hidden rounded-md border bg-muted p-2">
        {previewPending || !previewHtml ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <iframe
            title={template.name}
            srcDoc={previewHtml}
            className="h-full rounded-sm bg-background transition-[width]"
            style={{ width: previewWidths[device] }}
            sandbox=""
          />
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        className="shrink-0"
        disabled={useTemplateMutation.isPending}
        onClick={() => useTemplateMutation.mutate()}
      >
        <LayoutTemplate />
        {useTemplateMutation.isPending
          ? m.promptLibraryUseTemplateSubmitting()
          : m.promptLibraryUseTemplateCta()}
      </Button>
    </div>
  );
}
