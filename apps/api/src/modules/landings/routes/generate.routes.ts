import {
  generateLandingPageInputSchema,
  orgSettingsSchema,
  pageVersionSchema
} from "@dv/contracts";
import {
  chatMessagesRepository,
  landingPagesRepository,
  organizationsRepository,
  pageAssetsRepository,
  pageVersionsRepository,
  skillsRepository
} from "@dv/db";
import { compileGeneratePrompt } from "@dv/studio-ai";
import {
  InvalidGeneratedHtmlError,
  srcmapToJson,
  stampSrcmap
} from "@dv/studio-core";
import { sanitizeLandingHtml } from "@dv/studio-core/sanitize";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "@/lib/ai-gateway.js";
import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { log } from "@/lib/logger.js";
import { createStorageFromEnv } from "@/lib/storage.js";
import { requireChatSessionId } from "@/lib/studio-chat.js";
import type { AppEnv, Bindings } from "@/types.js";

import { requireLandingPage, requireOrgId } from "../shared.js";

export const generateRoutes = new Hono<AppEnv>();

/** Model output should be raw HTML per the generate prompt, but defensively strip a markdown
 * fence in case it wraps the document in one anyway. */
function extractHtml(text: string): string {
  const trimmed = text.trim();
  const fenced = /^```(?:html)?\n([\s\S]*?)\n```$/.exec(trimmed);
  return fenced?.[1] ? fenced[1].trim() : trimmed;
}

const NEED_IMAGE_ATTR = "data-cc-need-image";

/** Finds every `data-cc-need-image="..."` placeholder the model left (FR-B-32/33) — each is
 * one element the AI couldn't fill with a tenant image and didn't invent a stock URL for. */
function findImagePlaceholders(
  html: string
): { srcmapId: string; description: string }[] {
  const placeholders: { srcmapId: string; description: string }[] = [];
  const re = new RegExp(
    `<[^>]*\\bdata-cc-id="([^"]+)"[^>]*\\b${NEED_IMAGE_ATTR}="([^"]*)"[^>]*>|` +
      `<[^>]*\\b${NEED_IMAGE_ATTR}="([^"]*)"[^>]*\\bdata-cc-id="([^"]+)"[^>]*>`,
    "g"
  );
  for (const match of html.matchAll(re)) {
    const srcmapId = match[1] ?? match[4];
    const description = match[2] ?? match[3] ?? "";
    if (srcmapId) placeholders.push({ srcmapId, description });
  }
  return placeholders;
}

/**
 * Everything after the model call resolves, for the very first version of a page (seq=1):
 * sanitize/stamp, store, land the `pageVersions` row, advance the page, and (FR-B-32/33)
 * nudge the user in chat if the model left any `data-cc-need-image` placeholders. Shared by
 * the non-streaming and streaming `/generate` handlers so they can't drift apart.
 */
async function persistFirstGeneratedVersion(
  db: ReturnType<typeof createDbFromEnv>,
  env: Bindings,
  orgId: string,
  landingPage: Awaited<ReturnType<typeof requireLandingPage>>,
  rawText: string
) {
  let html: string;
  try {
    html = stampSrcmap(sanitizeLandingHtml(extractHtml(rawText)));
  } catch (err) {
    // Surfaced as a clean, client-safe 422 instead of the raw parser error (`err.message` is
    // masked entirely for a 500 — see errorHandler.ts) — the retry button on the studio empty
    // state is the actual fix here, not anything this route can do about a model's one-off bad
    // output, but the user needs a real explanation to know that's what happened.
    if (err instanceof InvalidGeneratedHtmlError) {
      throw new ApiError(422, "model_output_invalid", err.message);
    }
    throw err;
  }

  const storage = createStorageFromEnv(env);
  const seq = 1;
  const htmlKey = `landing-pages/${landingPage.id}/v${seq}/index.html`;
  const srcmapKey = `landing-pages/${landingPage.id}/v${seq}/index.html.srcmap.json`;
  await storage.put({ key: htmlKey, body: html, contentType: "text/html" });
  await storage.put({
    key: srcmapKey,
    body: JSON.stringify(srcmapToJson(html), null, 2),
    contentType: "application/json"
  });

  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    seq,
    htmlKey,
    srcmapKey,
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  // Usage/billing is already recorded inside `runModelCompletion` (trial debit, platform
  // credit debit, or BYOK usage insert) — nothing left to do here but advance the page.
  await landingPagesRepository.update(db, orgId, landingPage.id, {
    currentVersionId: version.id
  });

  const placeholders = findImagePlaceholders(html);
  if (placeholders.length > 0) {
    const sessionId = await requireChatSessionId(db, orgId, landingPage);
    const listing = placeholders
      .map((p) => `- ${p.description || "ảnh minh hoạ"} (${p.srcmapId})`)
      .join("\n");
    await chatMessagesRepository.insert(db, orgId, {
      sessionId,
      role: "assistant",
      content: [
        {
          type: "text",
          text:
            `Trang vừa tạo còn ${placeholders.length} vị trí cần ảnh minh hoạ:\n${listing}\n\n` +
            `Bạn có ảnh thật muốn dùng ở đây không? Nếu không, mình có thể gợi ý ảnh stock miễn phí ` +
            `(Unsplash/Pexels, license thương mại) — trả lời "dùng ảnh gợi ý" hoặc bỏ qua câu hỏi này.`
        }
      ],
      tokenUsage: null
    });
  }

  return version;
}

// FR-B-21: the very first version for a page created via the prompt bar (Phase 1 only created
// the empty record). Studio's pending-skeleton state (studio-page.tsx) calls this once on
// mount. FR-B-32/33: the model is instructed (compileGeneratePrompt) to prefer tenant images,
// otherwise leave a `data-cc-need-image` placeholder rather than invent/hotlink a stock URL —
// after landing the version, we ask in chat before ever inserting one (apply happens through
// the separate confirm-first `/api/studio/images/apply` endpoint, never automatically here).
generateRoutes.post("/:id/generate", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const { prompt } = generateLandingPageInputSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, id);
  if (landingPage.currentVersionId) {
    throw new ApiError(400, "landing_page_already_generated");
  }

  const [connectionId, skills, tenantAssets, org] = await Promise.all([
    resolveGenerateConnectionId(db, orgId),
    skillsRepository.listEnabledForLandingPage(db, orgId, id),
    pageAssetsRepository.listByLandingPage(db, orgId, id),
    organizationsRepository.findById(db, orgId)
  ]);
  // FR-B-24: org.settings.designTokens (no settings UI writes it yet — see contracts/tenancy.ts).
  const { designTokens } = orgSettingsSchema.parse(org?.settings ?? {});

  const system = compileGeneratePrompt({
    skills: skills.map((s) => ({ name: s.name, content: s.content })),
    tenantImages: tenantAssets.map((asset) => ({
      url: `/api/landings/${id}/assets/${asset.id}/file`,
      description: asset.fileName
    })),
    designTokens
  });

  const result = await runModelCompletion(
    db,
    c.env,
    orgId,
    connectionId,
    "generate",
    [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ]
  );
  const version = await persistFirstGeneratedVersion(
    db,
    c.env,
    orgId,
    landingPage,
    result.text
  );

  return c.json(pageVersionSchema.parse(version), 201);
});

/**
 * Streaming twin of POST /:id/generate (FR-B-21) — same connection resolution and
 * post-processing, but relays each text chunk to the browser as SSE so the studio UI can show
 * live progress instead of a silent multi-minute wait (a full generate can easily take minutes
 * on a slow BYOK model, with the non-streaming endpoint giving zero feedback until it's done).
 */
generateRoutes.post("/:id/generate/stream", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const { prompt } = generateLandingPageInputSchema.parse(await c.req.json());

  const landingPage = await requireLandingPage(db, orgId, id);
  if (landingPage.currentVersionId) {
    throw new ApiError(400, "landing_page_already_generated");
  }

  const [connectionId, skills, tenantAssets, org] = await Promise.all([
    resolveGenerateConnectionId(db, orgId),
    skillsRepository.listEnabledForLandingPage(db, orgId, id),
    pageAssetsRepository.listByLandingPage(db, orgId, id),
    organizationsRepository.findById(db, orgId)
  ]);
  // FR-B-24: org.settings.designTokens (no settings UI writes it yet — see contracts/tenancy.ts).
  const { designTokens } = orgSettingsSchema.parse(org?.settings ?? {});

  const system = compileGeneratePrompt({
    skills: skills.map((s) => ({ name: s.name, content: s.content })),
    tenantImages: tenantAssets.map((asset) => ({
      url: `/api/landings/${id}/assets/${asset.id}/file`,
      description: asset.fileName
    })),
    designTokens
  });

  return streamSSE(c, async (stream) => {
    // Headers are already sent once streaming starts — a thrown ApiError past this point can't
    // become a normal JSON error response, so relay it as one last SSE event instead, caught
    // locally rather than via streamSSE's `onError` (which unconditionally writes its own
    // second, plain-text "error" event right after any custom one — this way there's exactly
    // one). The studio client (studio-page.tsx) reads `code` the same way it reads a failed
    // non-streaming call's response body.
    try {
      const result = await runModelCompletion(
        db,
        c.env,
        orgId,
        connectionId,
        "generate",
        [
          { role: "system", content: system },
          { role: "user", content: prompt }
        ],
        (delta) => stream.writeSSE({ event: "delta", data: delta })
      );
      const version = await persistFirstGeneratedVersion(
        db,
        c.env,
        orgId,
        landingPage,
        result.text
      );
      await stream.writeSSE({
        event: "done",
        data: JSON.stringify(pageVersionSchema.parse(version))
      });
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "internal_error";
      const message = err instanceof Error ? err.message : String(err);
      // Errors caught here never reach Hono's own error-handling middleware (this response
      // already started streaming), so without an explicit log call a real server-side crash
      // is otherwise completely silent — only visible as a client-reported message, with
      // nothing in the server's own logs to correlate it against.
      log("error", {
        requestId: c.get("requestId"),
        orgId,
        status: 200,
        code,
        message
      });
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({ code, message })
      });
    }
  });
});
