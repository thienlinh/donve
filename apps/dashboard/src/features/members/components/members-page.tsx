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
import { Empty, EmptyHeader, EmptyTitle } from "@dv/ui/components/shadcn/empty";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  authClient,
  useActiveOrganization,
  useSession
} from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import { roleBadgeVariant, roleLabel } from "../role-labels";
import { InviteMemberDialog } from "./invite-member-dialog";

export function MembersPage() {
  const { data: session } = useSession();
  const { data: activeOrganization, isPending } = useActiveOrganization();

  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage =
    myMembership?.role === "owner" || myMembership?.role === "admin";
  const pendingInvitations =
    activeOrganization?.invitations.filter(
      (invitation) => invitation.status === "pending"
    ) ?? [];

  return (
    <div className="flex flex-col gap-6">
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
          {isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> {m.commonLoading()}
            </div>
          )}

          {activeOrganization && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.membersColumnMember()}</TableHead>
                  <TableHead>{m.membersColumnRole()}</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>
                            {(member.user.name || member.user.email)
                              .slice(0, 1)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {member.user.name || member.user.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
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
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{m.membersPendingEmptyTitle()}</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{m.membersColumnEmail()}</TableHead>
                    <TableHead>{m.membersColumnRole()}</TableHead>
                    <TableHead>{m.membersColumnExpires()}</TableHead>
                    <TableHead className="text-end">
                      {m.membersColumnActions()}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleBadgeVariant[invitation.role]}>
                          {roleLabel(invitation.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-end">
                        <CancelInviteAction
                          invitationId={invitation.id}
                          email={invitation.email}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
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
