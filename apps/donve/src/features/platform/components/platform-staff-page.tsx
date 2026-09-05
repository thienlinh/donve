import { platformStaffRoleValues } from "@dv/contracts";
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
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@dv/ui/components/shadcn/card";
import { Input } from "@dv/ui/components/shadcn/input";
import {
  NativeSelect,
  NativeSelectOption
} from "@dv/ui/components/shadcn/native-select";
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
import { Users } from "lucide-react";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import * as m from "@/paraglide/messages.js";

import { fetchStaff, removeStaff, upsertStaff } from "../api";
import { platformKeys } from "../query-keys";

/** Staff-management tab (platform-admin.md §6) — only reachable when the viewer's own role is
 * `platform_admin` (gated in `platform-orgs-page.tsx`), since these endpoints 403 for anyone
 * else anyway. Replaces the hand-edit-the-DB / `bun run grant-platform-staff` workflow. */
export function PlatformStaffPage() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<(typeof platformStaffRoleValues)[number]>("support");

  const { data, error, isPending } = useQuery({
    queryKey: platformKeys.staff(),
    queryFn: fetchStaff
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: platformKeys.staff() });

  const addStaff = useMutation({
    mutationFn: upsertStaff,
    onSuccess: async (_result, input) => {
      setEmail("");
      toast.add({
        title: m.platformStaffAddSuccessToast({ email: input.email }),
        type: "success"
      });
      await invalidate();
    },
    onError: () =>
      toast.add({ title: m.platformStaffAddErrorToast(), type: "error" })
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.platformTabStaff()}</CardTitle>
        <CardDescription>{m.platformStaffDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            addStaff.mutate({ email: email.trim(), role });
          }}
        >
          <Input
            className="max-w-xs"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={m.platformStaffAddEmailPlaceholder()}
          />
          <NativeSelect
            className="max-w-40"
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as (typeof platformStaffRoleValues)[number]
              )
            }
          >
            {platformStaffRoleValues.map((value) => (
              <NativeSelectOption key={value} value={value}>
                {value}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Button type="submit" disabled={addStaff.isPending}>
            {m.platformStaffAddAction()}
          </Button>
        </form>

        <QueryState
          isPending={isPending}
          error={error}
          isEmpty={(data ?? []).length === 0}
          errorTitle={m.platformStaffLoadErrorTitle()}
          emptyTitle={m.platformStaffEmptyTitle()}
          emptyIcon={<Users />}
          loadingLabel={m.platformStaffLoading()}
        />

        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{m.platformStaffColumnEmail()}</TableHead>
                <TableHead>{m.platformStaffColumnRole()}</TableHead>
                <TableHead>{m.platformStaffColumnCreated()}</TableHead>
                <TableHead>{m.platformStaffColumnActions()}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <RemoveStaffAction
                      userId={member.userId}
                      email={member.email}
                      onRemoved={invalidate}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/** Revoking platform-staff access is as powerful as removing an org member (it grants
 * cross-tenant reach), so it gets the same confirm-before-destroy treatment as
 * `RemoveMemberAction` in members-page.tsx rather than firing on a single click. */
function RemoveStaffAction({
  userId,
  email,
  onRemoved
}: {
  userId: string;
  email: string;
  onRemoved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const remove = useMutation({
    mutationFn: () => removeStaff(userId),
    onSuccess: () => {
      setOpen(false);
      onRemoved();
      toast.add({
        title: m.platformStaffRemoveSuccessToast({ email }),
        type: "success"
      });
    },
    onError: () =>
      toast.add({ title: m.platformStaffRemoveErrorToast(), type: "error" })
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="sm">
            {m.platformStaffRemoveAction()}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {m.platformStaffRemoveConfirmTitle({ email })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {m.platformStaffRemoveConfirmBody()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={remove.isPending}
            onClick={() => remove.mutate()}
          >
            {remove.isPending
              ? m.commonLoading()
              : m.platformStaffRemoveConfirmAction()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
