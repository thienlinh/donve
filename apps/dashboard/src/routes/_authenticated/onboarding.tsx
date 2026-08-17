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
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: OnboardingPage
});

const onboardingSchema = z.object({ name: z.string().min(1) });

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function OnboardingPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(onboardingSchema) });

  const onSubmit = handleSubmit(async ({ name }) => {
    const { data: org, error } = await authClient.organization.create({
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`
    });
    if (error || !org) return;
    await authClient.organization.setActive({ organizationId: org.id });
    await navigate({ to: "/landings" });
  });

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">{m.onboardingTitle()}</CardTitle>
          <CardDescription>{m.onboardingBody()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{m.onboardingOrgNameLabel()}</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? m.commonLoading() : m.onboardingSubmit()}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
