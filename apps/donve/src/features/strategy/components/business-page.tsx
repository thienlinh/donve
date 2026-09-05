import type { KnowledgeItem } from "@dv/contracts";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { usePersistentState } from "../../studio/lib/use-persistent-state";
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

type SetupDraft = {
  brief: string;
  urlsInput: string;
};
const categoryLabels = {
  product: "Sản phẩm",
  customer: "Khách hàng",
  market: "Thị trường"
} as const;

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

  const [setupDraft, setSetupDraft] = usePersistentState<SetupDraft>(
    `donve:offer-setup:${id}`,
    { brief: "", urlsInput: "" }
  );
  const [brief, setBrief] = useState(setupDraft.brief);
  const [urlsInput, setUrlsInput] = useState(setupDraft.urlsInput);
  const [hasResumedDraft] = useState(() =>
    Boolean(setupDraft.brief.trim() || setupDraft.urlsInput.trim())
  );
  const [showBriefForm, setShowBriefForm] = useState(false);
  const [draft, setDraft] = useState<CategoryItems | null>(null);

  useEffect(() => {
    setSetupDraft({ brief, urlsInput });
  }, [brief, setSetupDraft, urlsInput]);

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
      setSetupDraft({ brief: "", urlsInput: "" });
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
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-8 p-4 sm:p-8">
      <Link
        to="/offers"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Quay lại sản phẩm đang bán
      </Link>

      <header className="flex max-w-2xl flex-col gap-3">
        <Badge className="w-fit gap-2" variant="secondary">
          <Sparkles className="size-3.5" />
          Thiết lập sản phẩm đang bán
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Bắt đầu với sản phẩm này
        </h1>
        <p className="text-muted-foreground">
          Mô tả điều bạn đang bán. Đơn Về sẽ gom lại thành một bản nháp rõ ràng
          để bạn chỉnh sửa trước khi đăng.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="text-foreground">1. Mô tả</span>
              <span aria-hidden="true">→</span>
              <span className={draft ? "text-foreground" : ""}>
                2. Xem gợi ý
              </span>
              <span aria-hidden="true">→</span>
              <span>3. Hoàn thiện</span>
            </div>
            <CardTitle>
              {showForm
                ? "Bạn muốn khách hàng mua gì?"
                : "Kiểm tra bản nháp sản phẩm đang bán"}
            </CardTitle>
            <CardDescription>
              {showForm
                ? "Chỉ cần vài câu. Không cần viết mẫu hướng dẫn AI hoàn hảo."
                : "Thông tin có thể sửa trực tiếp trước khi tiếp tục."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForm ? (
              <div className="flex flex-col gap-4">
                {hasResumedDraft && (
                  <p className="rounded-md border border-info/30 bg-info/10 px-3 py-2 text-sm text-info-foreground">
                    Đã khôi phục bản nháp bạn đang viết trên thiết bị này.
                  </p>
                )}
                <Textarea
                  aria-label="Mô tả sản phẩm hoặc dịch vụ"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Ví dụ: Tôi bán set chăm sóc da cho người bận rộn, giao trong ngày tại nội thành…"
                  rows={7}
                />
                <Textarea
                  aria-label="Website hoặc nguồn tham khảo"
                  value={urlsInput}
                  onChange={(e) => setUrlsInput(e.target.value)}
                  placeholder="Website hoặc nguồn tham khảo (tuỳ chọn)"
                  rows={2}
                />
                {generateMutation.error && (
                  <p className="text-sm text-destructive" role="alert">
                    {generateMutation.error.message}
                  </p>
                )}
                <Button
                  className="w-full sm:w-fit"
                  disabled={!brief.trim() || generateMutation.isPending}
                  onClick={() => generateMutation.mutate()}
                >
                  {generateMutation.isPending
                    ? "Đang tạo bản nháp…"
                    : "Tạo bản nháp sản phẩm đang bán"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {(["product", "customer", "market"] as const).map(
                  (category) => (
                    <div key={category} className="flex flex-col gap-2">
                      <h3 className="text-sm font-semibold">
                        {categoryLabels[category]}
                      </h3>
                      {draft[category].map((item, index) => (
                        <KnowledgeItemRow
                          key={item.label + index}
                          item={item}
                          onChange={(next) => updateItem(category, index, next)}
                        />
                      ))}
                    </div>
                  )
                )}

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setShowBriefForm(true)}
                  >
                    ← Phân tích lại
                  </Button>
                  <Button
                    disabled={saveMutation.isPending}
                    onClick={() => saveMutation.mutate()}
                  >
                    {saveMutation.isPending
                      ? "Đang lưu…"
                      : "Dùng thông tin này"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">
              Bạn sẽ có gì sau bước này?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4 text-sm">
              {[
                "Một mô tả sản phẩm đang bán dễ hiểu",
                "Chân dung khách hàng chính",
                "Gợi ý thông tin cần kiểm tra",
                "Nền tảng để viết nội dung bán hàng"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/landings/$id/studio-native"
              params={{ id }}
              className="mt-6 inline-flex text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Bỏ qua, tự thiết kế thủ công
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
