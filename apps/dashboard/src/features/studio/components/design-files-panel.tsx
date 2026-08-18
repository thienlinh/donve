import type { PageAsset, PageVersion, PageVersionOrigin } from "@dv/contracts";
import { CodeBlockContainer } from "@dv/ui/components/ai-elements/code-block";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { Empty, EmptyDescription } from "@dv/ui/components/shadcn/empty";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@dv/ui/components/shadcn/popover";
import { ScrollArea } from "@dv/ui/components/shadcn/scroll-area";
import { cn } from "@dv/ui/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Braces,
  Folder,
  Globe,
  Image as ImageIcon,
  RefreshCw,
  Upload
} from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import {
  assetFileUrl,
  fetchAssets,
  fetchCurrentSrcmap,
  fetchVersions,
  restoreVersion,
  setVersionLabel,
  thumbnailUrl,
  uploadAsset
} from "../api";
import { compressToWebp } from "../lib/image-compress";
import {
  landingKeys,
  pageAssetKeys,
  pageSrcmapKeys,
  pageVersionKeys
} from "../query-keys";
import { VersionDiffDialog } from "./version-diff-dialog";

const versionTimeFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});

const ORIGIN_LABEL: Record<PageVersionOrigin, () => string> = {
  manual: m.studioVersionOriginManual,
  import: m.studioVersionOriginImport,
  restore: m.studioVersionOriginRestore,
  ai_patch: m.studioVersionOriginAiPatch,
  ai_full: m.studioVersionOriginAiFull
};

function TreeGroup({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="px-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function TreeRow({
  icon,
  name,
  suffix,
  onClick,
  indent
}: {
  icon: React.ReactNode;
  name: string;
  suffix?: React.ReactNode;
  onClick?: () => void;
  indent?: boolean;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm hover:bg-muted disabled:cursor-default disabled:hover:bg-transparent",
        indent && "ps-6"
      )}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{name}</span>
      {suffix}
    </Comp>
  );
}

export function DesignFilesPanel({
  landingPageId,
  fileName,
  currentVersionId,
  onOpenPage
}: {
  landingPageId: string;
  fileName: string;
  currentVersionId: string | null;
  onOpenPage: () => void;
}) {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadError, setUploadError] = React.useState(false);
  const [jsonViewerOpen, setJsonViewerOpen] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [assetsExpanded, setAssetsExpanded] = React.useState(false);
  const [openAssetId, setOpenAssetId] = React.useState<string | null>(null);
  const [selectedForDiff, setSelectedForDiff] = React.useState<Set<string>>(
    new Set()
  );
  const [diffPair, setDiffPair] = React.useState<
    [PageVersion, PageVersion] | null
  >(null);

  const versionsQuery = useQuery({
    queryKey: pageVersionKeys.list(landingPageId),
    queryFn: () => fetchVersions(landingPageId)
  });
  const assetsQuery = useQuery({
    queryKey: pageAssetKeys.list(landingPageId),
    queryFn: () => fetchAssets(landingPageId)
  });

  function invalidateAll() {
    queryClient.invalidateQueries({
      queryKey: pageVersionKeys.list(landingPageId)
    });
    queryClient.invalidateQueries({
      queryKey: pageAssetKeys.list(landingPageId)
    });
  }

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { blob, fileName: webpName } = await compressToWebp(file);
      return uploadAsset(landingPageId, blob, webpName);
    },
    onSuccess: () => {
      setUploadError(false);
      queryClient.invalidateQueries({
        queryKey: pageAssetKeys.list(landingPageId)
      });
    },
    onError: () => setUploadError(true)
  });

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) uploadMutation.mutate(file);
  }

  // ponytail: re-capturing `.thumbnail.jpg` on restore needs the live Canvas iframe, which
  // this panel doesn't have access to — only the manual-save path (studio-page.tsx) re-captures
  // for now. Wire restore's capture through once Canvas reloads on `currentVersionId` change.
  const restoreMutation = useMutation({
    mutationFn: (versionId: string) => restoreVersion(landingPageId, versionId),
    onSuccess: () => {
      invalidateAll();
      queryClient.invalidateQueries({
        queryKey: landingKeys.detail(landingPageId)
      });
    }
  });

  const versions = versionsQuery.data ?? [];
  const canCompare = selectedForDiff.size === 2;

  function toggleSelected(id: string) {
    setSelectedForDiff((prev) => {
      if (prev.has(id)) return new Set([...prev].filter((v) => v !== id));
      // Cap at 2 selections — drop the oldest once a third is picked.
      const kept = prev.size >= 2 ? [...prev].slice(1) : [...prev];
      return new Set([...kept, id]);
    });
  }

  function openCompare() {
    const [a, b] = [...selectedForDiff]
      .map((id) => versions.find((v) => v.id === id))
      .filter((v): v is PageVersion => v !== undefined)
      .toSorted((x, y) => x.seq - y.seq);
    if (a && b) setDiffPair([a, b]);
  }

  return (
    <div
      className="flex h-full flex-col"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">
          {m.studioFilesProjectTitle()}
        </span>
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.studioFilesUploadLabel()}
            disabled={uploadMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.studioFilesRefreshLabel()}
            onClick={invalidateAll}
          >
            <RefreshCw />
          </Button>
        </div>
      </div>

      <ScrollArea className={dragOver ? "flex-1 bg-primary/5" : "flex-1"}>
        <div className="p-2">
          {uploadError && (
            <p className="px-2 pb-2 text-xs text-destructive">
              {m.studioFilesUploadFailed()}
            </p>
          )}

          <TreeGroup label={m.studioFilesGroupFolders()}>
            <TreeRow
              icon={<Folder size={16} />}
              name={m.studioFilesFolderAssets()}
              onClick={
                (assetsQuery.data?.length ?? 0) > 0
                  ? () => setAssetsExpanded((v) => !v)
                  : undefined
              }
              suffix={
                <Badge variant="secondary">
                  {assetsQuery.data?.length ?? 0}
                </Badge>
              }
            />
            {assetsExpanded &&
              assetsQuery.data?.map((asset) => (
                <TreeRow
                  key={asset.id}
                  icon={<ImageIcon size={16} />}
                  name={asset.fileName}
                  indent
                  onClick={() => setOpenAssetId(asset.id)}
                />
              ))}
            <TreeRow
              icon={<Folder size={16} />}
              name={m.studioFilesFolderScreenshots()}
            />
          </TreeGroup>

          <TreeGroup label={m.studioFilesGroupPages()}>
            <TreeRow
              icon={<Globe size={16} />}
              name={fileName}
              onClick={onOpenPage}
            />
          </TreeGroup>

          <TreeGroup label={m.studioFilesGroupData()}>
            <TreeRow
              icon={<Braces size={16} />}
              name={`${fileName}.srcmap.json`}
              onClick={() => setJsonViewerOpen(true)}
            />
          </TreeGroup>

          <TreeGroup label={m.studioFilesGroupImages()}>
            <TreeRow
              icon={<ImageIcon size={16} />}
              name={m.studioFilesThumbnailName()}
              onClick={() => setLightboxOpen(true)}
            />
          </TreeGroup>

          <div className="mt-2 border-t pt-2">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                {m.studioVersionHistoryTitle()}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!canCompare}
                onClick={openCompare}
              >
                {m.studioVersionCompareButton()}
              </Button>
            </div>
            {versions.length === 0 ? (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                {m.studioVersionHistoryEmpty()}
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {versions.map((version) => (
                  <VersionRow
                    key={version.id}
                    version={version}
                    isCurrent={version.id === currentVersionId}
                    checked={selectedForDiff.has(version.id)}
                    onToggle={() => toggleSelected(version.id)}
                    onRestore={() => restoreMutation.mutate(version.id)}
                    restoring={
                      restoreMutation.isPending &&
                      restoreMutation.variables === version.id
                    }
                    landingPageId={landingPageId}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </ScrollArea>

      <SrcmapViewerDialog
        open={jsonViewerOpen}
        onOpenChange={setJsonViewerOpen}
        landingPageId={landingPageId}
        fileName={fileName}
      />
      <ThumbnailLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        landingPageId={landingPageId}
      />
      <AssetLightbox
        landingPageId={landingPageId}
        asset={assetsQuery.data?.find((a) => a.id === openAssetId) ?? null}
        onOpenChange={(open) => {
          if (!open) setOpenAssetId(null);
        }}
      />
      <VersionDiffDialog
        landingPageId={landingPageId}
        versions={diffPair}
        onOpenChange={(open) => {
          if (!open) setDiffPair(null);
        }}
      />
    </div>
  );
}

function VersionRow({
  version,
  isCurrent,
  checked,
  onToggle,
  onRestore,
  restoring,
  landingPageId
}: {
  version: PageVersion;
  isCurrent: boolean;
  checked: boolean;
  onToggle: () => void;
  onRestore: () => void;
  restoring: boolean;
  landingPageId: string;
}) {
  const queryClient = useQueryClient();
  const [labelDraft, setLabelDraft] = React.useState(version.label ?? "");
  const [labelOpen, setLabelOpen] = React.useState(false);

  const labelMutation = useMutation({
    mutationFn: (label: string | null) =>
      setVersionLabel(landingPageId, version.id, label),
    onSuccess: () => {
      setLabelOpen(false);
      queryClient.invalidateQueries({
        queryKey: pageVersionKeys.list(landingPageId)
      });
    }
  });

  return (
    <li className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">v{version.seq}</span>
          <span className="text-xs text-muted-foreground">
            {versionTimeFormat.format(version.createdAt)}
          </span>
          <Badge variant="outline">{ORIGIN_LABEL[version.origin]()}</Badge>
          {isCurrent && <Badge>current</Badge>}
        </div>
        {version.label && (
          <p className="truncate text-xs text-muted-foreground">
            {version.label}
          </p>
        )}
      </div>
      <Popover open={labelOpen} onOpenChange={setLabelOpen}>
        <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
          {m.studioVersionLabelButton()}
        </PopoverTrigger>
        <PopoverContent align="end" className="flex w-64 gap-2">
          <Input
            value={labelDraft}
            placeholder={m.studioVersionLabelPlaceholder()}
            onChange={(e) => setLabelDraft(e.target.value)}
          />
          <Button
            size="sm"
            disabled={labelMutation.isPending}
            onClick={() => labelMutation.mutate(labelDraft.trim() || null)}
          >
            {m.studioVersionLabelSave()}
          </Button>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="sm"
        disabled={isCurrent || restoring}
        onClick={onRestore}
      >
        {m.studioVersionRestoreButton()}
      </Button>
    </li>
  );
}

function SrcmapViewerDialog({
  open,
  onOpenChange,
  landingPageId,
  fileName
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: string;
  fileName: string;
}) {
  const srcmapQuery = useQuery({
    queryKey: pageSrcmapKeys.current(landingPageId),
    queryFn: () => fetchCurrentSrcmap(landingPageId),
    enabled: open
  });

  const pretty = React.useMemo(() => {
    if (!srcmapQuery.data) return null;
    try {
      return JSON.stringify(JSON.parse(srcmapQuery.data), null, 2);
    } catch {
      return srcmapQuery.data;
    }
  }, [srcmapQuery.data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {m.studioFilesJsonViewerTitle({
              fileName: `${fileName}.srcmap.json`
            })}
          </DialogTitle>
        </DialogHeader>
        {pretty ? (
          <ScrollArea className="h-96 rounded border">
            <CodeBlockContainer language="json">
              {/* read-only viewer — the srcmap source of truth stays server-side */}
              <pre className="overflow-x-auto p-4 font-mono text-sm">
                {pretty}
              </pre>
            </CodeBlockContainer>
          </ScrollArea>
        ) : (
          <Empty className="border-none">
            <EmptyDescription>
              {m.studioFilesJsonViewerEmpty()}
            </EmptyDescription>
          </Empty>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ThumbnailLightbox({
  open,
  onOpenChange,
  landingPageId
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{m.studioFilesLightboxTitle()}</DialogTitle>
        </DialogHeader>
        {/* Freshly mounted (and its `failed` state reset) each time the dialog opens. */}
        {open && <ThumbnailImage landingPageId={landingPageId} />}
      </DialogContent>
    </Dialog>
  );
}

/** Opened by clicking an uploaded file under the expanded `assets/` row. */
function AssetLightbox({
  landingPageId,
  asset,
  onOpenChange
}: {
  landingPageId: string;
  asset: PageAsset | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={asset !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{asset?.fileName}</DialogTitle>
        </DialogHeader>
        {asset && (
          <img
            key={asset.id}
            src={assetFileUrl(landingPageId, asset.id)}
            alt={asset.fileName}
            className="w-full rounded"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ThumbnailImage({ landingPageId }: { landingPageId: string }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <Empty className="border-none">
        <EmptyDescription>{m.studioFilesLightboxEmpty()}</EmptyDescription>
      </Empty>
    );
  }
  return (
    <img
      src={thumbnailUrl(landingPageId)}
      alt=".thumbnail.jpg"
      className="w-full rounded"
      onError={() => setFailed(true)}
    />
  );
}
