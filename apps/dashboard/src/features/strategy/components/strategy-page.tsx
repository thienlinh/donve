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
      toast.add({ title: "Tạo Strategy Brief thất bại", type: "error" })
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
      toast.add({ title: "Đã xác nhận Strategy Brief", type: "success" });
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
        <span className="text-sm text-muted-foreground">✓ Business</span>
        <span className="text-sm font-medium">● Strategy</span>
        <span className="text-sm text-muted-foreground">○ Architecture</span>
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
          {generateMutation.isPending ? "Đang tạo…" : "Tạo Strategy Brief →"}
        </Button>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Business</h3>
            <TextField
              label="Product"
              value={draft.business.product}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  business: { ...draft.business, product: v }
                })
              }
            />
            <TextField
              label="Category"
              value={draft.business.category}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  business: { ...draft.business, category: v }
                })
              }
            />
            <TextField
              label="Business model"
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
            <h3 className="text-sm font-semibold">Customer</h3>
            <TextField
              label="ICP"
              value={draft.customer.icp}
              onChange={(v) =>
                setDraft({ ...draft, customer: { ...draft.customer, icp: v } })
              }
            />
            <StringArrayField
              label="Pain points"
              value={draft.customer.painPoints}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  customer: { ...draft.customer, painPoints: v }
                })
              }
            />
            <StringArrayField
              label="Desired outcomes"
              value={draft.customer.desiredOutcomes}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  customer: { ...draft.customer, desiredOutcomes: v }
                })
              }
            />
            <StringArrayField
              label="Objections"
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
            <h3 className="text-sm font-semibold">Market</h3>
            <StringArrayField
              label="Competitors"
              value={draft.market.competitors}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  market: { ...draft.market, competitors: v }
                })
              }
            />
            <StringArrayField
              label="Differentiators"
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
            <h3 className="text-sm font-semibold">Funnel</h3>
            <TextField
              label="Conversion goal"
              value={draft.funnel.conversionGoal}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  funnel: { ...draft.funnel, conversionGoal: v }
                })
              }
            />
            <TextField
              label="Traffic source"
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
            <h3 className="text-sm font-semibold">Offer</h3>
            <TextField
              label="Core offer"
              value={draft.offer.coreOffer}
              onChange={(v) =>
                setDraft({ ...draft, offer: { ...draft.offer, coreOffer: v } })
              }
            />
            <TextField
              label="Guarantee"
              value={draft.offer.guarantee}
              onChange={(v) =>
                setDraft({ ...draft, offer: { ...draft.offer, guarantee: v } })
              }
            />
          </section>

          <section className="flex flex-col gap-3 rounded-md border p-4">
            <h3 className="text-sm font-semibold">Message</h3>
            <TextField
              label="Value proposition"
              value={draft.message.valueProposition}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  message: { ...draft.message, valueProposition: v }
                })
              }
            />
            <TextField
              label="Primary CTA"
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
