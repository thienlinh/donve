import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import * as m from "@/paraglide/messages.js";

import { authClient, withAuthTimeout } from "../auth-client";

const signupSchema = z.object({
  name: z.string().min(1, "Nhập tên của bạn."),
  email: z.email("Nhập email hợp lệ."),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự.")
});

export function SignupForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setServerError(null);
    try {
      const { error } = await withAuthTimeout(
        authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: `${window.location.origin}/`
        })
      );
      if (error) {
        setServerError(error.message ?? null);
        return;
      }
    } catch {
      setServerError("Không thể kết nối máy chủ. Kiểm tra API rồi thử lại.");
      return;
    }
    await navigate({ to: "/verify-email" });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{m.signupNameLabel()}</Label>
        <Input
          id="name"
          autoComplete="name"
          aria-describedby={errors.name ? "signup-name-error" : undefined}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <p
            className="text-xs text-destructive"
            id="signup-name-error"
            role="alert"
          >
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{m.signupEmailLabel()}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-describedby={errors.email ? "signup-email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p
            className="text-xs text-destructive"
            id="signup-email-error"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{m.signupPasswordLabel()}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-describedby={
            errors.password ? "signup-password-error" : undefined
          }
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password && (
          <p
            className="text-xs text-destructive"
            id="signup-password-error"
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
        {isSubmitting ? m.commonLoading() : m.signupSubmit()}
      </Button>
    </form>
  );
}
