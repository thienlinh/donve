import { can } from "@dv/auth/permissions";
import { createPromptTemplateSchema, type PromptTemplate } from "@dv/contracts";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@dv/ui/components/shadcn/table";
import { toast } from "@dv/ui/components/shadcn/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { QueryState } from "@/components/query-state";
import { useActiveOrganization, useSession } from "@/features/auth/auth-client";
import * as m from "@/paraglide/messages.js";

import { createPromptTemplate, fetchPromptTemplates } from "../api";
import { promptTemplateKeys } from "../query-keys";

export function PromptTemplatesPage() {
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const myMembership = activeOrganization?.members.find(
    (member) => member.userId === session?.user.id
  );
  const canManage = myMembership
    ? can(myMembership.role, "promptSkillsTenant")
    : false;

  const {
    data: templates,
    isPending,
    error
  } = useQuery({
    queryKey: promptTemplateKeys.list(),
    queryFn: fetchPromptTemplates
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{m.promptTemplatesTitle()}</CardTitle>
          <CardDescription>{m.promptTemplatesDescription()}</CardDescription>
          {canManage && (
            <CardAction>
              <CreatePromptTemplateDialog />
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <QueryState
            isPending={isPending}
            error={error}
            isEmpty={templates?.length === 0}
            errorTitle={m.promptTemplatesLoadErrorTitle()}
            emptyTitle={m.promptTemplatesEmptyTitle()}
            emptyIcon={<FileText />}
          />
          {templates && templates.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.promptTemplateColumnSlug()}</TableHead>
                  <TableHead>{m.promptTemplateColumnType()}</TableHead>
                  <TableHead>{m.promptTemplateColumnVersion()}</TableHead>
                  <TableHead className="text-end">
                    {m.skillColumnActions()}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TemplateRow key={template.id} template={template} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TemplateRow({ template }: { template: PromptTemplate }) {
  const isPlatform = template.orgId === null;
  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">
        {template.slug}
      </TableCell>
      <TableCell>
        <Badge variant={isPlatform ? "secondary" : "outline"}>
          {isPlatform ? m.skillTypePlatform() : m.skillTypeTenant()}
        </Badge>
      </TableCell>
      <TableCell>v{template.version}</TableCell>
      <TableCell className="text-end">
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link to="/prompt-templates/$id" params={{ id: template.id }} />
          }
        >
          {m.promptTemplateOpenAction()}
        </Button>
      </TableCell>
    </TableRow>
  );
}

/** Minimal creation: a single starter section, filled out further from the detail page's editor. */
function CreatePromptTemplateDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(createPromptTemplateSchema),
    defaultValues: {
      slug: "",
      sections: [{ key: "main", content: "" }],
      variables: []
    }
  });

  const create = useMutation({
    mutationFn: createPromptTemplate,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: promptTemplateKeys.list() });
      reset();
      setOpen(false);
      navigate({ to: "/prompt-templates/$id", params: { id: created.id } });
    },
    onError: () =>
      toast.add({ title: m.promptTemplateSaveErrorToast(), type: "error" })
  });

  const onSubmit = handleSubmit((values) => create.mutate(values));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus /> {m.promptTemplateCreateButton()}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.promptTemplateCreateDialogTitle()}</DialogTitle>
          <DialogDescription>
            {m.promptTemplateCreateDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-slug">{m.promptTemplateSlugLabel()}</Label>
            <Input
              id="template-slug"
              className="w-full"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  {m.commonCancel()}
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting || create.isPending}>
              {isSubmitting || create.isPending
                ? m.commonLoading()
                : m.commonCreate()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
