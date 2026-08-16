import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthCard title={m.loginTitle()}>
      <LoginForm />
      <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
        <Link to="/forgot-password" className="hover:text-foreground">
          {m.loginForgotPassword()}
        </Link>
        <p>
          {m.loginNoAccount()}{" "}
          <Link
            to="/signup"
            className="text-foreground underline underline-offset-4"
          >
            {m.loginSignupLink()}
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
