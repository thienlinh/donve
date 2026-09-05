import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { queryClient } from "@/lib/query-client";
import * as m from "@/paraglide/messages.js";

import { authClient, withAuthTimeout } from "../auth-client";
import { takePendingInviteId } from "../pending-invite";

const loginSchema = z.object({
  email: z.email("Nhập email hợp lệ."),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự.")
});

export function LoginForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setServerError(null);
    try {
      const { error } = await withAuthTimeout(
        authClient.signIn.email({ email, password })
      );
      if (error) {
        setServerError(m.loginError());
        return;
      }
    } catch {
      setServerError("Không thể kết nối máy chủ. Kiểm tra API rồi thử lại.");
      return;
    }
    // A previous session in this tab (this account signing back in, or a different one) can
    // leave the auth/session query cached as "signed out" within its staleTime window —
    // without this, `_authenticated`'s beforeLoad reads that stale cache and bounces straight
    // back to /login right after a successful sign-in.
    queryClient.clear();
    // Resume an invite accept flow that bounced an unauthenticated visitor here
    // (see accept-invite.tsx / pending-invite.ts) instead of dropping them onto
    // the default landing page.
    const invitationId = takePendingInviteId();
    if (invitationId) {
      await navigate({ to: "/accept-invite", search: { invitationId } });
      return;
    }
    await navigate({ to: "/offers" });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{m.loginEmailLabel()}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-describedby={errors.email ? "login-email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p
            className="text-xs text-destructive"
            id="login-email-error"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{m.loginPasswordLabel()}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-describedby={
            errors.password ? "login-password-error" : undefined
          }
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p
            className="text-xs text-destructive"
            id="login-password-error"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}
      </div>
      {serverError && (
        <p aria-live="polite" className="text-xs text-destructive" role="alert">
          {serverError}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? m.commonLoading() : m.loginSubmit()}
      </Button>
    </form>
  );
}
