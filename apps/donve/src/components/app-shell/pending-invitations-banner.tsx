import { Button } from "@dv/ui/components/shadcn/button";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";

import { authClient } from "@/features/auth/auth-client";
import { roleLabel } from "@/features/members/role-labels";
import * as m from "@/paraglide/messages.js";

/**
 * An invite email is also sent (packages/auth/src/config.ts `sendInvitationEmail`) with a
 * deep link into /accept-invite, which auto-accepts once the invitee is signed in. This
 * banner stays the fallback/source of truth either way — it lists every pending invitation
 * for the current user regardless of which one (if any) was clicked from email.
 */
export function PendingInvitationsBanner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["organization", "user-invitations"],
    queryFn: async () => {
      const { data: invitations } =
        await authClient.organization.listUserInvitations();
      return (invitations ?? []).filter(
        (invitation) => invitation.status === "pending"
      );
    }
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-2">
      {data.map((invitation) => (
        <InvitationRow
          key={invitation.id}
          invitation={invitation}
          onSettled={async () => {
            await queryClient.invalidateQueries({
              queryKey: ["organization", "user-invitations"]
            });
          }}
          onAccepted={async () => {
            // Accepting adds a new org to this user's list — the cached auth/organizations
            // query (org-switcher etc.) would otherwise still show the pre-accept list.
            await queryClient.invalidateQueries();
            await navigate({ to: "/offers" });
          }}
        />
      ))}
    </div>
  );
}

function InvitationRow({
  invitation,
  onSettled,
  onAccepted
}: {
  invitation: {
    id: string;
    organizationName: string;
    role: string;
  };
  onSettled: () => Promise<void>;
  onAccepted: () => Promise<void>;
}) {
  const [isPending, setIsPending] = useState<"accept" | "reject" | null>(null);

  const respond = async (action: "accept" | "reject") => {
    setIsPending(action);
    const { error } =
      action === "accept"
        ? await authClient.organization.acceptInvitation({
            invitationId: invitation.id
          })
        : await authClient.organization.rejectInvitation({
            invitationId: invitation.id
          });
    setIsPending(null);
    if (error) {
      toast.add({
        title: m.membersInvitationRespondErrorToast(),
        type: "error"
      });
      return;
    }
    await onSettled();
    if (action === "accept") onAccepted();
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <Mail className="size-4 text-muted-foreground" />
        <span>
          {m.membersInvitationBannerText({
            org: invitation.organizationName,
            role: roleLabel(invitation.role as Parameters<typeof roleLabel>[0])
          })}
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isPending !== null}
          onClick={() => respond("reject")}
        >
          {isPending === "reject"
            ? m.commonLoading()
            : m.membersInvitationReject()}
        </Button>
        <Button
          size="sm"
          disabled={isPending !== null}
          onClick={() => respond("accept")}
        >
          {isPending === "accept"
            ? m.commonLoading()
            : m.membersInvitationAccept()}
        </Button>
      </div>
    </div>
  );
}
