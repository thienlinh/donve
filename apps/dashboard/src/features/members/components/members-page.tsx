import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@dv/ui/components/shadcn/alert-dialog";
import { Avatar, AvatarFallback } from "@dv/ui/components/shadcn/avatar";
import { Badge } from "@dv/ui/components/shadcn/badge";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Switch } from "@dv/ui/components/shadcn/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Trash2 } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { authClient } from "@/features/auth/auth-client";
import {
  useActiveOrganizationQuery,
  useSessionQuery
} from "@/features/auth/queries";
import {
  fetchSalesConfigList,
  updateMemberSalesConfig
} from "@/features/leads/api";
import { leadKeys } from "@/features/leads/query-keys";
import * as m from "@/paraglide/messages.js";

import { roleBadgeVariant, roleLabel } from "../role-labels";
import { InviteMemberDialog } from "./invite-member-dialog";

export function MembersPage() {
  const { data: session } = useSessionQuery();
  const {
    data: activeOrganization,
    isPending,
    error
  } = useActiveOrganizationQuery();

  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  const { data: salesConfigList } = useQuery({
    queryKey: leadKeys.salesConfig(),
    queryFn: fetchSalesConfigList,
    enabled: canManage
  });
  const pendingInvitations =
    activeOrganization?.invitations.filter(
      (invitation) => invitation.status === "pending"
    ) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.membersTitle()}</CardTitle>
          <CardDescription>{m.membersDescription()}</CardDescription>
          {canManage && activeOrganization && (
            <CardAction>
              <InviteMemberDialog organizationId={activeOrganization.id} />
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <QueryState
            isPending={isPending}
            error={error}
            isEmpty={false}
            errorTitle={m.membersLoadErrorTitle()}
            emptyTitle=""
          />

          {activeOrganization && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.membersColumnMember()}</TableHead>
                  <TableHead>{m.membersColumnRole()}</TableHead>
                  {canManage && (
                    <TableHead className="hidden sm:table-cell">
                      {m.membersColumnSeeAllLeads()}
                    </TableHead>
                  )}
                  {canManage && (
                    <TableHead className="text-end">
                      {m.membersColumnActions()}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrganization.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="max-w-40 sm:max-w-none">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" className="shrink-0">
                          <AvatarFallback>
                            {(member.user.name || member.user.email)
                              .slice(0, 1)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {member.user.name || member.user.email}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {member.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleBadgeVariant[member.role]}>
                        {roleLabel(member.role)}
                      </Badge>
                    </TableCell>
                    {canManage && (
                      <TableCell className="hidden sm:table-cell">
                        {member.role === "sales" && (
                          <SeeAllLeadsToggle
                            membershipId={member.id}
                            seeAllLeads={
                              salesConfigList?.members.find(
                                (row) => row.membershipId === member.id
                              )?.seeAllLeads ?? false
                            }
                          />
                        )}
                      </TableCell>
                    )}
                    {canManage && (
                      <TableCell className="text-end">
                        {member.role !== "owner" &&
                          member.userId !== session?.user.id && (
                            <RemoveMemberAction
                              organizationId={activeOrganization.id}
                              memberId={member.id}
                              memberLabel={
                                member.user.name || member.user.email
                              }
                            />
                          )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {canManage && activeOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>{m.membersPendingTitle()}</CardTitle>
            <CardDescription>{m.membersPendingDescription()}</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingInvitations.length === 0 ? (
              <QueryState
                isPending={false}
                error={null}
                isEmpty
                errorTitle=""
                emptyTitle={m.membersPendingEmptyTitle()}
                emptyIcon={<Mail />}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{m.membersColumnEmail()}</TableHead>
                    <TableHead>{m.membersColumnRole()}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {m.membersColumnExpires()}
                    </TableHead>
                    <TableHead className="text-end">
                      {m.membersColumnActions()}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvitations.map((invitation) => {
                    const expiresAt = new Date(invitation.expiresAt);
                    // oxlint-disable-next-line react-doctor/rendering-hydration-mismatch-time, react/purity -- this dashboard is a client-only Vite SPA (tech-stack.md), never server-rendered, so there's no hydration pass for `Date.now()` to mismatch against; re-evaluating "expired" on each render is the intended behavior here.
                    const isExpired = expiresAt.getTime() < Date.now();
                    return (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">
                          {invitation.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleBadgeVariant[invitation.role]}>
                            {roleLabel(invitation.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          <span className="flex items-center gap-2">
                            {expiresAt.toLocaleDateString()}
                            {isExpired && (
                              <Badge variant="destructive">
                                {m.membersInvitationExpiredBadge()}
                              </Badge>
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-end">
                          <CancelInviteAction
                            invitationId={invitation.id}
                            email={invitation.email}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/** FR-E-04 — off by default (sales sees only assigned leads); on lets them see the whole org's leads. */
function SeeAllLeadsToggle({
  membershipId,
  seeAllLeads
}: {
  membershipId: string;
  seeAllLeads: boolean;
}) {
  const queryClient = useQueryClient();
  const toggle = useMutation({
    mutationFn: (next: boolean) =>
      updateMemberSalesConfig(membershipId, { seeAllLeads: next }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: leadKeys.salesConfig() }),
    onError: () =>
      toast.add({ title: m.membersSeeAllLeadsErrorToast(), type: "error" })
  });

  return (
    <Switch
      checked={seeAllLeads}
      disabled={toggle.isPending}
      onCheckedChange={(next) => toggle.mutate(next)}
    />
  );
}

function RemoveMemberAction({
  organizationId,
  memberId,
  memberLabel
}: {
  organizationId: string;
  memberId: string;
  memberLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async () => {
    setIsRemoving(true);
    setError(null);
    const { error: removeError } = await authClient.organization.removeMember({
      organizationId,
      memberIdOrEmail: memberId
    });
    setIsRemoving(false);
    if (removeError) {
      setError(removeError.message ?? null);
      return;
    }
    setOpen(false);
    toast.add({
      title: m.membersRemoveSuccessToast({ member: memberLabel }),
      type: "success"
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.membersRemoveConfirmTitle({ member: memberLabel })}
          >
            <Trash2 className="text-destructive" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {m.membersRemoveConfirmTitle({ member: memberLabel })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {m.membersRemoveConfirmBody()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isRemoving}
            onClick={handleRemove}
          >
            {isRemoving ? m.commonLoading() : m.membersRemoveConfirmAction()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CancelInviteAction({
  invitationId,
  email
}: {
  invitationId: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setIsCanceling(true);
    setError(null);
    const { error: cancelError } =
      await authClient.organization.cancelInvitation({ invitationId });
    setIsCanceling(false);
    if (cancelError) {
      setError(cancelError.message ?? null);
      return;
    }
    setOpen(false);
    toast.add({
      title: m.membersCancelInviteSuccessToast({ email }),
      type: "success"
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={m.membersCancelInviteConfirmTitle({ email })}
          >
            <Trash2 className="text-destructive" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {m.membersCancelInviteConfirmTitle({ email })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {m.membersCancelInviteConfirmBody()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isCanceling}
            onClick={handleCancel}
          >
            {isCanceling
              ? m.commonLoading()
              : m.membersCancelInviteConfirmAction()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
