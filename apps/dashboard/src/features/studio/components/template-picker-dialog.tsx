import type { LandingPageDetail } from "@dv/contracts";
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
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutTemplate } from "lucide-react";
import * as React from "react";

import { landingKeys } from "@/features/studio/query-keys";

import { createManualLandingPage, fetchTemplates } from "../api";

/**
 * Template picker — the fourth entry point alongside prompt-bar/AI-wizard/manual/custom-import,
 * built once the Puck-based Studio was in place per the user's own ordering. Clones a shared
 * template's `pageSpec`/`tokens`/`seo` into a new landing page's first version (`POST /manual`
 * with `templateId`), then opens straight into `studio-native` like a blank manual page does.
 * Templates themselves come from `POST /:id/save-as-template` — promoting a page already brought
 * to quality through the real Studio/AI pipeline, not a separate offline generator.
 */
export function TemplatePickerDialog({
  onCreated
}: {
  onCreated: (created: LandingPageDetail) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: templates, isPending } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    enabled: open
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createManualLandingPage({
        name: name.trim() || "Trang mới",
        templateId: selectedId
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      setOpen(false);
      setSelectedId(null);
      setName("");
      onCreated(created);
    },
    onError: () => toast.add({ title: "Tạo trang thất bại", type: "error" })
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <LayoutTemplate /> Từ template
          </Button>
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chọn template</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="template-page-name">Tên trang</Label>
          <Input
            id="template-page-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Trang mới"
          />
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : !templates || templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có template nào.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedId(template.id)}
                className="flex flex-col gap-1 rounded-md border p-3 text-left data-[selected=true]:border-primary data-[selected=true]:ring-1 data-[selected=true]:ring-primary"
                data-selected={selectedId === template.id}
              >
                <span className="text-sm font-medium">{template.name}</span>
                <span className="text-xs text-muted-foreground">
                  {template.industry}
                </span>
              </button>
            ))}
          </div>
        )}

        <Button
          disabled={!selectedId || createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          {createMutation.isPending ? "Đang tạo…" : "Tạo trang từ template"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
