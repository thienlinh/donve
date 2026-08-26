import {
  nativePageDocumentSchema,
  strategyBriefSchema,
  type NativePageDocument
} from "@dv/contracts";
import {
  chatMessagesRepository,
  landingPagesRepository,
  pageVersionsRepository,
  skillsRepository,
  strategyBriefsRepository
} from "@dv/db";
import { compileSpecChatPrompt } from "@dv/studio-ai";
import {
  applySpecOps,
  architectCatalogSummary,
  catalogComponents,
  componentMetaById,
  exampleProps,
  specPatchOpSchema
} from "@dv/studio-catalog";
import type { Spec } from "@json-render/core";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage
} from "ai";
import { Hono, type Context } from "hono";
import { z } from "zod";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { syncEventDefinitions } from "@/lib/event-definitions.js";
import { restoreSensitiveProps } from "@/lib/sensitive-props.js";
import {
  requireChatSessionId,
  requireLandingPage,
  resolveChatModel,
  uiMessageToChatContent
} from "@/lib/studio-chat.js";
import type { AppEnv } from "@/types.js";

// Same budget as the legacy srcmap chat: the model gets a bounded number of in-turn retries
// against validation failures — there is no `apply_full_page` fallback for it to escape to.
const MAX_PATCH_ATTEMPTS = 2;
const MAX_TOOL_STEPS = 4;

/** Every component an agent may write, with the exact schema `apply_page_patch` validates
 * against — stable across requests, so it's built once (and sits in the prompt's cacheable
 * prefix). */
const propsJsonSchemaByComponent = Object.fromEntries(
  architectCatalogSummary.map((entry) => [
    entry.componentId,
    catalogComponents[entry.componentId]?.props.toJSONSchema()
  ])
);

export const studioNativeChatRoutes = new Hono<AppEnv>();

// Same pattern as the sibling route modules — every handler here runs behind
// requireOrgSession (app.ts), which guarantees `orgId` is set.
function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

const nativeChatStreamSchema = z.object({
  landingPageId: z.string(),
  messages: z.array(z.custom<UIMessage>()),
  /** The Puck state the user is looking at right now (`ai/agent-pipeline.md` §Quyết định đã
   * chốt #1). The native Studio saves manually, so basing a patch on the last *saved* version
   * would silently discard unsaved hand edits — the client sends its live document instead. */
  document: nativePageDocumentSchema.optional()
});

const applyPagePatchInputSchema = z.object({
  ops: z.array(specPatchOpSchema).min(1),
  summary: z.string().min(1)
});

/**
 * In-canvas AI chat for the native (Puck) Studio — the PageSpec counterpart of the legacy
 * srcmap chat in `./routes.ts` (`ai/agent-pipeline.md` §In-canvas chat). Same protocol shape
 * (one patch tool, in-turn validation retries, one `pageVersions` row per successful patch,
 * history via the shared `GET /api/studio/messages`), different patch vocabulary.
 */
studioNativeChatRoutes.post("/stream", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const { landingPageId, messages, document } = nativeChatStreamSchema.parse(
    await c.req.json()
  );

  const landingPage = await requireLandingPage(db, orgId, landingPageId);
  const sessionId = await requireChatSessionId(db, orgId, landingPage);
  const model = await resolveChatModel(db, c.env, orgId);

  let currentDoc =
    document ?? (await loadSavedDocument(db, orgId, landingPage));

  const lastMessage = messages.at(-1);
  if (lastMessage?.role === "user") {
    await chatMessagesRepository.insert(db, orgId, {
      sessionId,
      role: "user",
      content: uiMessageToChatContent(lastMessage),
      tokenUsage: null
    });
  }

  let lastAppliedVersionId: string | null = null;
  let patchAttempts = 0;

  const applyPagePatchTool = tool({
    description:
      "Apply one or more PageSpec patch ops (setProps/insertElement/removeElement/moveElement) to the page.",
    inputSchema: applyPagePatchInputSchema,
    execute: async ({ ops, summary }) => {
      const result = applySpecOps(currentDoc.pageSpec as unknown as Spec, ops);
      if (result.errors.length > 0) {
        patchAttempts += 1;
        return {
          success: false as const,
          error: "invalid_ops",
          issues: result.errors,
          attemptsRemaining: Math.max(0, MAX_PATCH_ATTEMPTS - patchAttempts)
        };
      }

      const pageSpec = restoreSensitiveElements(
        result.spec,
        currentDoc.pageSpec as unknown as Spec
      ) as unknown as NativePageDocument["pageSpec"];
      const nextDoc: NativePageDocument = { ...currentDoc, pageSpec };
      const version = await persistVersion(nextDoc, ops);
      currentDoc = nextDoc;
      lastAppliedVersionId = version.id;

      return {
        success: true as const,
        pageVersionId: version.id,
        summary,
        // The client re-renders Puck from this (via `pageSpecToPuckData`) rather than replaying
        // `ops` itself — only the server's copy has the sensitive-prop guardrail applied.
        pageSpec
      };
    }
  });

  async function persistVersion(doc: NativePageDocument, ops: unknown) {
    const versions = await pageVersionsRepository.listByLandingPage(
      db,
      orgId,
      landingPage.id
    );
    const seq = (versions[0]?.seq ?? 0) + 1;
    const version = await pageVersionsRepository.insert(db, orgId, {
      landingPageId: landingPage.id,
      seq,
      htmlKey: null,
      srcmapKey: null,
      origin: "ai_patch",
      patch: ops,
      chatMessageId: null,
      label: null,
      createdBy: c.get("userId") ?? null,
      spec: doc
    });
    if (!version) throw new ApiError(500, "page_version_create_failed");
    await landingPagesRepository.update(db, orgId, landingPage.id, {
      currentVersionId: version.id
    });
    // Unconditional rather than only on structural ops: `replaceForLandingPage` rewrites the
    // same rows either way, so checking first would only save a write, not a bug.
    await syncEventDefinitions(
      db,
      orgId,
      landingPage.id,
      version.id,
      doc.pageSpec.elements,
      doc.pageSpec.elements[doc.pageSpec.root]?.children ?? []
    );
    return version;
  }

  const [skills, strategyBriefRow] = await Promise.all([
    skillsRepository.listEnabledForLandingPage(db, orgId, landingPageId),
    strategyBriefsRepository.findByLandingPage(db, orgId, landingPageId)
  ]);

  const result = streamText({
    model,
    system: compileSpecChatPrompt({
      pageSpec: currentDoc.pageSpec,
      tokens: currentDoc.tokens,
      catalog: architectCatalogSummary,
      propsJsonSchemaByComponent,
      skills: skills.map((s) => ({ name: s.name, content: s.content })),
      strategyBrief: strategyBriefRow
        ? strategyBriefSchema.parse(strategyBriefRow)
        : undefined
    }),
    messages: await convertToModelMessages(messages),
    tools: { apply_page_patch: applyPagePatchTool },
    stopWhen: stepCountIs(MAX_TOOL_STEPS)
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ responseMessage }) => {
      const usage = await result.usage;
      const message = await chatMessagesRepository.insert(db, orgId, {
        sessionId,
        role: "assistant",
        content: uiMessageToChatContent(responseMessage),
        tokenUsage: {
          inputTokens: usage.inputTokens ?? 0,
          outputTokens: usage.outputTokens ?? 0
        }
      });
      if (lastAppliedVersionId && message) {
        await pageVersionsRepository.update(db, orgId, lastAppliedVersionId, {
          chatMessageId: message.id
        });
      }
    }
  });
});

/** Only reached when the client didn't send its live document (it always should) — e.g. a
 * retry issued before Puck finished mounting. */
async function loadSavedDocument(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPage: { currentVersionId: string | null }
): Promise<NativePageDocument> {
  if (!landingPage.currentVersionId) {
    throw new ApiError(400, "landing_page_no_version");
  }
  const version = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!version?.spec) throw new ApiError(404, "page_version_not_found");
  return nativePageDocumentSchema.parse(version.spec);
}

/**
 * `ai/agent-pipeline.md` §Guardrails — a model can never write a `sensitive` prop (price,
 * guarantee, legal claim) because no `humanApproved` flow exists yet, so every such path is
 * restored after the patch, exactly like the Auto Fixer's content branch does. For an element
 * the patch just inserted there is no previous value to restore, so it falls back to the
 * catalog's own example props — the same placeholder a user gets when inserting that section
 * by hand in Puck, which they then have to edit deliberately.
 */
function restoreSensitiveElements(next: Spec, previous: Spec): Spec {
  for (const [elementId, element] of Object.entries(next.elements)) {
    const meta = componentMetaById.get(element.type);
    if (!meta || meta.sensitiveProps.length === 0) continue;
    const previousProps =
      previous.elements[elementId]?.props ?? exampleProps[element.type] ?? {};
    element.props = restoreSensitiveProps(
      element.props,
      previousProps,
      meta.sensitiveProps
    );
  }
  return next;
}
