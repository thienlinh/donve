import {
  promptLibraryEntrySchema,
  promptLibraryListResponseSchema
} from "@dv/contracts";
import { promptLibraryRepository } from "@dv/db";
import { Hono } from "hono";

import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import type { AppEnv } from "@/types.js";

/**
 * Platform-wide, read-only prompt gallery (`requireOrgSession` already applies at
 * `/api/prompt-library/*` in app.ts — every authenticated org can read it, no feature-flag
 * gate, since this is static reference content, not an AI-connection-gated capability).
 */
export const promptLibraryRoutes = new Hono<AppEnv>();

promptLibraryRoutes.get("/:slug", async (c) => {
  const db = createDbFromEnv(c.env);
  const entry = await promptLibraryRepository.findBySlug(
    db,
    c.req.param("slug")
  );
  if (!entry) throw new ApiError(404, "prompt_library_entry_not_found");
  return c.json(promptLibraryEntrySchema.parse(entry));
});

promptLibraryRoutes.get("/", async (c) => {
  const db = createDbFromEnv(c.env);
  const rows = await promptLibraryRepository.list(db);
  return c.json(promptLibraryListResponseSchema.parse({ entries: rows }));
});
