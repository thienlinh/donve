import {
  chatMessageSchema,
  orgSettingsSchema,
  pageAssetSchema,
  stockImageCandidateSchema,
  studioCommentSchema
} from "@dv/contracts";
import {
  chatMessagesRepository,
  landingPagesRepository,
  organizationsRepository,
  pageAssetsRepository,
  pageVersionsRepository,
  skillsRepository,
  studioCommentsRepository
} from "@dv/db";
import {
  applyFullHtmlInputSchema,
  applyPatchInputSchema,
  compilePrompt,
  validatePatchOps
} from "@dv/studio-ai";
import { applyOpsToHtml, type PatchOp } from "@dv/studio-core";
import { sanitizeLandingHtml } from "@dv/studio-core/sanitize";
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
import { requireSrcmapVersion } from "@/lib/page-version-guards.js";
import {
  isAllowedStockImageUrl,
  searchStockImages
} from "@/lib/stock-images.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import {
  requireChatSessionId,
  requireLandingPage,
  resolveChatModel,
  uiMessageToChatContent
} from "@/lib/studio-chat.js";
import type { AppEnv } from "@/types.js";

// ai-integration-byok.md §6: apply_patch gets at most 2 validation retries in the same
// turn before the model is told to fall back to apply_full_html.
const MAX_PATCH_ATTEMPTS = 2;
const MAX_TOOL_STEPS = 4;

export const studioRoutes = new Hono<AppEnv>();

// Same pattern as modules/landings/routes.ts — every handler here runs behind
// requireOrgSession (app.ts), which guarantees `orgId` is set.
function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

studioRoutes.get("/comments", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const landingPageId = c.req.query("landingPageId");
  if (!landingPageId) throw new ApiError(400, "landing_page_id_required");

  const rows = await studioCommentsRepository.list(db, orgId);
  const comments = rows.filter((row) => row.landingPageId === landingPageId);

  return c.json({ comments: z.array(studioCommentSchema).parse(comments) });
});

const createCommentSchema = z.object({
  landingPageId: z.string(),
  srcmapId: z.string().min(1),
  body: z.string().trim().min(1),
  // Cropped-to-element screenshot (FR-B-12) — client uploads it via the existing
  // `/landings/:id/assets` pipeline first and passes back that asset's `r2Key`.
  screenshotKey: z.string().nullable().optional()
});

// FR-B-12/13: Queue button — stores the comment as `queued`.
studioRoutes.post("/comments", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = createCommentSchema.parse(await c.req.json());
  await requireLandingPage(db, orgId, body.landingPageId);

  const comment = await studioCommentsRepository.insert(db, orgId, {
    landingPageId: body.landingPageId,
    srcmapId: body.srcmapId,
    body: body.body,
    screenshotKey: body.screenshotKey ?? null,
    status: "queued",
    createdBy: null
  });

  return c.json(studioCommentSchema.parse(comment), 201);
});

// FR-B-13: "Send to Chat" — posts a single comment straight into the chat as a
// `chatMessages` row with a `comment-context` part (ChatPanel renders it as a chip).
// Real AI reply wiring is Phase 2 — this only creates the message.
studioRoutes.post("/comments/:id/send", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");

  const comment = await studioCommentsRepository.findById(db, orgId, id);
  if (!comment) throw new ApiError(404, "studio_comment_not_found");

  const landingPage = await requireLandingPage(
    db,
    orgId,
    comment.landingPageId
  );
  const sessionId = await requireChatSessionId(db, orgId, landingPage);

  const message = await chatMessagesRepository.insert(db, orgId, {
    sessionId,
    role: "user",
    content: [
      { type: "text", text: comment.body },
      {
        type: "comment-context",
        commentId: comment.id,
        srcmapId: comment.srcmapId
      }
    ],
    tokenUsage: null
  });
  await studioCommentsRepository.update(db, orgId, id, { status: "sent" });

  return c.json(chatMessageSchema.parse(message), 201);
});

const sendAllSchema = z.object({ landingPageId: z.string() });

// "Send all" — collapses every `queued` comment for this page into one chat message
// listing `#1 [srcmapId]: body`, `#2 ...`, then marks them all `sent`.
studioRoutes.post("/comments/send-all", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const { landingPageId } = sendAllSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, landingPageId);
  const rows = await studioCommentsRepository.list(db, orgId);
  const queued = rows.filter(
    (row) => row.landingPageId === landingPageId && row.status === "queued"
  );
  if (queued.length === 0) throw new ApiError(400, "no_queued_comments");

  const sessionId = await requireChatSessionId(db, orgId, landingPage);
  const listing = queued
    .map((comment, i) => `#${i + 1} [${comment.srcmapId}]: ${comment.body}`)
    .join("\n");

  const message = await chatMessagesRepository.insert(db, orgId, {
    sessionId,
    role: "user",
    content: [
      { type: "text", text: listing },
      ...queued.map((comment) => ({
        type: "comment-context" as const,
        commentId: comment.id,
        srcmapId: comment.srcmapId
      }))
    ],
    tokenUsage: null
  });

  await Promise.all(
    queued.map((comment) =>
      studioCommentsRepository.update(db, orgId, comment.id, {
        status: "sent"
      })
    )
  );

  return c.json(chatMessageSchema.parse(message), 201);
});

const sendDrawMessageSchema = z.object({
  landingPageId: z.string(),
  text: z.string().trim(),
  imageDataUrl: z.string().startsWith("data:image/")
});

// FR-B-14 — Draw mode's "Send": composites the annotated preview client-side and posts it
// straight into chat as an image part (+ text, defaulted client-side when left empty).
// No upload pipeline exists yet (same gap noted for comments' `screenshotKey`), so the PNG
// goes in as a data URL rather than an R2-backed key.
studioRoutes.post("/messages", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = sendDrawMessageSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, body.landingPageId);
  const sessionId = await requireChatSessionId(db, orgId, landingPage);

  const message = await chatMessagesRepository.insert(db, orgId, {
    sessionId,
    role: "user",
    content: [
      { type: "text", text: body.text },
      { type: "image", url: body.imageDataUrl }
    ],
    tokenUsage: null
  });

  return c.json(chatMessageSchema.parse(message), 201);
});

studioRoutes.get("/messages", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const landingPageId = c.req.query("landingPageId");
  if (!landingPageId) throw new ApiError(400, "landing_page_id_required");

  const landingPage = await requireLandingPage(db, orgId, landingPageId);
  if (!landingPage.chatSessionId) return c.json({ messages: [] });

  const rows = await chatMessagesRepository.list(db, orgId);
  const messages = rows
    .filter((row) => row.sessionId === landingPage.chatSessionId)
    .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return c.json({ messages: z.array(chatMessageSchema).parse(messages) });
});

/** `data-comment-context` parts don't reach the model — `convertToModelMessages` drops
 * data-* parts, so the srcmapId (unlike the comment body, which is a sibling text part)
 * would otherwise never tell the model which element a comment targets. */
function expandCommentContextForModel(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => {
    const srcmapIds: string[] = [];
    for (const part of message.parts) {
      if (part.type === "data-comment-context") {
        srcmapIds.push((part.data as { srcmapId: string }).srcmapId);
      }
    }
    if (srcmapIds.length === 0) return message;
    return {
      ...message,
      parts: [
        ...message.parts,
        {
          type: "text",
          text: `(Referring to element${srcmapIds.length > 1 ? "s" : ""}: ${srcmapIds.join(", ")})`
        }
      ]
    };
  });
}

const chatStreamSchema = z.object({
  landingPageId: z.string(),
  messages: z.array(z.custom<UIMessage>())
});

// FR-B-20: `useChat`'s send path. Streams the org's default BYOK connection's model
// back as an AI SDK UI message stream and persists both sides to `chatMessages`.
// ponytail: BYOK-only for now (no trial/platform routing here like /api/ai/generate) —
// the chat panel has no connection picker yet, so this just requires one to be connected.
studioRoutes.post("/chat/stream", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const { landingPageId, messages } = chatStreamSchema.parse(
    await c.req.json()
  );

  const landingPage = await requireLandingPage(db, orgId, landingPageId);
  if (!landingPage.currentVersionId) {
    throw new ApiError(400, "landing_page_no_version");
  }
  const sessionId = await requireChatSessionId(db, orgId, landingPage);

  const model = await resolveChatModel(db, c.env, orgId);

  const lastMessage = messages.at(-1);
  if (lastMessage?.role === "user") {
    await chatMessagesRepository.insert(db, orgId, {
      sessionId,
      role: "user",
      content: uiMessageToChatContent(lastMessage),
      tokenUsage: null
    });
  }

  const storage = createStorageFromEnv(c.env);
  let currentVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!currentVersion) throw new ApiError(404, "page_version_not_found");
  const htmlObject = await storage.get(
    requireSrcmapVersion(currentVersion).htmlKey
  );
  if (!htmlObject) throw new ApiError(404, "html_not_found");
  let currentHtml = await new Response(htmlObject.body).text();
  let lastAppliedVersionId: string | null = null;
  let patchAttempts = 0;

  // Lands a new immutable pageVersion on top of `currentVersion`/`currentHtml` and advances
  // both, same shape as landings/routes.ts's `POST /:id/versions` (manual-save path) but
  // triggered from a tool call instead of Canvas's debounce.
  async function persistVersion(input: {
    html: string;
    origin: "ai_patch" | "ai_full";
    patch: unknown;
  }) {
    const seq = currentVersion!.seq + 1;
    const htmlKey = `landing-pages/${landingPage.id}/v${seq}/index.html`;
    // architecture.md §7 — AI output (patch or full-document) is untrusted the same way
    // /generate's is; strip <script>/event handlers/javascript: URLs before it's ever
    // persisted as a pageVersion, not just at render time.
    const html = sanitizeLandingHtml(input.html);
    await storage.put({
      key: htmlKey,
      body: html,
      contentType: "text/html"
    });
    const version = await pageVersionsRepository.insert(db, orgId, {
      landingPageId: landingPage.id,
      seq,
      htmlKey,
      srcmapKey: currentVersion!.srcmapKey,
      origin: input.origin,
      patch: input.patch,
      chatMessageId: null,
      label: null,
      createdBy: null
    });
    if (!version) throw new ApiError(500, "page_version_create_failed");
    await landingPagesRepository.update(db, orgId, landingPage.id, {
      currentVersionId: version.id
    });
    currentVersion = version;
    currentHtml = html;
    lastAppliedVersionId = version.id;
    return version;
  }

  const applyPatchTool = tool({
    description:
      "Apply one or more patch ops (targeting srcmap ids from the current page state) to the page.",
    inputSchema: applyPatchInputSchema,
    execute: async ({ ops, summary }) => {
      const validation = validatePatchOps(currentHtml, ops);
      if (!validation.valid) {
        patchAttempts += 1;
        return {
          success: false as const,
          error: "invalid_srcmap_ids",
          invalidIds: validation.invalidIds,
          attemptsRemaining: Math.max(0, MAX_PATCH_ATTEMPTS - patchAttempts)
        };
      }
      const html = applyOpsToHtml(currentHtml, ops);
      const version = await persistVersion({
        html,
        origin: "ai_patch",
        patch: ops
      });
      return { success: true as const, pageVersionId: version.id, summary };
    }
  });

  const applyFullHtmlTool = tool({
    description:
      "Fallback for apply_patch: replace the whole page with a complete corrected HTML document. Only use after apply_patch has failed validation twice in this turn, or when creating/restructuring the page from scratch.",
    inputSchema: applyFullHtmlInputSchema,
    execute: async ({ html, summary }) => {
      const version = await persistVersion({
        html,
        origin: "ai_full",
        patch: null
      });
      return { success: true as const, pageVersionId: version.id, summary };
    }
  });

  const [skills, org] = await Promise.all([
    skillsRepository.listEnabledForLandingPage(db, orgId, landingPageId),
    organizationsRepository.findById(db, orgId)
  ]);
  // FR-B-24: org.settings.designTokens (no settings UI writes it yet — see contracts/tenancy.ts).
  const { designTokens } = orgSettingsSchema.parse(org?.settings ?? {});

  const result = streamText({
    model,
    // architecture.md §7: page content is untrusted (import/AI-authored) — compilePrompt
    // wraps it in a delimiter and marks it as data, not instructions.
    system: compilePrompt({
      html: currentHtml,
      skills: skills.map((s) => ({ name: s.name, content: s.content })),
      designTokens
    }),
    messages: await convertToModelMessages(
      expandCommentContextForModel(messages)
    ),
    tools: { apply_patch: applyPatchTool, apply_full_html: applyFullHtmlTool },
    // Lets the model retry apply_patch (up to MAX_PATCH_ATTEMPTS) or fall back to
    // apply_full_html within the same turn (ai-integration-byok.md §6).
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

const suggestImagesSchema = z.object({
  landingPageId: z.string(),
  query: z.string().trim().min(1).max(200)
});

// FR-B-32/33 step 2: candidates only, nothing is written yet — the tenant picks one (or
// skips) before anything lands in `pageAssets`/the page. Returns `[]` (not an error) when
// no provider is configured, so the caller can fall back to "no suggestions available".
studioRoutes.post("/images/suggest", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const { landingPageId, query } = suggestImagesSchema.parse(
    await c.req.json()
  );
  await requireLandingPage(db, orgId, landingPageId);

  const candidates = await searchStockImages(query, c.env);
  return c.json({
    candidates: z.array(stockImageCandidateSchema).parse(candidates)
  });
});

const applyImageSchema = z.object({
  landingPageId: z.string(),
  srcmapId: z.string().min(1),
  candidate: stockImageCandidateSchema
});

// FR-B-32/33 step 3: only reached after the tenant explicitly confirms a suggestion. Downloads
// the bytes into our own storage (not a hotlink) so ZIP export/pageAssets have real bytes like
// any `user_upload`, and records `source`/`license` for provenance.
studioRoutes.post("/images/apply", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const body = applyImageSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, body.landingPageId);
  if (!landingPage.currentVersionId) {
    throw new ApiError(400, "landing_page_no_version");
  }
  const foundVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!foundVersion) throw new ApiError(404, "page_version_not_found");
  const currentVersion = requireSrcmapVersion(foundVersion);

  const storage = createStorageFromEnv(c.env);
  const htmlObject = await storage.get(currentVersion.htmlKey);
  if (!htmlObject) throw new ApiError(404, "html_not_found");
  const currentHtml = await new Response(htmlObject.body).text();

  const validation = validatePatchOps(currentHtml, [
    { type: "setAttr", srcmapId: body.srcmapId, attr: "src", value: null }
  ]);
  if (!validation.valid) throw new ApiError(400, "invalid_srcmap_id");
  if (!isAllowedStockImageUrl(body.candidate)) {
    throw new ApiError(400, "invalid_candidate_url");
  }

  const imageRes = await fetch(body.candidate.url);
  if (!imageRes.ok) throw new ApiError(502, "stock_image_fetch_failed");
  const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
  const bytes = await imageRes.arrayBuffer();
  const ext = contentType.includes("png") ? "png" : "jpg";
  const r2Key = `landing-pages/${landingPage.id}/assets/${crypto.randomUUID()}.${ext}`;
  await storage.put({ key: r2Key, body: bytes, contentType });

  const asset = await pageAssetsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    fileName: `${body.candidate.provider}-${crypto.randomUUID()}.${ext}`,
    r2Key,
    mime: contentType,
    sizeBytes: bytes.byteLength,
    variants: {},
    source: "stock_licensed",
    license: {
      provider: body.candidate.provider,
      attribution: body.candidate.attribution,
      sourceUrl: body.candidate.sourceUrl
    },
    unverifiedSource: false,
    usageConfirmed: false
  });
  if (!asset) throw new ApiError(500, "page_asset_create_failed");

  const assetUrl = `/api/landings/${landingPage.id}/assets/${asset.id}/file`;
  const applyOps: PatchOp[] = [
    { type: "setAttr", srcmapId: body.srcmapId, attr: "src", value: assetUrl },
    // Placeholder marker no longer applies once a real image is in place.
    {
      type: "setAttr",
      srcmapId: body.srcmapId,
      attr: "data-cc-need-image",
      value: null
    }
  ];
  const html = applyOpsToHtml(currentHtml, applyOps);

  const seq = currentVersion.seq + 1;
  const htmlKey = `landing-pages/${landingPage.id}/v${seq}/index.html`;
  await storage.put({ key: htmlKey, body: html, contentType: "text/html" });
  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq,
    htmlKey,
    srcmapKey: currentVersion.srcmapKey,
    origin: "manual",
    patch: applyOps,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");
  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });

  return c.json(
    { asset: pageAssetSchema.parse(asset), pageVersionId: version.id },
    201
  );
});
