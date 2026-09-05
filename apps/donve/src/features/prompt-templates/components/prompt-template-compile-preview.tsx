import type { PromptTemplate } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import { Input } from "@dv/ui/components/shadcn/input";
import { Label } from "@dv/ui/components/shadcn/label";
import { toast } from "@dv/ui/components/shadcn/toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import * as m from "@/paraglide/messages.js";

import { compilePromptTemplate } from "../api";

/** Read-only preview of the final compiled prompt (FR-F-03) — never persisted, unlike a test run. */
export function PromptTemplateCompilePreview({
  template
}: {
  template: PromptTemplate;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const compile = useMutation({
    mutationFn: () => compilePromptTemplate(template.id, { values }),
    onError: () =>
      toast.add({
        title: m.promptTemplateCompileErrorToast(),
        type: "error"
      })
  });

  return (
    <div className="flex flex-col gap-4">
      {template.variables.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {template.variables.map((variable) => (
            <div key={variable.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`compile-var-${variable.key}`}>
                {variable.label ?? variable.key}
              </Label>
              <Input
                id={`compile-var-${variable.key}`}
                value={values[variable.key] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [variable.key]: e.target.value
                  }))
                }
              />
            </div>
          ))}
        </div>
      )}
      <Button
        className="self-start"
        disabled={compile.isPending}
        onClick={() => compile.mutate()}
      >
        {compile.isPending
          ? m.commonLoading()
          : m.promptTemplateCompileButton()}
      </Button>
      {compile.data && (
        <pre className="max-h-96 overflow-auto rounded-lg border border-input bg-muted p-3 text-xs whitespace-pre-wrap">
          {compile.data.compiled}
        </pre>
      )}
    </div>
  );
}
