import { Button } from "@dv/ui/components/button"
import { createFileRoute, Link } from "@tanstack/react-router"

import { AuthCard } from "@/features/auth/components/auth-card"
import * as m from "@/paraglide/messages.js"

export const Route = createFileRoute("/verified")({
  component: VerifiedPage,
})

function VerifiedPage() {
  return (
    <AuthCard title={m.verifiedTitle()}>
      <p className="text-sm text-muted-foreground">{m.verifiedBody()}</p>
      <Button render={<Link to="/login" />} className="mt-4 w-full">
        {m.verifiedLoginLink()}
      </Button>
    </AuthCard>
  )
}
