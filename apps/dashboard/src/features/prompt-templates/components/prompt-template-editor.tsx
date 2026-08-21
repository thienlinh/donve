import {
  updatePromptTemplateSchema,
  type PromptTemplate,
  type UpdatePromptTemplateInput
} from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Checkbox } from "@dv/ui/components/shadcn/checkbox";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import { toast } from "@dv/ui/components/shadcn/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import * as m from "@/paraglide/messages.js";

import { updatePromptTemplate } from "../api";
import { promptTemplateKeys } from "../query-keys";

/**
 * Sections/variables editor (FR-F-02/03) — a tenant-owned template's `sections` (the actual
 * prompt text, one editable block per `key`) and `variables` (the `{{key}}` placeholders those
 * sections reference). Platform templates never reach this — read-only view instead
 * (prompt-template-detail-page.tsx only renders this for `template.orgId !== null`).
 */
export function PromptTemplateEditor({
  template
}: {
  template: PromptTemplate;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty }
  } = useForm({
    resolver: zodResolver(updatePromptTemplateSchema),
    defaultValues: {
      sections: template.sections,
      variables: template.variables
    }
  });
  const sections = useFieldArray({ control, name: "sections" });
  const variables = useFieldArray({ control, name: "variables" });

  const save = useMutation({
    mutationFn: (values: UpdatePromptTemplateInput) =>
      updatePromptTemplate(template.id, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: promptTemplateKeys.list() }),
    onError: () =>
      toast.add({ title: m.promptTemplateSaveErrorToast(), type: "error" })
  });

  const onSubmit = handleSubmit((values) => save.mutate(values));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {m.promptTemplateSectionsLabel()}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => sections.append({ key: "", content: "" })}
          >
            <Plus /> {m.promptTemplateAddSection()}
          </Button>
        </div>
        {sections.fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-lg border border-input p-3"
          >
            <div className="flex items-center gap-2">
              <Input
                placeholder={m.promptTemplateSectionKeyPlaceholder()}
                className="w-48 font-mono text-xs"
                {...register(`sections.${index}.key`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={m.promptTemplateRemoveSection()}
                onClick={() => sections.remove(index)}
              >
                <Trash2 className="text-destructive" />
              </Button>
            </div>
            <Textarea
              className="min-h-24 w-full font-mono text-xs"
              {...register(`sections.${index}.content`)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {m.promptTemplateVariablesLabel()}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => variables.append({ key: "", required: false })}
          >
            <Plus /> {m.promptTemplateAddVariable()}
          </Button>
        </div>
        {variables.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder={m.promptTemplateVariableKeyPlaceholder()}
              className="w-40 font-mono text-xs"
              {...register(`variables.${index}.key`)}
            />
            <Input
              placeholder={m.promptTemplateVariableLabelPlaceholder()}
              className="w-48"
              {...register(`variables.${index}.label`)}
            />
            <Label className="flex items-center gap-1.5 text-xs whitespace-nowrap">
              <Controller
                control={control}
                name={`variables.${index}.required`}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              {m.promptTemplateVariableRequired()}
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={m.promptTemplateRemoveVariable()}
              onClick={() => variables.remove(index)}
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="self-start"
        disabled={!isDirty || isSubmitting || save.isPending}
      >
        {isSubmitting || save.isPending ? m.commonLoading() : m.commonSave()}
      </Button>
    </form>
  );
}
