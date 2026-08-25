import type { PageAsset } from "@dv/contracts";
import { CodeBlockContainer } from "@dv/ui/components/ai-elements/code-block";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@dv/ui/components/shadcn/dialog";
import { Empty, EmptyDescription } from "@dv/ui/components/shadcn/empty";
import { ScrollArea } from "@dv/ui/components/shadcn/scroll-area";
import { useDropzone } from "@dv/ui/components/upload";
import { cn } from "@dv/ui/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Braces,
  Folder,
  Globe,
  Image as ImageIcon,
  RefreshCw,
  Upload,
  Video as VideoIcon
} from "lucide-react";
import * as React from "react";

import { compressToWebp } from "@/lib/image-compress";
import * as m from "@/paraglide/messages.js";

import {
  assetFileUrl,
  assetPosterUrl,
  fetchAssets,
  fetchCurrentSrcmap,
  thumbnailUrl,
  uploadAsset
} from "../api";
import {
  extractVideoPoster,
  MAX_VIDEO_BYTES,
  VIDEO_MIME_TYPES
} from "../lib/video-poster";
import { pageAssetKeys, pageSrcmapKeys } from "../query-keys";

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
  fileName
}: {
  landingPageId: string;
  fileName: string;
}) {
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = React.useState<
    "generic" | "video_too_large" | null
  >(null);
  const [jsonViewerOpen, setJsonViewerOpen] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [assetsExpanded, setAssetsExpanded] = React.useState(false);
  const [openAssetId, setOpenAssetId] = React.useState<string | null>(null);

  const assetsQuery = useQuery({
    queryKey: pageAssetKeys.list(landingPageId),
    queryFn: () => fetchAssets(landingPageId)
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (VIDEO_MIME_TYPES.has(file.type)) {
        // FR-B-29: video is kept as-is (no client transcode) — only the poster is derived.
        const poster = await extractVideoPoster(file).catch(() => undefined);
        return uploadAsset(landingPageId, file, file.name, poster);
      }
      const { blob, fileName: webpName } = await compressToWebp(file);
      return uploadAsset(landingPageId, blob, webpName);
    },
    onSuccess: () => {
      setUploadError(null);
      queryClient.invalidateQueries({
        queryKey: pageAssetKeys.list(landingPageId)
      });
    },
    onError: () => setUploadError("generic")
  });

  const { dragOver, open, dropProps, inputProps } = useDropzone({
    accept: "image/*,video/mp4,video/webm",
    disabled: uploadMutation.isPending,
    onFiles: ([file]) => {
      if (!file) return;
      if (VIDEO_MIME_TYPES.has(file.type)) {
        if (file.size > MAX_VIDEO_BYTES) {
          setUploadError("video_too_large");
          return;
        }
        uploadMutation.mutate(file);
        return;
      }
      if (file.type.startsWith("image/")) uploadMutation.mutate(file);
    }
  });

  return (
    <div className="flex h-full flex-col" {...dropProps}>
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-medium">
          {m.studioFilesProjectTitle()}
        </span>
        <div className="flex items-center gap-1">
          <input {...inputProps} />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.studioFilesUploadLabel()}
            disabled={uploadMutation.isPending}
            onClick={open}
          >
            <Upload />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.studioFilesRefreshLabel()}
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: pageAssetKeys.list(landingPageId)
              })
            }
          >
            <RefreshCw />
          </Button>
        </div>
      </div>

      <ScrollArea className={dragOver ? "flex-1 bg-primary/5" : "flex-1"}>
        <div className="p-2">
          {uploadError && (
            <p className="px-2 pb-2 text-xs text-destructive">
              {uploadError === "video_too_large"
                ? m.studioFilesVideoTooLarge()
                : m.studioFilesUploadFailed()}
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
                  icon={
                    VIDEO_MIME_TYPES.has(asset.mime) ? (
                      <VideoIcon size={16} />
                    ) : (
                      <ImageIcon size={16} />
                    )
                  }
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
            <TreeRow icon={<Globe size={16} />} name={fileName} />
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
    </div>
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
      <DialogContent className="flex h-[85vh] max-h-[85vh] w-[min(90vw,1100px)] max-w-none flex-col sm:max-w-none">
        <DialogHeader>
          <DialogTitle>
            {m.studioFilesJsonViewerTitle({
              fileName: `${fileName}.srcmap.json`
            })}
          </DialogTitle>
        </DialogHeader>
        {pretty ? (
          <ScrollArea className="min-h-0 flex-1 rounded border">
            <CodeBlockContainer language="json" className="min-w-0">
              {/* read-only viewer — the srcmap source of truth stays server-side */}
              <pre className="min-w-0 overflow-x-auto p-4 font-mono text-sm">
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
      <DialogContent className="max-w-2xl sm:max-w-2xl">
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
      <DialogContent className="max-w-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{asset?.fileName}</DialogTitle>
        </DialogHeader>
        {asset && VIDEO_MIME_TYPES.has(asset.mime) ? (
          <video
            key={asset.id}
            src={assetFileUrl(landingPageId, asset.id)}
            poster={
              asset.posterKey
                ? assetPosterUrl(landingPageId, asset.id)
                : undefined
            }
            crossOrigin="use-credentials"
            controls
            className="w-full rounded"
          />
        ) : (
          asset && (
            <img
              key={asset.id}
              src={assetFileUrl(landingPageId, asset.id)}
              alt={asset.fileName}
              crossOrigin="use-credentials"
              className="w-full rounded"
            />
          )
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
      crossOrigin="use-credentials"
      className="w-full rounded"
      onError={() => setFailed(true)}
    />
  );
}
