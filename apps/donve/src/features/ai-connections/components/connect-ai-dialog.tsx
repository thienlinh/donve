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

function providerDescriptions(): Record<ByokProvider, string> {
  return {
    openrouter: m.aiProviderDescriptionOpenrouter(),
    anthropic: m.aiProviderDescriptionAnthropic(),
    openai: m.aiProviderDescriptionOpenai(),
    groq: m.aiProviderDescriptionGroq(),
    nvidia: m.aiProviderDescriptionNvidia()
  };
}

/**
 * Step-by-step "where do I get this key" guide per provider (byok.md §1.5), mirroring the
 * GuideCard shown on the payment-connections page. Payments serves this from the backend
 * driver (`payments.getConnectionGuide()`) because it has one provider; here the content is
 * static prose across five providers with nothing org-specific, so it's kept as plain data in
 * the dialog instead of round-tripping five near-identical guide endpoints.
 * ponytail: hardcoded, not routed through paraglide (same as payments' guide steps) — only the
 * card title above is localized. Add per-provider i18n if this ever needs non-Vietnamese steps.
 */
const providerGuideSteps: Record<
  ByokProvider,
  { title: string; body: string }[]
> = {
  openrouter: [
    {
      title: "Vào openrouter.ai",
      body: "Truy cập openrouter.ai và đăng ký tài khoản (có thể đăng nhập bằng Google/GitHub)."
    },
    {
      title: "Tạo mã truy cập API",
      body: "Vào mục Keys trong tài khoản, nhấn Create Key, đặt tên và tạo mã mới."
    },
    {
      title: "Dán mã vào đây",
      body: "Sao chép mã vừa tạo và dán vào ô mã truy cập API bên dưới — mô hình miễn phí có sẵn để thử ngay."
    }
  ],
  anthropic: [
    {
      title: "Vào console.anthropic.com",
      body: "Đăng ký hoặc đăng nhập tài khoản Anthropic Console."
    },
    {
      title: "Tạo mã truy cập API",
      body: "Vào mục API Keys, nhấn Create Key và đặt tên cho mã."
    },
    {
      title: "Nạp tiền (nếu cần)",
      body: "Vào Billing để nạp một khoản nhỏ trước khi mã có thể gọi được mô hình."
    },
    {
      title: "Dán mã vào đây",
      body: "Sao chép mã vừa tạo và dán vào ô mã truy cập API bên dưới."
    }
  ],
  openai: [
    {
      title: "Vào platform.openai.com",
      body: "Đăng ký hoặc đăng nhập tài khoản OpenAI Platform."
    },
    {
      title: "Tạo mã truy cập API",
      body: "Vào mục API Keys, nhấn Create new secret key."
    },
    {
      title: "Nạp tiền (nếu cần)",
      body: "Vào Billing để nạp một khoản nhỏ trước khi mã có thể gọi được mô hình."
    },
    {
      title: "Dán mã vào đây",
      body: "Sao chép mã vừa tạo và dán vào ô mã truy cập API bên dưới."
    }
  ],
  groq: [
    {
      title: "Vào console.groq.com",
      body: "Đăng ký hoặc đăng nhập tài khoản GroqCloud."
    },
    {
      title: "Tạo mã truy cập API",
      body: "Vào mục API Keys, tạo mã mới."
    },
    {
      title: "Dán mã vào đây",
      body: "Sao chép mã vừa tạo và dán vào ô mã truy cập API bên dưới — gói miễn phí đủ dùng cho tác vụ nhỏ."
    }
  ],
  nvidia: [
    {
      title: "Vào build.nvidia.com",
      body: "Đăng ký hoặc đăng nhập tài khoản NVIDIA."
    },
    {
      title: "Lấy mã truy cập API",
      body: "Chọn một mô hình bất kỳ, nhấn Get API Key."
    },
    {
      title: "Dán mã vào đây",
      body: "Sao chép mã vừa tạo và dán vào ô mã truy cập API bên dưới — mô hình miễn phí có sẵn để thử ngay."
    }
  ]
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
            <p className="text-xs text-muted-foreground">
              {providerDescriptions()[provider]}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-md border p-3">
            <p className="text-sm font-medium">{m.aiConnectGuideTitle()}</p>
            <ol className="flex flex-col gap-2">
              {providerGuideSteps[provider].map((step, index) => (
                <li key={step.title} className="flex gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{step.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {step.body}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
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
