import type { UpdateStrategyBriefInput } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  confirmStrategyBrief,
  fetchStrategyBrief,
  generateStrategyBrief,
  updateStrategyBrief
} from "../api";
import { strategyBriefKeys } from "../query-keys";
import { ClaimsField } from "./claims-field";
import { StringArrayField, TextField } from "./strategy-section-fields";
import { WizardSkeleton } from "./wizard-skeleton";

/** Wizard AI — bước 2 (`technical/ui-ux-design.md` §Wizard AI, `strategy-brief.md`). */
export function StrategyPage() {
  const { id } = useParams({ from: "/_authenticated/landings/$id/strategy" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: brief, isPending } = useQuery({
    queryKey: strategyBriefKeys.detail(id),
    queryFn: () => fetchStrategyBrief(id)
  });

  const [draft, setDraft] = useState<UpdateStrategyBriefInput | null>(null);

  useEffect(() => {
    if (brief) {
      setDraft({
        business: brief.business,
        customer: brief.customer,
        market: brief.market,
        funnel: brief.funnel,
        offer: brief.offer,
        message: brief.message
      });
    }
  }, [brief]);

  const generateMutation = useMutation({
    mutationFn: () => generateStrategyBrief(id),
    onSuccess: (result) =>
      queryClient.setQueryData(strategyBriefKeys.detail(id), result),
    onError: () =>
      toast.add({ title: "Tạo bản tóm tắt chiến lược thất bại", type: "error" })
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!draft) throw new Error("no draft");
      return updateStrategyBrief(id, draft);
    },
    onSuccess: (result) =>
      queryClient.setQueryData(strategyBriefKeys.detail(id), result),
    onError: () => toast.add({ title: "Lưu thất bại", type: "error" })
  });

  const confirmMutation = useMutation({
    mutationFn: async () => {
      if (draft) await updateStrategyBrief(id, draft);
      return confirmStrategyBrief(id);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(strategyBriefKeys.detail(id), result);
      toast.add({
        title: "Đã xác nhận bản tóm tắt chiến lược",
        type: "success"
      });
      navigate({ to: "/landings/$id/architecture", params: { id } });
    },
    onError: () => toast.add({ title: "Xác nhận thất bại", type: "error" })
  });

  if (isPending) {
    return <WizardSkeleton sections={6} />;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">✓ Kinh doanh</span>
        <span className="text-sm font-medium">● Chiến lược</span>
        <span className="text-sm text-muted-foreground">○ Kiến trúc</span>
        <Link
          to="/landings/$id/studio-native"
          params={{ id }}
          className="ms-auto text-sm text-muted-foreground hover:underline"
        >
          Bỏ qua, tự làm thủ công
        </Link>
      </div>

      {!draft ? (
        <Button
          disabled={generateMutation.isPending}
          onClick={() => generateMutation.mutate()}
        >
          {generateMutation.isPending
            ? "Đang tạo…"
            : "Tạo bản tóm tắt chiến lược →"}
        </Button>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Sản phẩm</h3>
            <TextField
              label="Sản phẩm"
              value={draft.business.product}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  business: { ...draft.business, product: v }
                })
              }
            />
            <TextField
              label="Danh mục"
              value={draft.business.category}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  business: { ...draft.business, category: v }
                })
              }
            />
            <TextField
              label="Mô hình kinh doanh"
              value={draft.business.businessModel}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  business: { ...draft.business, businessModel: v }
                })
              }
            />
          </section>

          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Khách hàng</h3>
            <TextField
              label="ICP"
              value={draft.customer.icp}
              onChange={(v) =>
                setDraft({ ...draft, customer: { ...draft.customer, icp: v } })
              }
            />
            <StringArrayField
              label="Nỗi đau"
              value={draft.customer.painPoints}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  customer: { ...draft.customer, painPoints: v }
                })
              }
            />
            <StringArrayField
              label="Kết quả mong muốn"
              value={draft.customer.desiredOutcomes}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  customer: { ...draft.customer, desiredOutcomes: v }
                })
              }
            />
            <StringArrayField
              label="Điểm băn khoăn"
              value={draft.customer.objections}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  customer: { ...draft.customer, objections: v }
                })
              }
            />
          </section>

          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Thị trường</h3>
            <StringArrayField
              label="Đối thủ"
              value={draft.market.competitors}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  market: { ...draft.market, competitors: v }
                })
              }
            />
            <StringArrayField
              label="Điểm khác biệt"
              value={draft.market.differentiators}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  market: { ...draft.market, differentiators: v }
                })
              }
            />
          </section>

          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Phễu bán hàng</h3>
            <TextField
              label="Mục tiêu chuyển đổi"
              value={draft.funnel.conversionGoal}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  funnel: { ...draft.funnel, conversionGoal: v }
                })
              }
            />
            <TextField
              label="Nguồn khách"
              value={draft.funnel.trafficSource}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  funnel: { ...draft.funnel, trafficSource: v }
                })
              }
            />
          </section>

          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Sản phẩm đang bán</h3>
            <TextField
              label="Sản phẩm cốt lõi"
              value={draft.offer.coreOffer}
              onChange={(v) =>
                setDraft({ ...draft, offer: { ...draft.offer, coreOffer: v } })
              }
            />
            <TextField
              label="Cam kết"
              value={draft.offer.guarantee}
              onChange={(v) =>
                setDraft({ ...draft, offer: { ...draft.offer, guarantee: v } })
              }
            />
          </section>

          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Thông điệp</h3>
            <TextField
              label="Giá trị đề xuất"
              value={draft.message.valueProposition}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  message: { ...draft.message, valueProposition: v }
                })
              }
            />
            <TextField
              label="Nút hành động chính"
              value={draft.message.primaryCta}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  message: { ...draft.message, primaryCta: v }
                })
              }
            />
            <ClaimsField
              claims={draft.message.supportingClaims}
              onChange={(claims) =>
                setDraft({
                  ...draft,
                  message: { ...draft.message, supportingClaims: claims }
                })
              }
            />
          </section>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              Lưu nháp
            </Button>
            <Button
              disabled={confirmMutation.isPending}
              onClick={() => confirmMutation.mutate()}
            >
              Xác nhận & Tiếp tục
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
