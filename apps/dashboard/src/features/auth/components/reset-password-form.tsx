import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import * as m from "@/paraglide/messages.js";

import { authClient } from "../auth-client";

const resetPasswordSchema = z.object({ newPassword: z.string().min(8) });

export function ResetPasswordForm({ token }: { token: string }) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = handleSubmit(async ({ newPassword }) => {
    setServerError(null);
    const { error } = await authClient.resetPassword({ newPassword, token });
    if (error) {
      setServerError(error.message ?? null);
      return;
    }
    setSuccess(true);
  });

  if (success) {
    return (
      <p className="text-sm text-muted-foreground">
        {m.resetPasswordSuccess()}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newPassword">{m.resetPasswordNewLabel()}</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>
      {serverError && <p className="text-xs text-destructive">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? m.commonLoading() : m.resetPasswordSubmit()}
      </Button>
    </form>
  );
}
