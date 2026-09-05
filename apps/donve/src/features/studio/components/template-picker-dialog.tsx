import type { LandingPageDetail } from "@dv/contracts";
import { templateIndustryValues } from "@dv/contracts";
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
import { ScrollArea } from "@dv/ui/components/shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@dv/ui/components/shadcn/select";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutTemplate } from "lucide-react";
import * as React from "react";

import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { landingKeys } from "@/features/studio/query-keys";

import { createManualLandingPage, fetchTemplates } from "../api";
import { TemplateThumbnail } from "./template-thumbnail";

const ALL_INDUSTRIES = "all";

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
  const [industryFilter, setIndustryFilter] = React.useState(ALL_INDUSTRIES);
  const [search, setSearch] = React.useState("");
  const queryClient = useQueryClient();

  const { data: templates, isPending } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    enabled: open
  });
  const filteredTemplates = templates
    ?.filter(
      (template) =>
        industryFilter === ALL_INDUSTRIES ||
        template.industry === industryFilter
    )
    .filter((template) =>
      template.name.toLowerCase().includes(search.trim().toLowerCase())
    );

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
      <DialogContent className="flex h-[85vh] max-h-[85vh] w-[min(90vw,1100px)] max-w-none flex-col sm:max-w-none">
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

        {templates && templates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm template theo tên…"
              className="max-w-xs"
            />
            <Select
              value={industryFilter}
              onValueChange={(value) =>
                setIndustryFilter(value ?? ALL_INDUSTRIES)
              }
            >
              <SelectTrigger size="sm" className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_INDUSTRIES}>Tất cả ngành</SelectItem>
                {templateIndustryValues.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {isPending ? (
          <CardGridSkeleton
            count={8}
            gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            withThumbnail={false}
          />
        ) : !templates || templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có template nào.</p>
        ) : !filteredTemplates || filteredTemplates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Không tìm thấy template phù hợp.
          </p>
        ) : (
          <ScrollArea className="min-h-0 flex-1">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedId(template.id)}
                  className="flex flex-col gap-1.5 rounded-md border p-3 text-left data-[selected=true]:border-primary data-[selected=true]:ring-1 data-[selected=true]:ring-primary"
                  data-selected={selectedId === template.id}
                >
                  <TemplateThumbnail template={template} />
                  <span className="text-sm font-medium">{template.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {template.industry}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
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
