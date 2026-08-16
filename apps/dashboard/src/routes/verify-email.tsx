import { createFileRoute } from "@tanstack/react-router"

import { AuthCard } from "@/features/auth/components/auth-card"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  return (
    <AuthCard title={m.verifyEmailTitle()}>
      <p className="text-sm text-muted-foreground">{m.verifyEmailBody()}</p>
    </AuthCard>
  )
}
