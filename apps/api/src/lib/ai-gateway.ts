import {
  AiStreamError,
  collectStream,
  createWorkersAiProvider,
  decryptApiKey,
  getProvider,
  importMasterKey,
  pickMaxOutputTokens,
  pickModel,
  WORKERS_AI_TRIAL_MODEL,
  type AiErrorCode,
  type AiUseCase,
  type ByokProviderId,
  type ChatMessage
} from "@dv/ai-gateway";
import {
  aiConnectionsRepository,
  aiUsageRepository,
  debitAiCreditsAndRecordUsage,
  debitTrialUseAndRecordUsage,
  organizationsRepository,
  type Db
} from "@dv/db";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { Bindings } from "../types.js";
import { ApiError } from "./errors.js";

const AI_ERROR_STATUS: Record<AiErrorCode, ContentfulStatusCode> = {
  rate_limited: 429,
  overloaded: 503,
  model_unavailable: 422,
  no_output: 422
};

/** Converts a classified `AiStreamError` into a real `ApiError` (specific status + `ai_<code>`,
 * e.g. `ai_rate_limited`) so the client gets an actionable code/message instead of the generic
 * masked 500 every other uncaught `Error` collapses into (`error-handler.ts`). An unclassified
 * `AiStreamError` (or any other error) is rethrown as-is and falls through to that same generic
 * masking — deliberately: we only special-case failures we can say something specific about. */
function rethrowClassifiedAiError(err: unknown): never {
  if (err instanceof AiStreamError && err.code) {
    throw new ApiError(AI_ERROR_STATUS[err.code], `ai_${err.code}`);
  }
  throw err;
}

/** `importMasterKey` is cheap (one `crypto.subtle.importKey` call) — no need to cache across requests. */
export function importAiMasterKeyFromEnv(env: Bindings): Promise<CryptoKey> {
  return importMasterKey(env.AI_KEY_MASTER_SECRET);
}

/** The model routed against the platform's own OpenRouter key for `connectionId=platform` (FR-H-02). */
const PLATFORM_MODEL = "anthropic/claude-sonnet-4.5";

/**
 * Picks which `connectionId` a landing page's generate call should use: the org's default
 * connection if it has one, otherwise the free Workers AI trial (FR-H-05) — a brand-new org
 * has no `aiConnections` row at all, so it must fall through to trial rather than hard-requiring
 * BYOK. Shared by the non-streaming and streaming `/generate` handlers so they can't drift.
 */
export async function resolveGenerateConnectionId(
  db: Db,
  orgId: string
): Promise<string> {
  const connections = await aiConnectionsRepository.list(db, orgId);
  const defaultConnection = connections.find((row) => row.isDefault);
  if (defaultConnection?.provider === "platform") return "platform";
  if (defaultConnection?.encryptedKey) return defaultConnection.id;

  const org = await organizationsRepository.findById(db, orgId);
  if (!org || org.trialUsesRemaining <= 0) {
    throw new ApiError(400, "no_ai_connection");
  }
  return "trial";
}

export interface ModelCompletionResult {
  text: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number; creditCost: number };
  remaining?: number;
}

/**
 * The same `connectionId` routing (trial / platform / BYOK) used by `POST /api/ai/generate` —
 * extracted so `POST /api/ai/prompt-templates/:id/test-run` (FR-F-04) can call a model without
 * duplicating the billing/usage branches.
 */
export async function runModelCompletion(
  db: Db,
  env: Bindings,
  orgId: string,
  connectionId: string,
  useCase: AiUseCase,
  messages: ChatMessage[],
  onTextDelta?: (text: string) => void | Promise<void>
): Promise<ModelCompletionResult> {
  if (connectionId === "trial") {
    if (!env.AI) throw new ApiError(503, "trial_unavailable_on_this_runtime");
    const provider = createWorkersAiProvider(env.AI);
    const { text, usage } = await collectStream(
      provider.stream(
        {
          model: WORKERS_AI_TRIAL_MODEL,
          messages,
          maxOutputTokens: pickMaxOutputTokens(useCase)
        },
        { apiKey: "" }
      ),
      onTextDelta
    ).catch(rethrowClassifiedAiError);
    const debit = await debitTrialUseAndRecordUsage(db, {
      orgId,
      connectionId: "trial",
      model: WORKERS_AI_TRIAL_MODEL,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens
    });
    if (!debit.ok) throw new ApiError(402, "trial_exhausted");
    return {
      text,
      model: WORKERS_AI_TRIAL_MODEL,
      usage: { ...usage, creditCost: 0 },
      remaining: debit.remaining
    };
  }

  if (connectionId === "platform") {
    const providerId: ByokProviderId = "openrouter";
    const provider = getProvider(providerId);
    const model = pickModel(providerId, useCase, PLATFORM_MODEL);
    const { text, usage } = await collectStream(
      provider.stream(
        { model, messages, maxOutputTokens: pickMaxOutputTokens(useCase) },
        { apiKey: env.PLATFORM_OPENROUTER_API_KEY }
      ),
      onTextDelta
    ).catch(rethrowClassifiedAiError);
    const creditCost = provider.countCost(usage, model);
    const debit = await debitAiCreditsAndRecordUsage(db, {
      orgId,
      connectionId: "platform",
      model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      creditCost
    });
    if (!debit.ok) throw new ApiError(402, "insufficient_credits");
    return {
      text,
      model,
      usage: { ...usage, creditCost },
      remaining: debit.remaining
    };
  }

  // BYOK: a real `aiConnections` row the org owns.
  const connection = await aiConnectionsRepository.findById(
    db,
    orgId,
    connectionId
  );
  if (!connection) throw new ApiError(404, "ai_connection_not_found");
  if (connection.provider === "platform" || !connection.encryptedKey) {
    throw new ApiError(400, "invalid_connection");
  }

  const provider = getProvider(connection.provider);
  const model = pickModel(
    connection.provider,
    useCase,
    connection.defaultModel
  );
  const masterKey = await importAiMasterKeyFromEnv(env);
  const apiKey = await decryptApiKey(connection.encryptedKey, masterKey);

  const { text, usage } = await collectStream(
    provider.stream(
      { model, messages, maxOutputTokens: pickMaxOutputTokens(useCase) },
      { apiKey }
    ),
    onTextDelta
  ).catch(rethrowClassifiedAiError);
  const creditCost = provider.countCost(usage, model);
  // BYOK usage is billed on the tenant's own provider account, not `aiCreditBalance` — record only, no debit.
  await aiUsageRepository.insert(db, orgId, {
    connectionId: connection.id,
    model,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    creditCost,
    context: {}
  });

  return { text, model, usage: { ...usage, creditCost } };
}
