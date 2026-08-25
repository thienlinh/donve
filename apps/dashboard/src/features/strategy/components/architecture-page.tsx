import type { NativePageDocument } from "@dv/contracts";
import { componentMetadata } from "@dv/studio-catalog";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@dv/ui/components/shadcn/select";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";

import { AddSectionDrawer } from "@/features/studio-native/components/add-section-drawer";
import { fetchLandingPage, updateLandingPageSpec } from "@/features/studio/api";
import { landingKeys } from "@/features/studio/query-keys";

import { fillContent, generateArchitecture } from "../api-architecture";

function toDocument(spec: unknown): NativePageDocument | null {
  if (spec && typeof spec === "object" && "pageSpec" in spec) {
    return spec as NativePageDocument;
  }
  return null;
}

/**
 * Wizard AI — bước 3 (`technical/ui-ux-design.md` §Wizard AI: danh sách section dạng thẻ
 * kéo-thả, mỗi thẻ hiện component+variant+lý do, nút xoá/đổi variant — trước khi tốn AI call
 * điền content). Reorder ở đây dùng nút lên/xuống thay vì @dnd-kit — cùng lựa chọn đơn giản
 * hoá đã dùng ở `studio-native`'s LayerTree, chưa cần kéo-thả thật cho v1.
 */
export function ArchitecturePage() {
  const { id } = useParams({
    from: "/_authenticated/landings/$id/architecture"
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: landingPage, isPending } = useQuery({
    queryKey: landingKeys.detail(id),
    queryFn: () => fetchLandingPage(id)
  });

  const [draft, setDraft] = useState<NativePageDocument | null>(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  const serverDoc = landingPage
    ? toDocument(landingPage.currentVersion?.spec)
    : null;
  const doc = draft ?? serverDoc;

  const architectMutation = useMutation({
    mutationFn: () => generateArchitecture(id),
    onSuccess: (version) => {
      queryClient.setQueryData(
        landingKeys.detail(id),
        (prev: typeof landingPage) =>
          prev
            ? { ...prev, currentVersion: version, currentVersionId: version.id }
            : prev
      );
      setDraft(null);
    },
    onError: () => toast.add({ title: "Tạo kiến trúc thất bại", type: "error" })
  });

  const saveMutation = useMutation({
    mutationFn: (next: NativePageDocument) => updateLandingPageSpec(id, next),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) }),
    onError: () => toast.add({ title: "Lưu thất bại", type: "error" })
  });

  const contentFillMutation = useMutation({
    mutationFn: () => fillContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingKeys.detail(id) });
      toast.add({ title: "Đã tạo nội dung", type: "success" });
      navigate({ to: "/landings/$id/studio-native", params: { id } });
    },
    onError: () => toast.add({ title: "Tạo nội dung thất bại", type: "error" })
  });

  function persist(next: NativePageDocument) {
    setDraft(next);
    saveMutation.mutate(next);
  }

  function reorder(fromIndex: number, toIndex: number) {
    if (!doc) return;
    const root = doc.pageSpec.elements[doc.pageSpec.root];
    const children = [...(root?.children ?? [])];
    const [moved] = children.splice(fromIndex, 1);
    if (moved === undefined || !root) return;
    children.splice(toIndex, 0, moved);
    persist({
      ...doc,
      pageSpec: {
        ...doc.pageSpec,
        elements: {
          ...doc.pageSpec.elements,
          [doc.pageSpec.root]: { ...root, children }
        }
      }
    });
  }

  function remove(elementId: string) {
    if (!doc) return;
    const root = doc.pageSpec.elements[doc.pageSpec.root];
    if (!root) return;
    const children = (root.children ?? []).filter((c) => c !== elementId);
    const elements = { ...doc.pageSpec.elements };
    delete elements[elementId];
    elements[doc.pageSpec.root] = { ...root, children };
    const architectureNotes = { ...doc.architectureNotes };
    delete architectureNotes[elementId];
    persist({
      ...doc,
      pageSpec: { ...doc.pageSpec, elements },
      architectureNotes
    });
  }

  function changeVariant(elementId: string, variant: string) {
    if (!doc) return;
    const element = doc.pageSpec.elements[elementId];
    if (!element) return;
    persist({
      ...doc,
      pageSpec: {
        ...doc.pageSpec,
        elements: {
          ...doc.pageSpec.elements,
          [elementId]: {
            ...element,
            props: { ...(element.props as object), variant }
          }
        }
      }
    });
  }

  function insertSection(
    componentId: string,
    exampleProps: Record<string, unknown>
  ) {
    if (!doc) return;
    const root = doc.pageSpec.elements[doc.pageSpec.root];
    const elementId = `${componentId}-${nanoid(6)}`;
    const meta = componentMetadata.find((m) => m.componentId === componentId);
    persist({
      ...doc,
      pageSpec: {
        ...doc.pageSpec,
        elements: {
          ...doc.pageSpec.elements,
          [doc.pageSpec.root]: {
            ...root,
            type: root?.type ?? "page_root",
            props: root?.props ?? {},
            children: [...(root?.children ?? []), elementId]
          },
          [elementId]: { type: componentId, props: exampleProps, children: [] }
        }
      },
      architectureNotes: {
        ...doc.architectureNotes,
        [elementId]: {
          purpose: meta?.purpose[0] ?? "desire",
          reason: "Thêm thủ công"
        }
      }
    });
  }

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const rootElement = doc?.pageSpec.elements[doc.pageSpec.root];
  const sectionIds = rootElement?.children ?? [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">✓ Business</span>
        <span className="text-sm text-muted-foreground">✓ Strategy</span>
        <span className="text-sm font-medium">● Architecture</span>
        <Link
          to="/landings/$id/studio-native"
          params={{ id }}
          className="ms-auto text-sm text-muted-foreground hover:underline"
        >
          Bỏ qua, tự làm thủ công
        </Link>
      </div>

      {!doc ? (
        <Button
          disabled={architectMutation.isPending}
          onClick={() => architectMutation.mutate()}
        >
          {architectMutation.isPending
            ? "Đang tạo kiến trúc…"
            : "Đề xuất kiến trúc trang →"}
        </Button>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Kiến trúc trang đề xuất</h2>
          {sectionIds.map((elementId, index) => {
            const element = doc.pageSpec.elements[elementId];
            const note = doc.architectureNotes?.[elementId];
            if (!element) return null;
            const meta = componentMetadata.find(
              (m) => m.componentId === element.type
            );
            const variants = meta?.variants ?? [];
            const currentVariant = (element.props as { variant?: string })
              ?.variant;

            return (
              <div
                key={elementId}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === 0}
                    onClick={() => reorder(index, index - 1)}
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === sectionIds.length - 1}
                    onClick={() => reorder(index, index + 1)}
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{element.type}</span>
                    {variants.length > 0 ? (
                      <Select
                        value={currentVariant}
                        onValueChange={(v) => v && changeVariant(elementId, v)}
                      >
                        <SelectTrigger size="sm" className="h-6 w-auto text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {variants.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                  </div>
                  {note ? (
                    <p className="text-xs text-muted-foreground">
                      {note.reason}
                    </p>
                  ) : null}
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(elementId)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}

          <Button
            variant="outline"
            className="self-start"
            onClick={() => setAddSectionOpen(true)}
          >
            + Thêm section
          </Button>

          <Button
            disabled={contentFillMutation.isPending || sectionIds.length === 0}
            onClick={() => contentFillMutation.mutate()}
          >
            {contentFillMutation.isPending
              ? "Đang tạo nội dung…"
              : "Tạo nội dung với AI →"}
          </Button>
        </div>
      )}

      <AddSectionDrawer
        open={addSectionOpen}
        onOpenChange={setAddSectionOpen}
        onInsert={insertSection}
      />
    </div>
  );
}
