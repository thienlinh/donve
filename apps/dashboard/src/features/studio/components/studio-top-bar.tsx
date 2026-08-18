import type { LandingPage } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@dv/ui/components/shadcn/dropdown-menu";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@dv/ui/components/shadcn/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Code2,
  Copy,
  Download,
  FileArchive,
  ImageDown,
  Loader2,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Presentation,
  Share2,
  Trash2
} from "lucide-react";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import {
  deleteLandingPage,
  duplicateLandingPage,
  fetchAssets,
  renameLandingPage
} from "../api";
import { exportHtml, exportPng, exportZip } from "../lib/export";
import { toHtmlFileName } from "../lib/file-name";
import { landingKeys, pageAssetKeys } from "../query-keys";

export function StudioTopBar({
  landingPage,
  html,
  onCapturePng,
  chatCollapsed,
  onToggleChat
}: {
  landingPage: LandingPage;
  html: string;
  onCapturePng: () => Promise<Blob | null>;
  chatCollapsed: boolean;
  onToggleChat: () => void;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [nameDraft, setNameDraft] = React.useState(landingPage.name);
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = React.useState<
    "html" | "zip" | "png" | null
  >(null);
  const fileName = toHtmlFileName(landingPage.name);

  async function handleExportHtml() {
    setExporting("html");
    try {
      exportHtml(fileName, html);
    } finally {
      setExporting(null);
    }
  }

  async function handleExportZip() {
    setExporting("zip");
    try {
      const assets = await queryClient.fetchQuery({
        queryKey: pageAssetKeys.list(landingPage.id),
        queryFn: () => fetchAssets(landingPage.id)
      });
      await exportZip(landingPage.id, fileName, html, assets);
    } finally {
      setExporting(null);
    }
  }

  async function handleExportPng() {
    setExporting("png");
    try {
      await exportPng(fileName, onCapturePng);
    } finally {
      setExporting(null);
    }
  }

  React.useEffect(() => {
    if (isRenaming) renameInputRef.current?.focus();
  }, [isRenaming]);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: landingKeys.detail(landingPage.id)
    });
    queryClient.invalidateQueries({ queryKey: landingKeys.list() });
  };

  const renameMutation = useMutation({
    mutationFn: (name: string) => renameLandingPage(landingPage.id, name),
    onSuccess: invalidate
  });
  const duplicateMutation = useMutation({
    mutationFn: () => duplicateLandingPage(landingPage.id),
    onSuccess: invalidate
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteLandingPage(landingPage.id),
    onSuccess: () => {
      invalidate();
      navigate({ to: "/landings" });
    }
  });

  function commitRename() {
    setIsRenaming(false);
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== landingPage.name) {
      renameMutation.mutate(trimmed);
    } else {
      setNameDraft(landingPage.name);
    }
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              to="/landings"
              aria-label={m.commonBack()}
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>
          }
        />
        <TooltipContent>{m.commonBack()}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={
                chatCollapsed ? m.studioShowChat() : m.studioHideChat()
              }
              onClick={onToggleChat}
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {chatCollapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </button>
          }
        />
        <TooltipContent>
          {chatCollapsed ? m.studioShowChat() : m.studioHideChat()}
        </TooltipContent>
      </Tooltip>

      {isRenaming ? (
        <Input
          ref={renameInputRef}
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setNameDraft(landingPage.name);
              setIsRenaming(false);
            }
          }}
          className="h-7 w-56"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setNameDraft(landingPage.name);
            setIsRenaming(true);
          }}
          className="group/rename flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium hover:bg-muted"
        >
          <span className="truncate">{landingPage.name}</span>
          <Pencil className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover/rename:opacity-100" />
        </button>
      )}

      <div className="ms-auto flex shrink-0 items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm">
                <Download /> {m.studioExport()}
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={exporting !== null}
              onClick={handleExportHtml}
            >
              {exporting === "html" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Code2 />
              )}
              {m.studioExportHtml()}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={exporting !== null}
              onClick={handleExportZip}
            >
              {exporting === "zip" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FileArchive />
              )}
              {m.studioExportZip()}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={exporting !== null}
              onClick={handleExportPng}
            >
              {exporting === "png" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ImageDown />
              )}
              {m.studioExportPng()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger
            render={
              <span>
                <Button variant="ghost" size="sm" disabled>
                  <Presentation /> {m.studioPresent()}
                </Button>
              </span>
            }
          />
          <TooltipContent>{m.studioComingSoon()}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <span>
                <Button variant="ghost" size="sm" disabled>
                  <Download /> {m.studioDownload()}
                </Button>
              </span>
            }
          />
          <TooltipContent>{m.studioComingSoon()}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <span>
                <Button variant="outline" size="sm" disabled>
                  <Share2 /> {m.studioShare()}
                </Button>
              </span>
            }
          />
          <TooltipContent>{m.studioComingSoon()}</TooltipContent>
        </Tooltip>

        <Button
          variant="default"
          size="sm"
          render={<Link to="/landings" />}
          nativeButton={false}
        >
          <Plus /> {m.studioNew()}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label={m.studioMoreActionsLabel()}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="size-4" />
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => duplicateMutation.mutate()}>
              <Copy /> {m.landingsActionDuplicate()}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
            >
              <Trash2 /> {m.landingsActionDelete()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
