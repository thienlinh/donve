import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import * as React from "react";

import { landingKeys } from "@/features/studio/query-keys";
import { ApiClientError } from "@/lib/api-client";
import * as m from "@/paraglide/messages.js";

import { reuploadCustomPage } from "../api";
import {
  IMPORT_ERROR_MESSAGES,
  ImportSourceFields,
  useImportSourceForm
} from "./import-source-fields";

/** Manual-edit path for an existing Custom Import page with no AI involved: edit the HTML/zip
 * yourself and re-upload it here — lands a new `pageVersion` on this same landing page (unlike
 * `CustomImportDialog`, which always creates a brand new one). */
export function ReuploadCustomDialog({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const form = useImportSourceForm();
  const queryClient = useQueryClient();

  const reuploadMutation = useMutation({
    mutationFn: () => {
      const input = form.toInput();
      if (!input) throw new Error("no_source");
      return reuploadCustomPage(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["custom-html", id] });
      queryClient.invalidateQueries({ queryKey: ["custom-page-bundle", id] });
      queryClient.invalidateQueries({ queryKey: ["custom-audit", id] });
      setOpen(false);
      form.reset();
      toast.add({ title: "Đã cập nhật trang", type: "success" });
    },
    onError: (error) =>
      toast.add({
        title:
          error instanceof ApiClientError && IMPORT_ERROR_MESSAGES[error.code]
            ? IMPORT_ERROR_MESSAGES[error.code]
            : error instanceof Error
              ? error.message
              : "Cập nhật thất bại",
        type: "error"
      })
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <RefreshCw /> {m.landingsReuploadButton()}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.landingsReuploadDialogTitle()}</DialogTitle>
        </DialogHeader>

        <ImportSourceFields form={form} />

        <DialogFooter>
          <Button
            disabled={!form.canSubmit || reuploadMutation.isPending}
            onClick={() => reuploadMutation.mutate()}
          >
            {reuploadMutation.isPending ? "Đang cập nhật…" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
