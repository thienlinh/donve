import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import * as m from "@/paraglide/messages.js";

const resetPasswordSearchSchema = z.object({
  token: z.string().optional()
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();

  return (
    <AuthCard title={m.resetPasswordTitle()}>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-sm text-destructive">
          {m.resetPasswordInvalidLink()}
        </p>
      )}
    </AuthCard>
  );
}
