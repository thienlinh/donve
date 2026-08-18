import { membershipRoleValues } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@dv/ui/components/shadcn/dialog";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import { roleLabel } from "../role-labels";

const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(membershipRoleValues)
});

export function InviteMemberDialog({
  organizationId
}: {
  organizationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "editor" as const }
  });

  const onSubmit = handleSubmit(async ({ email, role }) => {
    setServerError(null);
    const { error } = await authClient.organization.inviteMember({
      email,
      role,
      organizationId
    });
    if (error) {
      setServerError(error.message ?? null);
      return;
    }
    reset();
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setServerError(null);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <UserPlus /> {m.membersInviteButton()}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.membersInviteDialogTitle()}</DialogTitle>
          <DialogDescription>
            {m.membersInviteDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">{m.membersEmailLabel()}</Label>
            <Input
              id="invite-email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">{m.membersRoleLabel()}</Label>
            <NativeSelect id="invite-role" {...register("role")}>
              {membershipRoleValues.map((role) => (
                <NativeSelectOption key={role} value={role}>
                  {roleLabel(role)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          {serverError && (
            <p className="text-xs text-destructive">{serverError}</p>
          )}
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  {m.commonCancel()}
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? m.commonLoading() : m.membersInviteSubmit()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
