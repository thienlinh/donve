import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { SignupForm } from "@/features/auth/components/signup-form";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/signup")({
  component: SignupPage
});

function SignupPage() {
  return (
    <AuthCard title={m.signupTitle()}>
      <SignupForm />
      <p className="mt-4 text-sm text-muted-foreground">
        {m.signupHasAccount()}{" "}
        <Link
          to="/login"
          className="text-foreground underline underline-offset-4"
        >
          {m.signupLoginLink()}
        </Link>
      </p>
    </AuthCard>
  );
}
