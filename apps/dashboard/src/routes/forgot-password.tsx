import { createFileRoute } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthCard title={m.forgotPasswordTitle()}>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
