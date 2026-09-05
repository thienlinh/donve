import {
  chatMessageSchema,
  pageAssetSchema,
  stockImageCandidateSchema,
  studioCommentSchema,
  type ChatMessage,
  type PageAsset,
  type StockImageCandidate,
  type StudioComment
} from "@dv/contracts";
import { z } from "zod";

/** Same fetch pattern as `features/studio/api.ts` — cookie session lives on the API origin. */
async function studioFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/studio${path}`, {
    ...init,
    credentials: "include",
    headers
  });
  if (!res.ok) {
    throw new Error(`studio api ${path} failed: ${res.status}`);
  }
  return res;
}

const commentListResponseSchema = z.object({
  comments: z.array(studioCommentSchema)
});

export async function fetchComments(
  landingPageId: string
): Promise<StudioComment[]> {
  const res = await studioFetch(
    `/comments?landingPageId=${encodeURIComponent(landingPageId)}`
  );
  return commentListResponseSchema.parse(await res.json()).comments;
}

export async function createComment(input: {
  landingPageId: string;
  srcmapId: string;
  body: string;
  screenshotKey?: string | null;
}): Promise<StudioComment> {
  const res = await studioFetch("/comments", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return studioCommentSchema.parse(await res.json());
}

export async function sendComment(id: string): Promise<ChatMessage> {
  const res = await studioFetch(`/comments/${id}/send`, { method: "POST" });
  return chatMessageSchema.parse(await res.json());
}

export async function sendAllQueuedComments(
  landingPageId: string
): Promise<ChatMessage> {
  const res = await studioFetch("/comments/send-all", {
    method: "POST",
    body: JSON.stringify({ landingPageId })
  });
  return chatMessageSchema.parse(await res.json());
}

export async function sendDrawMessage(input: {
  landingPageId: string;
  text: string;
  imageDataUrl: string;
}): Promise<ChatMessage> {
  const res = await studioFetch("/messages", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return chatMessageSchema.parse(await res.json());
}

const messageListResponseSchema = z.object({
  messages: z.array(chatMessageSchema)
});

export async function fetchChatMessages(
  landingPageId: string
): Promise<ChatMessage[]> {
  const res = await studioFetch(
    `/messages?landingPageId=${encodeURIComponent(landingPageId)}`
  );
  return messageListResponseSchema.parse(await res.json()).messages;
}

const stockCandidatesResponseSchema = z.object({
  candidates: z.array(stockImageCandidateSchema)
});

/** FR-B-32/33 — only called once the tenant asks for suggestions in chat; never automatic. */
export async function suggestStockImages(
  landingPageId: string,
  query: string
): Promise<StockImageCandidate[]> {
  const res = await studioFetch("/images/suggest", {
    method: "POST",
    body: JSON.stringify({ landingPageId, query })
  });
  return stockCandidatesResponseSchema.parse(await res.json()).candidates;
}

const applyImageResponseSchema = z.object({
  asset: pageAssetSchema,
  pageVersionId: z.string()
});

/** FR-B-32/33 — only called after the tenant explicitly confirms one candidate. */
export async function applyStockImage(input: {
  landingPageId: string;
  srcmapId: string;
  candidate: StockImageCandidate;
}): Promise<{ asset: PageAsset; pageVersionId: string }> {
  const res = await studioFetch("/images/apply", {
    method: "POST",
    body: JSON.stringify(input)
  });
  return applyImageResponseSchema.parse(await res.json());
}
