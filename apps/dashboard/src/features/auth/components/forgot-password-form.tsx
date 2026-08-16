import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import * as m from "@/paraglide/messages.js";

import { authClient } from "../auth-client";

const forgotPasswordSchema = z.object({ email: z.email() });

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    // Don't reveal whether the email exists — same message either way.
    setSent(true);
  });

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground">{m.forgotPasswordSent()}</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{m.forgotPasswordBody()}</p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{m.forgotPasswordEmailLabel()}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? m.commonLoading() : m.forgotPasswordSubmit()}
      </Button>
    </form>
  );
}
