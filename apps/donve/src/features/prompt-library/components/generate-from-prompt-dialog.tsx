import type { PromptLibraryEntry } from "@dv/contracts";
import { Button } from "@dv/ui/components/shadcn/button";
import {
  Dialog,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import * as React from "react";

import { createLandingPage } from "@/features/studio/api";
import { landingKeys } from "@/features/studio/query-keys";
import * as m from "@/paraglide/messages.js";

/**
 * Seeds Donve's own AI generation (legacy single-shot `/generate` flow, `studio-page.tsx`'s
 * `prompt` search param) with a prompt-library entry's text. Does NOT fire generation on open —
 * the seeded `promptText` values contain literal `[placeholder]` spots meant for manual fill-in
 * before a prompt is actually sent (`packages/db/src/seed.ts`), so this dialog exists purely to
 * let the user edit that text before it becomes the AI's actual user turn.
 */
export function GenerateFromPromptDialog({
  entry
}: {
  entry: PromptLibraryEntry;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [promptText, setPromptText] = React.useState(entry.promptText);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => createLandingPage({ name: name.trim() || entry.title }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: landingKeys.list() });
      setOpen(false);
      navigate({
        to: "/landings/$id/studio",
        params: { id: created.id },
        search: { prompt: promptText }
      });
    },
    onError: () =>
      toast.add({ title: m.landingsCreateErrorToast(), type: "error" })
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setName("");
          setPromptText(entry.promptText);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button type="button">
            <Sparkles /> {m.promptLibraryGenerateCta()}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.promptLibraryGenerateDialogTitle()}</DialogTitle>
          <DialogDescription>
            {m.promptLibraryGenerateDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="generate-from-prompt-name">
              {m.promptLibraryGenerateNameLabel()}
            </Label>
            <Input
              id="generate-from-prompt-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={entry.title}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="generate-from-prompt-text">
              {m.promptLibraryGeneratePromptLabel()}
            </Label>
            <Textarea
              id="generate-from-prompt-text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="min-h-40 font-mono text-xs"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={!promptText.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending
              ? m.promptLibraryGenerateSubmitting()
              : m.promptLibraryGenerateSubmit()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
