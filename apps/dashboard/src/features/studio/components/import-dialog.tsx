import type { ImportLandingPageResponse } from "@dv/contracts";
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

import * as m from "@/paraglide/messages.js";

import { importLandingPage, type ImportLandingPageInput } from "../api";
import { landingKeys } from "../query-keys";

type ImportMode = "html" | "url" | "file";

/** FR-B-30 — paste HTML / paste a public link / upload a `.html`/`.zip` file. One dialog, one
 * mutation, three input shapes; the mode tab picks which field is required to submit. */
export function ImportLandingDialog({
  onImported
}: {
  onImported: (result: ImportLandingPageResponse) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<ImportMode>("html");
  const [name, setName] = React.useState("");
  const [html, setHtml] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: (input: ImportLandingPageInput) => importLandingPage(input),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      setOpen(false);
      onImported(result);
    },
    onError: () =>
      toast.add({ title: m.landingsImportErrorToast(), type: "error" })
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
          <Button variant="outline">
            <Upload /> {m.landingsImportButton()}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.landingsImportDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="import-name">{m.landingsImportNameLabel()}</Label>
            <Input
              id="import-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={m.landingsImportNamePlaceholder()}
            />
          </div>

          <Tabs
            value={mode}
            onValueChange={(v) => v && setMode(v as ImportMode)}
          >
            <TabsList>
              <TabsTrigger value="html">
                {m.landingsImportTabHtml()}
              </TabsTrigger>
              <TabsTrigger value="url">{m.landingsImportTabUrl()}</TabsTrigger>
              <TabsTrigger value="file">
                {m.landingsImportTabFile()}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <Textarea
                rows={8}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder={m.landingsImportHtmlPlaceholder()}
              />
            </TabsContent>
            <TabsContent value="url">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={m.landingsImportUrlPlaceholder()}
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
            {importMutation.isPending
              ? m.landingsImportSubmitting()
              : m.landingsImportSubmitButton()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
