import type { ImportCustomPageResponse } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import * as React from "react";

import { landingKeys } from "@/features/studio/query-keys";

import { importCustomPage, type ImportCustomPageInput } from "../api";

type ImportMode = "html" | "url" | "file";

/** `page-system/custom-import.md` §Quy trình import — the only import entry point (the earlier
 * srcmap-editable `/import` mode has been retired) — lands `source: "custom_import"` and opens
 * the DOM-rule-audit/wire-lead-form page. */
export function CustomImportDialog({
  onImported,
  trigger
}: {
  onImported: (result: ImportCustomPageResponse) => void;
  /** Custom trigger element (e.g. an equal-weight create-mode card) — defaults to the compact
   * outline button used in the gallery header. */
  trigger?: React.ReactElement;
}) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<ImportMode>("html");
  const [name, setName] = React.useState("");
  const [html, setHtml] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: (input: ImportCustomPageInput) => importCustomPage(input),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      setOpen(false);
      onImported(result);
    },
    onError: () => toast.add({ title: "Import thất bại", type: "error" })
  });

  function reset() {
    setMode("html");
    setName("");
    setHtml("");
    setUrl("");
    setFile(null);
  }

  const canSubmit =
    mode === "html"
      ? html.trim() !== ""
      : mode === "url"
        ? url.trim() !== ""
        : file !== null;

  function handleSubmit() {
    const base = { name: name.trim() || undefined };
    if (mode === "html") importMutation.mutate({ ...base, mode, html });
    else if (mode === "url") importMutation.mutate({ ...base, mode, url });
    else if (file) importMutation.mutate({ ...base, mode, file });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline">
              <Upload /> Custom Import
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import HTML/asset có sẵn</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="custom-import-name">Tên trang</Label>
            <Input
              id="custom-import-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Landing khuyến mãi tháng 9"
            />
          </div>

          <Tabs
            value={mode}
            onValueChange={(v) => v && setMode(v as ImportMode)}
          >
            <TabsList>
              <TabsTrigger value="html">Paste HTML</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="file">File (.html/.zip)</TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <Textarea
                rows={8}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="<html>…</html>"
              />
            </TabsContent>
            <TabsContent value="url">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…"
              />
            </TabsContent>
            <TabsContent value="file">
              <Input
                type="file"
                accept=".html,.zip"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button
            disabled={!canSubmit || importMutation.isPending}
            onClick={handleSubmit}
          >
            {importMutation.isPending ? "Đang import…" : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
