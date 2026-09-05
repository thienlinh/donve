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
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import * as React from "react";

import { landingKeys } from "@/features/studio/query-keys";
import { ApiClientError } from "@/lib/api-client";
import * as m from "@/paraglide/messages.js";

import { importCustomPage, type ImportCustomPageInput } from "../api";
import {
  IMPORT_ERROR_MESSAGES,
  ImportSourceFields,
  useImportSourceForm
} from "./import-source-fields";

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
  const [name, setName] = React.useState("");
  const form = useImportSourceForm();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: (input: ImportCustomPageInput) => importCustomPage(input),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      setOpen(false);
      reset();
      onImported(result);
    },
    onError: (error) =>
      toast.add({
        title:
          error instanceof ApiClientError && IMPORT_ERROR_MESSAGES[error.code]
            ? IMPORT_ERROR_MESSAGES[error.code]
            : error instanceof Error
              ? error.message
              : m.landingsImportErrorToast(),
        type: "error"
      })
  });

  function reset() {
    setName("");
    form.reset();
  }

  function handleSubmit() {
    const input = form.toInput(name);
    if (input) importMutation.mutate(input);
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
              <Upload /> {m.landingsImportButton()}
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.landingsImportDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="custom-import-name">
              {m.landingsImportNameLabel()}
            </Label>
            <Input
              id="custom-import-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={m.landingsImportNamePlaceholder()}
            />
          </div>

          <ImportSourceFields form={form} />
        </div>

        <DialogFooter>
          <Button
            disabled={!form.canSubmit || importMutation.isPending}
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
