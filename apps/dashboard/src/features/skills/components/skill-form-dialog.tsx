import { createSkillSchema, type Skill } from "@dv/contracts";
import { MessageResponse } from "@dv/ui/components/ai-elements/message";
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
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import * as m from "@/paraglide/messages.js";

import { createSkill, updateSkill } from "../api";
import { skillKeys } from "../query-keys";

/**
 * Handles both create (no `skill` prop) and edit (tenant-owned `skill` passed in) — same shape
 * of form either way, only the mutation and whether `slug` is editable differ. Platform skills
 * never reach this dialog in edit mode (skills-page.tsx only wires it up for tenant rows).
 */
export function SkillFormDialog({ skill }: { skill?: Skill }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const isEdit = Boolean(skill);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      slug: skill?.slug ?? "",
      name: skill?.name ?? "",
      content: skill?.content ?? ""
    }
  });
  const content = useWatch({ control, name: "content" });

  const save = useMutation({
    mutationFn: (values: { slug: string; name: string; content: string }) =>
      skill
        ? updateSkill(skill.id, { name: values.name, content: values.content })
        : createSkill(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.list() });
      setOpen(false);
    },
    onError: () => toast.add({ title: m.skillSaveErrorToast(), type: "error" })
  });

  const onSubmit = handleSubmit((values) => save.mutate(values));

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
          isEdit ? (
            <Button variant="ghost" size="sm">
              {m.commonEdit()}
            </Button>
          ) : (
            <Button size="sm">
              <Plus /> {m.skillCreateButton()}
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? m.skillEditDialogTitle() : m.skillCreateDialogTitle()}
          </DialogTitle>
          <DialogDescription>{m.skillDialogDescription()}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skill-slug">{m.skillSlugLabel()}</Label>
              <Input
                id="skill-slug"
                disabled={isEdit}
                className="w-full"
                {...register("slug")}
              />
              {errors.slug && (
                <p className="text-xs text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skill-name">{m.skillNameLabel()}</Label>
              <Input id="skill-name" className="w-full" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skill-content">{m.skillContentLabel()}</Label>
              <Textarea
                id="skill-content"
                className="min-h-80 w-full font-mono text-xs"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-xs text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{m.skillPreviewLabel()}</Label>
              <div className="h-80 overflow-y-auto rounded-lg border border-input p-3">
                <MessageResponse>{content || ""}</MessageResponse>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  {m.commonCancel()}
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting || save.isPending}>
              {isSubmitting || save.isPending
                ? m.commonLoading()
                : m.commonSave()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
