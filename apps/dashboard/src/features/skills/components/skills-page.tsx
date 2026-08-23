import { can } from "@dv/auth/permissions";
import type { Skill } from "@dv/contracts";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from "@dv/ui/components/shadcn/empty";
import { Spinner } from "@dv/ui/components/shadcn/spinner";
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
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { useActiveOrganization, useSession } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import { fetchSkills, removeSkill, updateSkill } from "../api";
import { skillKeys } from "../query-keys";
import { SkillFormDialog } from "./skill-form-dialog";

export function SkillsPage() {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage = myMembership
    ? can(myMembership.role, "promptSkillsTenant")
    : false;

  const {
    data: skills,
    isPending,
    error
  } = useQuery({ queryKey: skillKeys.list(), queryFn: fetchSkills });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.skillsTitle()}</CardTitle>
          <CardDescription>{m.skillsDescription()}</CardDescription>
          {canManage && (
            <CardAction>
              <SkillFormDialog />
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> {m.commonLoading()}
            </div>
          )}
          {error && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{m.skillsLoadErrorTitle()}</EmptyTitle>
                <EmptyDescription>{error.message}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {skills && skills.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{m.skillsEmptyTitle()}</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
          {skills && skills.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.skillColumnName()}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {m.skillColumnSlug()}
                  </TableHead>
                  <TableHead>{m.skillColumnType()}</TableHead>
                  <TableHead>{m.skillColumnDefault()}</TableHead>
                  <TableHead className="text-end">
                    {m.skillColumnActions()}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <SkillRow
                    key={skill.id}
                    skill={skill}
                    canManage={canManage}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SkillRow({ skill, canManage }: { skill: Skill; canManage: boolean }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const isPlatform = skill.orgId === null;
  const isEditable = canManage && !isPlatform;

  const toggleDefault = useMutation({
    mutationFn: (isActiveDefault: boolean) =>
      updateSkill(skill.id, { isActiveDefault }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: skillKeys.list() }),
    onError: () =>
      toast.add({ title: m.skillToggleDefaultErrorToast(), type: "error" })
  });

  const remove = useMutation({
    mutationFn: () => removeSkill(skill.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.list() });
      setOpen(false);
    },
    onError: () =>
      toast.add({ title: m.skillRemoveErrorToast(), type: "error" })
  });

  return (
    <TableRow>
      <TableCell className="font-medium">{skill.name}</TableCell>
      <TableCell className="hidden font-mono text-xs sm:table-cell">
        {skill.slug}
      </TableCell>
      <TableCell>
        <Badge variant={isPlatform ? "secondary" : "outline"}>
          {isPlatform ? m.skillTypePlatform() : m.skillTypeTenant()}
        </Badge>
      </TableCell>
      <TableCell>
        <Switch
          checked={skill.isActiveDefault}
          disabled={!isEditable || toggleDefault.isPending}
          onCheckedChange={(checked) => toggleDefault.mutate(checked)}
        />
      </TableCell>
      <TableCell className="flex justify-end gap-1">
        {isEditable && <SkillFormDialog skill={skill} />}
        {isEditable && (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={m.skillRemoveAction()}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {m.skillRemoveConfirmTitle()}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {m.skillRemoveConfirmBody()}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{m.commonCancel()}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate()}
                >
                  {remove.isPending ? m.commonLoading() : m.skillRemoveAction()}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}
