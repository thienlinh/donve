import type { NativePageDocument } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkPlus } from "lucide-react";
import * as React from "react";

import { saveLandingPageAsTemplate } from "../../studio/api";

/** Promotes the current page into the shared template gallery (`TemplatePickerDialog`) — see
 * `POST /:id/save-as-template`'s doc comment for why this is the intended source of templates.
 * `document` is the Studio's own in-memory doc (`activeDoc`), passed through as-is so this
 * captures whatever is actually on screen — including edits not yet landed via the separate
 * "Lưu" button — rather than silently falling back to a possibly-stale saved version. */
export function SaveAsTemplateDialog({
  landingPageId,
  document
}: {
  landingPageId: string;
  document: NativePageDocument;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () =>
      saveLandingPageAsTemplate(landingPageId, {
        name: name.trim(),
        industry: industry.trim(),
        document
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setOpen(false);
      setName("");
      setIndustry("");
      toast.add({ title: "Đã lưu làm mẫu", type: "success" });
    },
    onError: () => toast.add({ title: "Lưu mẫu thất bại", type: "error" })
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <BookmarkPlus /> Lưu làm mẫu
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lưu trang này làm mẫu</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-name">Tên mẫu</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Mẫu khởi đầu cho SaaS"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-industry">Ngành</Label>
            <Input
              id="template-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="VD: SaaS, thương mại điện tử, dịch vụ địa phương…"
            />
          </div>
          <Button
            disabled={
              name.trim() === "" ||
              industry.trim() === "" ||
              saveMutation.isPending
            }
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? "Đang lưu…" : "Lưu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
