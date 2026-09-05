import {
  orgPlanValues,
  refundReasonValues,
  type OrgPlan,
  type PlatformOrgDetail,
  type RefundReason
} from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

import { refundAssist, updateOrgSubscription } from "../api";
import { platformKeys } from "../query-keys";

/** `""` means "no override" — fall back to whatever the org's plan includes. */
type OverrideChoice = "" | "true" | "false";

function currentChoice(
  detail: PlatformOrgDetail,
  featureKey: string
): OverrideChoice {
  const override = detail.featureOverrides.find(
    (row) => row.featureKey === featureKey
  );
  return override ? override.enabled : "";
}

/**
 * Billing tab of the platform org detail (platform-admin.md §11): current plan + AI credit
 * usage, the per-org feature-flag override editor (§12), and refund-assist. There is no
 * platform-side invoice table on this platform yet — the tenant's `payments` rows are its
 * customers paying *it* — so "payment history" here is deliberately the AI credit ledger
 * summary rather than an invented invoice list.
 */
export function PlatformOrgBillingTab({
  detail,
  canWrite
}: {
  detail: PlatformOrgDetail;
  canWrite: boolean;
}) {
  const orgId = detail.org.id;
  const planFeatureKeySet = new Set(detail.planFeatureKeys);
  const queryClient = useQueryClient();
  // Only the fields the operator actually touched live in state; everything else reads straight
  // off `detail`, so a refetch after a save shows through instead of leaving a stale copy behind.
  const [planEdit, setPlanEdit] = useState<OrgPlan | null>(null);
  const [overrideEdits, setOverrideEdits] = useState<
    Record<string, OverrideChoice>
  >({});
  const [reason, setReason] = useState("");
  const [orderId, setOrderId] = useState("");
  const [refundReason, setRefundReason] = useState<RefundReason>(
    refundReasonValues[0]
  );

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: platformKeys.org(orgId) }),
      queryClient.invalidateQueries({ queryKey: platformKeys.orgs() })
    ]);

  const saveSubscription = useMutation({
    mutationFn: () =>
      updateOrgSubscription(orgId, {
        plan: planEdit ?? detail.org.plan,
        featureOverrides: detail.availableFeatures.map((flag) => {
          const choice =
            overrideEdits[flag.key] ?? currentChoice(detail, flag.key);
          return {
            featureKey: flag.key,
            enabled: choice === "" ? null : choice === "true"
          };
        }),
        reason
      }),
    onSuccess: async () => {
      setReason("");
      toast.add({ title: m.platformActionDoneToast(), type: "success" });
      await invalidate();
    },
    onError: () =>
      toast.add({ title: m.platformActionErrorToast(), type: "error" })
  });

  const submitRefund = useMutation({
    mutationFn: () => refundAssist(orgId, { orderId, refundReason, reason }),
    onSuccess: async () => {
      setOrderId("");
      setReason("");
      toast.add({ title: m.platformRefundAssistDoneToast(), type: "success" });
      await invalidate();
    },
    onError: () =>
      toast.add({ title: m.platformActionErrorToast(), type: "error" })
  });

  const reasonTooShort = reason.trim().length < 3;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{m.platformSubscriptionTitle()}</CardTitle>
          <CardDescription>
            {m.platformSubscriptionDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground">
                {m.platformStatAiCreditBalance()}
              </div>
              <div className="text-lg font-semibold">
                {detail.org.aiCreditBalance}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {m.platformStatAiCreditSpent()}
              </div>
              <div className="text-lg font-semibold">
                {detail.stats.aiCreditSpent}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {m.platformStatTrialUses()}
              </div>
              <div className="text-lg font-semibold">
                {detail.org.trialUsesRemaining}
              </div>
            </div>
          </div>

          <div className="max-w-xs space-y-2">
            <Label htmlFor="platform-plan">{m.platformPlanLabel()}</Label>
            <NativeSelect
              id="platform-plan"
              value={planEdit ?? detail.org.plan}
              disabled={!canWrite}
              onChange={(e) => setPlanEdit(e.target.value as OrgPlan)}
            >
              {orgPlanValues.map((value) => (
                <NativeSelectOption key={value} value={value}>
                  {value}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label>{m.platformFeaturesLabel()}</Label>
            <p className="text-xs text-muted-foreground">
              {m.platformFeaturesHint()}
            </p>
            {detail.availableFeatures.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {m.platformFeaturesEmpty()}
              </p>
            ) : (
              detail.availableFeatures.map((flag) => (
                <div
                  key={flag.key}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="min-w-40 text-sm font-medium">
                    {flag.key}
                  </span>
                  <NativeSelect
                    className="max-w-48"
                    value={
                      overrideEdits[flag.key] ?? currentChoice(detail, flag.key)
                    }
                    disabled={!canWrite}
                    onChange={(e) =>
                      setOverrideEdits(
                        (prev: Record<string, OverrideChoice>) => ({
                          ...prev,
                          [flag.key]: e.target.value as OverrideChoice
                        })
                      )
                    }
                  >
                    <NativeSelectOption value="">
                      {planFeatureKeySet.has(flag.key)
                        ? m.platformFeaturePlanIncluded()
                        : m.platformFeaturePlanExcluded()}
                    </NativeSelectOption>
                    <NativeSelectOption value="true">
                      {m.platformFeatureForceOn()}
                    </NativeSelectOption>
                    <NativeSelectOption value="false">
                      {m.platformFeatureForceOff()}
                    </NativeSelectOption>
                  </NativeSelect>
                  <span className="text-xs text-muted-foreground">
                    {flag.description}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {canWrite && (
        <Card>
          <CardHeader>
            <CardTitle>{m.platformRefundAssistTitle()}</CardTitle>
            <CardDescription>
              {m.platformRefundAssistDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Input
                className="max-w-xs"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={m.platformRefundOrderIdPlaceholder()}
              />
              <NativeSelect
                className="max-w-48"
                value={refundReason}
                onChange={(e) =>
                  setRefundReason(e.target.value as RefundReason)
                }
              >
                {refundReasonValues.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {value}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <Button
              variant="outline"
              disabled={
                submitRefund.isPending ||
                reasonTooShort ||
                orderId.trim() === ""
              }
              onClick={() => submitRefund.mutate()}
            >
              {m.platformRefundAssistAction()}
            </Button>
          </CardContent>
        </Card>
      )}

      {canWrite && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Label htmlFor="platform-billing-reason">
              {m.platformReasonLabel()}
            </Label>
            <Textarea
              id="platform-billing-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={m.platformReasonPlaceholder()}
            />
            <p className="text-xs text-muted-foreground">
              {m.platformReasonSharedHint()}
            </p>
            <Button
              disabled={saveSubscription.isPending || reasonTooShort}
              onClick={() => saveSubscription.mutate()}
            >
              {m.platformSubscriptionSave()}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
