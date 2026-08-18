import { chatSessionsRepository, landingPagesRepository } from "@dv/db";

import type { createDbFromEnv } from "./db.js";
import { ApiError } from "./errors.js";

export async function requireLandingPage(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPageId: string
) {
  const landingPage = await landingPagesRepository.findById(
    db,
    orgId,
    landingPageId
  );
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }
  return landingPage;
}

/** Comments/chat are per-page and each page has at most one chat session — create it lazily. */
export async function requireChatSessionId(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPage: NonNullable<Awaited<ReturnType<typeof requireLandingPage>>>
): Promise<string> {
  if (landingPage.chatSessionId) return landingPage.chatSessionId;
  const session = await chatSessionsRepository.insert(db, orgId, {
    landingPageId: landingPage.id,
    title: null
  });
  if (!session) throw new ApiError(500, "chat_session_create_failed");
  await landingPagesRepository.update(db, orgId, landingPage.id, {
    chatSessionId: session.id
  });
  return session.id;
}
