import { createFileRoute } from "@tanstack/react-router";

import { OnboardingPage } from "@/features/onboarding/components/onboarding-page";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: OnboardingPage
});
