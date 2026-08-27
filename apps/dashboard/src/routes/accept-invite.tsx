import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { authClient } from "@/features/auth/auth-client";
import { AuthCard } from "@/features/auth/components/auth-card";
import { savePendingInviteId } from "@/features/auth/pending-invite";
import { queryClient } from "@/lib/query-client";
import * as m from "@/paraglide/messages.js";

const acceptInviteSearchSchema = z.object({
  invitationId: z.string().optional()
});

export const Route = createFileRoute("/accept-invite")({
  validateSearch: acceptInviteSearchSchema,
  component: AcceptInvitePage
});

function AcceptInvitePage() {
  const { invitationId } = Route.useSearch();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!invitationId) {
      navigate({ to: "/landings" });
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: session } = await authClient.getSession();
      if (cancelled) return;
      if (!session) {
        savePendingInviteId(invitationId);
        await navigate({ to: "/login" });
        return;
      }
      const { error } = await authClient.organization.acceptInvitation({
        invitationId
      });
      if (cancelled) return;
      if (error) {
        setFailed(true);
        return;
      }
      // Accepting adds a new org to this user's list — the cached auth/organizations query
      // (org-switcher etc.) would otherwise still show the pre-accept list.
      await queryClient.invalidateQueries();
      await navigate({ to: "/landings" });
    })();
    return () => {
      cancelled = true;
    };
  }, [invitationId, navigate]);

  if (failed) {
    return (
      <AuthCard title={m.acceptInviteErrorTitle()}>
        <p className="text-sm text-muted-foreground">
          {m.acceptInviteErrorBody()}
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={m.acceptInviteTitle()}>
      <p className="text-sm text-muted-foreground">{m.commonLoading()}</p>
    </AuthCard>
  );
}
