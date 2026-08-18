import { byokProviderValues, connectAiConnectionSchema } from "@dv/contracts";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as m from "@/paraglide/messages.js";

import { connectAiConnection } from "../api";
import { aiConnectionKeys } from "../query-keys";

const providerLabels: Record<(typeof byokProviderValues)[number], string> = {
  openrouter: "OpenRouter",
  anthropic: "Anthropic",
  openai: "OpenAI"
};

/** OpenRouter first/default (ai-integration-byok.md §1.3) — one key, a free model to test with. */
export function ConnectAiDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(connectAiConnectionSchema),
    defaultValues: {
      provider: "openrouter" as const,
      apiKey: "",
      defaultModel: "deepseek/deepseek-chat-v3:free"
    }
  });

  const connect = useMutation({
    mutationFn: connectAiConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiConnectionKeys.list() });
      reset();
      setOpen(false);
    },
    onError: () => setServerError(m.aiInvalidApiKeyError())
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    connect.mutate(values);
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
            <KeyRound /> {m.aiConnectButton()}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.aiConnectDialogTitle()}</DialogTitle>
          <DialogDescription>
            {m.aiConnectDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ai-provider">{m.aiProviderLabel()}</Label>
            <NativeSelect id="ai-provider" {...register("provider")}>
              {byokProviderValues.map((provider) => (
                <NativeSelectOption key={provider} value={provider}>
                  {providerLabels[provider]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ai-api-key">{m.aiApiKeyLabel()}</Label>
            <Input
              id="ai-api-key"
              type="password"
              autoComplete="off"
              {...register("apiKey")}
            />
            {errors.apiKey && (
              <p className="text-xs text-destructive">
                {errors.apiKey.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ai-default-model">{m.aiDefaultModelLabel()}</Label>
            <Input id="ai-default-model" {...register("defaultModel")} />
            {errors.defaultModel && (
              <p className="text-xs text-destructive">
                {errors.defaultModel.message}
              </p>
            )}
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
            <Button type="submit" disabled={isSubmitting || connect.isPending}>
              {isSubmitting || connect.isPending
                ? m.commonLoading()
                : m.aiConnectSubmit()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
