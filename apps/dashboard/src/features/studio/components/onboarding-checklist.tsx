import type { LandingPageListItem } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@dv/ui/components/shadcn/card";
import { Progress } from "@dv/ui/components/shadcn/progress";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";

import { fetchAiConnections } from "@/features/ai-connections/api";
import { aiConnectionKeys } from "@/features/ai-connections/query-keys";
import { useActiveOrganization } from "@/features/auth/auth-client";
import { fetchPaymentConnections } from "@/features/payment-connections/api";
import { paymentConnectionKeys } from "@/features/payment-connections/query-keys";
import * as m from "@/paraglide/messages.js";

import { usePersistentState } from "../lib/use-persistent-state";

// Non-tech default (docs/ops/implementation-plan.md Phase 6 "polish UX non-tech"):
// a first-time org sees the 3 things it actually needs to do next, computed from
// data already fetched elsewhere — no new backend state, just a read of existing
// queries plus one dismiss flag persisted per org.
export function OnboardingChecklist({
  landingPages
}: {
  landingPages: LandingPageListItem[];
}) {
  const { data: activeOrganization } = useActiveOrganization();
  const orgId = activeOrganization?.id ?? "anon";
  const [dismissed, setDismissed] = usePersistentState(
    `onboarding:dismissed:${orgId}`,
    false
  );

  const { data: aiConnections } = useQuery({
    queryKey: aiConnectionKeys.list(),
    queryFn: fetchAiConnections
  });
  const { data: paymentConnections } = useQuery({
    queryKey: paymentConnectionKeys.list(),
    queryFn: fetchPaymentConnections
  });

  const steps = [
    {
      done: landingPages.length > 0,
      label: m.onboardingStepCreateLanding(),
      to: "/landings" as const
    },
    {
      done: landingPages.some((lp) => lp.isPublished),
      label: m.onboardingStepPublishLanding(),
      to: "/landings" as const
    },
    {
      done: (aiConnections?.length ?? 0) > 0,
      label: m.onboardingStepConnectAi(),
      to: "/ai-connections" as const
    },
    {
      done: (paymentConnections?.length ?? 0) > 0,
      label: m.onboardingStepConnectPayment(),
      to: "/payment-connections" as const
    }
  ];
  const doneCount = steps.filter((step) => step.done).length;

  if (dismissed || doneCount === steps.length) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium">
            {m.onboardingChecklistTitle()}
          </h2>
          <p className="text-sm text-muted-foreground">
            {m.onboardingChecklistSubtitle({
              done: doneCount,
              total: steps.length
            })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={m.onboardingChecklistDismiss()}
          onClick={() => setDismissed(true)}
        >
          <X />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Progress value={(doneCount / steps.length) * 100} />
        <ul className="flex flex-col gap-2">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-2 text-sm">
              <span
                className={
                  step.done
                    ? "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : "size-5 shrink-0 rounded-full border"
                }
              >
                {step.done && <Check className="size-3.5" />}
              </span>
              {step.done ? (
                <span className="text-muted-foreground line-through">
                  {step.label}
                </span>
              ) : (
                <Link to={step.to} className="hover:underline">
                  {step.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
