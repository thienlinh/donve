import {
  byokProviderValues,
  connectAiConnectionSchema,
  type AiModelOption,
  type ByokProvider
} from "@dv/contracts";
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
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import * as m from "@/paraglide/messages.js";

import { connectAiConnection, listAiModels } from "../api";
import { aiConnectionKeys } from "../query-keys";

const providerLabels: Record<ByokProvider, string> = {
  openrouter: "OpenRouter",
  anthropic: "Anthropic",
  openai: "OpenAI",
  groq: "Groq",
  nvidia: "NVIDIA NIM"
};

/**
 * OpenRouter's and NVIDIA NIM's `/models` endpoints are genuinely public catalogs (verified:
 * both return 200 with no Authorization header) — their model list can load the moment the
 * provider is picked. Anthropic/OpenAI/Groq all 401 without a real key, so those can only be
 * probed once the user has typed one in.
 */
const PUBLIC_MODEL_PROVIDERS = new Set<ByokProvider>(["openrouter", "nvidia"]);

const MODEL_FETCH_DEBOUNCE_MS = 500;

/** OpenRouter first/default (ai-integration-byok.md §1.3) — one key, a free model to test with. */
export function ConnectAiDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [models, setModels] = useState<AiModelOption[] | null>(null);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(connectAiConnectionSchema),
    defaultValues: {
      provider: "openrouter" as ByokProvider,
      apiKey: "",
      defaultModel: ""
    }
  });
  const provider = watch("provider");
  const apiKey = watch("apiKey");
  const isPublicProvider = PUBLIC_MODEL_PROVIDERS.has(provider);

  // The key's own /models endpoint is the only source of truth for what it can actually run —
  // a wrong hand-typed model id here silently breaks every future generate call on this
  // connection instead of failing at connect time.
  // oxlint-disable-next-line react-doctor/query-mutation-missing-invalidation -- read-only probe (lists models), no server state changes, nothing to invalidate
  const fetchModels = useMutation({
    mutationFn: listAiModels,
    onSuccess: (result) => {
      const [firstModel] = result;
      if (!firstModel) {
        setModels(null);
        setModelsError(m.aiFetchModelsEmpty());
        return;
      }
      setModels(result);
      setModelsError(null);
      setValue("defaultModel", firstModel.id);
    },
    onError: () => {
      setModels(null);
      setModelsError(m.aiFetchModelsError());
    }
  });

  // The default provider (OpenRouter) is public — kick off its fetch the moment the dialog
  // opens. Switching provider afterward is handled by handleProviderChange below (a real user
  // event, not state derived reactively from other state), not a second effect.
  useEffect(() => {
    if (!open || !PUBLIC_MODEL_PROVIDERS.has(provider)) return;
    // oxlint-disable-next-line react-doctor/no-chain-state-updates -- one-shot data fetch on mount (React docs' own documented Effect use case), not state derived from other state
    fetchModels.mutate({ provider });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fires once when the dialog opens, at whatever the (always-public) default provider is
  }, [open]);

  // Key-gated providers (Anthropic/OpenAI/Groq) only resolve once a key is typed — debounced
  // so it doesn't fire a real request on every keystroke.
  useEffect(() => {
    if (!open || isPublicProvider) return;
    if (!apiKey) return;
    const timeout = setTimeout(() => {
      fetchModels.mutate({ provider, apiKey });
    }, MODEL_FETCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounced probe, not tied to mutation identity
  }, [open, provider, apiKey, isPublicProvider]);

  function handleProviderChange(nextProvider: ByokProvider) {
    setModels(null);
    setModelsError(null);
    setValue("defaultModel", "");
    if (PUBLIC_MODEL_PROVIDERS.has(nextProvider)) {
      fetchModels.mutate({ provider: nextProvider });
    }
  }

  const connect = useMutation({
    mutationFn: connectAiConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiConnectionKeys.list() });
      reset();
      setModels(null);
      setModelsError(null);
      setOpen(false);
    },
    onError: () => setServerError(m.aiInvalidApiKeyError())
  });

  const onSubmit = handleSubmit((values) => {
    setServerError(null);
    connect.mutate(values);
  });

  const modelsLoading = fetchModels.isPending;
  const modelsReady = models !== null && models.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setServerError(null);
          setModels(null);
          setModelsError(null);
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
            <NativeSelect
              id="ai-provider"
              className="w-full"
              {...register("provider", {
                onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                  handleProviderChange(e.target.value as ByokProvider)
              })}
            >
              {byokProviderValues.map((providerId) => (
                <NativeSelectOption key={providerId} value={providerId}>
                  {providerLabels[providerId]}
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
              className="w-full"
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
            <NativeSelect
              id="ai-default-model"
              className="w-full"
              aria-invalid={Boolean(modelsError)}
              disabled={!modelsReady || modelsLoading}
              {...register("defaultModel")}
            >
              {modelsLoading && (
                <NativeSelectOption value="">
                  {m.commonLoading()}
                </NativeSelectOption>
              )}
              {!modelsLoading && !modelsReady && (
                <NativeSelectOption value="">
                  {isPublicProvider
                    ? m.commonLoading()
                    : m.aiFetchModelsWaitingForKey()}
                </NativeSelectOption>
              )}
              {modelsReady &&
                models.map((model) => (
                  <NativeSelectOption key={model.id} value={model.id}>
                    {model.description
                      ? `${model.id} — ${model.description}`
                      : model.id}
                  </NativeSelectOption>
                ))}
            </NativeSelect>
            {modelsError && (
              <p className="text-xs text-destructive">{modelsError}</p>
            )}
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
