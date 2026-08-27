import type { KnowledgeItem } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  fetchBusinessProfile,
  generateBusinessProfile,
  updateBusinessProfile
} from "../api";
import { businessProfileKeys } from "../query-keys";
import { KnowledgeItemRow } from "./knowledge-item-row";
import { WizardSkeleton } from "./wizard-skeleton";

type CategoryItems = {
  product: KnowledgeItem[];
  customer: KnowledgeItem[];
  market: KnowledgeItem[];
};

/**
 * Wizard AI — bước 1 (`technical/ui-ux-design.md` §Wizard AI). Research Agent
 * (`ai/agent-pipeline.md`) chạy trên brief + URL, kết quả tách fact/inference/unknown, sửa tay
 * inline được trước khi "Xác nhận & Tiếp tục" sang Strategy.
 */
export function BusinessPage() {
  const { id } = useParams({ from: "/_authenticated/landings/$id/business" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isPending } = useQuery({
    queryKey: businessProfileKeys.detail(id),
    queryFn: () => fetchBusinessProfile(id)
  });

  const [brief, setBrief] = useState("");
  const [urlsInput, setUrlsInput] = useState("");
  const [showBriefForm, setShowBriefForm] = useState(false);
  const [draft, setDraft] = useState<CategoryItems | null>(null);

  // Reflects the freshest server data into the editable draft whenever it changes (first
  // load, or right after a (re)generate) — but never clobbers in-progress inline edits.
  useEffect(() => {
    if (profile) {
      setDraft({
        product: profile.product,
        customer: profile.customer,
        market: profile.market
      });
      setShowBriefForm(false);
    }
  }, [profile]);

  const generateMutation = useMutation({
    mutationFn: () =>
      generateBusinessProfile(id, {
        brief,
        urls: urlsInput
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean)
      }),
    onSuccess: (result) => {
      queryClient.setQueryData(businessProfileKeys.detail(id), result);
    },
    onError: () => toast.add({ title: "Phân tích thất bại", type: "error" })
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!draft) throw new Error("no profile");
      return updateBusinessProfile(id, draft);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(businessProfileKeys.detail(id), result);
      navigate({ to: "/landings/$id/strategy", params: { id } });
    },
    onError: () => toast.add({ title: "Lưu thất bại", type: "error" })
  });

  function updateItem(
    category: keyof CategoryItems,
    index: number,
    next: KnowledgeItem
  ) {
    if (!draft) return;
    const items = [...draft[category]];
    items[index] = next;
    setDraft({ ...draft, [category]: items });
  }

  if (isPending) {
    return <WizardSkeleton />;
  }

  const showForm = showBriefForm || !draft;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">● Business</span>
        <span className="text-sm text-muted-foreground">○ Strategy</span>
        <span className="text-sm text-muted-foreground">○ Architecture</span>
        <Link
          to="/landings/$id/studio-native"
          params={{ id }}
          className="ms-auto text-sm text-muted-foreground hover:underline"
        >
          Bỏ qua, tự làm thủ công
        </Link>
      </div>

      {showForm ? (
        <div className="flex flex-col gap-3">
          <Textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Mô tả sản phẩm/business của bạn"
            rows={6}
          />
          <Textarea
            value={urlsInput}
            onChange={(e) => setUrlsInput(e.target.value)}
            placeholder="URL website/đối thủ (ngăn cách bằng dấu phẩy) — tuỳ chọn"
            rows={2}
          />
          <Button
            disabled={!brief.trim() || generateMutation.isPending}
            onClick={() => generateMutation.mutate()}
          >
            {generateMutation.isPending ? "Đang phân tích…" : "Phân tích →"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {(["product", "customer", "market"] as const).map((category) => (
            <div key={category} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold capitalize">{category}</h3>
              {draft[category].map((item, index) => (
                <KnowledgeItemRow
                  key={item.label + index}
                  item={item}
                  onChange={(next) => updateItem(category, index, next)}
                />
              ))}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setShowBriefForm(true)}>
              ← Phân tích lại
            </Button>
            <Button
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              Xác nhận & Tiếp tục
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
