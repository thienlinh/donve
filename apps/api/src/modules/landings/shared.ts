import { strategyBriefSchema } from "@dv/contracts";
import { landingPagesRepository, pageVersionsRepository } from "@dv/db";
import { compileContentAgentPrompt } from "@dv/studio-ai";
import {
  catalogComponents,
  componentMetaById,
  componentMetadata
} from "@dv/studio-catalog";
import type { Context } from "hono";
import { z } from "zod";

import { runModelCompletion } from "@/lib/ai-gateway.js";
import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { restoreSensitiveProps } from "@/lib/sensitive-props.js";
import type { AppEnv, Bindings } from "@/types.js";

// `Variables.orgId` is nullable app-wide (platform routes never set it) but `requireOrgSession`
// guarantees it here — every handler in this module runs behind that middleware (app.ts).
export function requireOrgId(c: Context<AppEnv>): string {
  const orgId = c.get("orgId");
  if (!orgId) throw new ApiError(500, "missing_org_context");
  return orgId;
}

export async function requireLandingPage(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  id: string
) {
  const landingPage = await landingPagesRepository.findById(db, orgId, id);
  if (!landingPage || landingPage.deletedAt) {
    throw new ApiError(404, "landing_page_not_found");
  }
  return landingPage;
}

/** Shared `db`/`orgId`/`id` + existence-check prologue for the many handlers that only need the
 * landing page to exist (don't need the row itself) before doing their own thing. */
export async function requireLandingPageContext(c: Context<AppEnv>) {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  // `Context<AppEnv>` here is generic (not tied to a `"/:id/..."` literal), so Hono's own
  // `ParamKeys` inference can't guarantee `:id` exists — every caller only ever mounts this on
  // an `/:id/...` route, so it's always present at runtime; `requireLandingPage` below throws a
  // clean 404 in the (impossible in practice) case it isn't.
  const id = c.req.param("id") as string;
  await requireLandingPage(db, orgId, id);
  return { db, orgId, id };
}

/** Model output should be pure JSON per the prompt, but defensively strip a markdown fence in
 * case it wraps the object in one anyway (same defensive move as `extractHtml` in generate.routes). */
export function extractJson<T>(text: string, schema: z.ZodType<T>): T {
  const trimmed = text.trim();
  const fenced = /^```(?:json)?\n([\s\S]*?)\n```$/.exec(trimmed);
  const raw = fenced?.[1] ? fenced[1].trim() : trimmed;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ApiError(
      422,
      "model_output_invalid",
      "Model did not return valid JSON"
    );
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new ApiError(422, "model_output_invalid", result.error.message);
  }
  return result.data;
}

/** Inserts the next `pageVersions` row for `landingPageId` at `seq` and advances the landing
 * page's `currentVersionId` to it — the "create version + activate" ending shared by every route
 * that lands a brand new current version (spec-fill, content-fill, manual HTML edit, ...). */
export async function insertVersionAndActivate(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPageId: string,
  seq: number,
  fields: Omit<
    Parameters<typeof pageVersionsRepository.insert>[2],
    "landingPageId" | "seq"
  >
) {
  const version = await pageVersionsRepository.insert(db, orgId, {
    landingPageId,
    seq,
    ...fields
  });
  if (!version) throw new ApiError(500, "page_version_create_failed");

  await landingPagesRepository.update(db, orgId, landingPageId, {
    currentVersionId: version.id
  });

  return version;
}

/** Shared by `PATCH /:id/spec` (manual edit) and the native branch of `POST
 * /:id/versions/:versionId/restore` (restoring a native/PageSpec version) — both just land a
 * new `pageVersions` row carrying a `spec` and activate it, differing only in `origin`. */
export async function applySpecUpdate(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPageId: string,
  spec: unknown,
  origin: "manual" | "restore"
) {
  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    landingPageId
  );
  const seq = (versions[0]?.seq ?? 0) + 1;

  return insertVersionAndActivate(db, orgId, landingPageId, seq, {
    origin,
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec
  });
}

export const pageArchitectSectionSchema = z.object({
  componentId: z.string(),
  variant: z.string(),
  purpose: z.enum([
    "understanding",
    "desire",
    "proof",
    "risk_reduction",
    "action"
  ]),
  reason: z.string()
});
export const pageArchitectResultSchema = z.object({
  sections: z.array(pageArchitectSectionSchema).min(1)
});

export type ArchitectElement = {
  type: string;
  props: Record<string, unknown>;
  children: string[];
};
export type ArchitectureNote = { purpose: string; reason: string };

/** Shared by `/architecture` (full page) and the Auto Fixer's structure-finding branch
 * (append-only) — validates each proposed section against the real catalog before it's allowed
 * to land as an element. */
export function buildElementsFromSections(
  sections: z.infer<typeof pageArchitectSectionSchema>[]
): {
  elements: Record<string, ArchitectElement>;
  architectureNotes: Record<string, ArchitectureNote>;
  elementIds: string[];
} {
  const knownIds = new Set(componentMetadata.map((m) => m.componentId));
  const elements: Record<string, ArchitectElement> = {};
  const architectureNotes: Record<string, ArchitectureNote> = {};
  const elementIds: string[] = [];

  for (const section of sections) {
    if (!knownIds.has(section.componentId)) {
      throw new ApiError(
        422,
        "model_output_invalid",
        `Unknown componentId: ${section.componentId}`
      );
    }
    const meta = componentMetaById.get(section.componentId);
    if (
      meta &&
      meta.variants.length > 0 &&
      !meta.variants.includes(section.variant)
    ) {
      throw new ApiError(
        422,
        "model_output_invalid",
        `Unknown variant "${section.variant}" for ${section.componentId}`
      );
    }
    const elementId = `${section.componentId}-${crypto.randomUUID().slice(0, 8)}`;
    elements[elementId] = {
      type: section.componentId,
      props:
        meta && meta.variants.length > 0 ? { variant: section.variant } : {},
      children: []
    };
    architectureNotes[elementId] = {
      purpose: section.purpose,
      reason: section.reason
    };
    elementIds.push(elementId);
  }
  return { elements, architectureNotes, elementIds };
}

/** Shared by `/content-fill` (fresh element, `fixGuidance` unset) and the Auto Fixer's
 * content-finding branch (`fixGuidance` = the finding's own message). Restores any
 * `sensitiveProps` path to its pre-call value regardless of what the model returned
 * (`ai/agent-pipeline.md` §Guardrails — no `humanApproved` flow exists yet, so a model can never
 * legitimately change a sensitive field through this path). Schema mismatches come back as a
 * soft failure so a caller can choose to hard-fail (`/content-fill`) or skip-and-continue
 * (Auto Fixer, mid-loop). */
export async function fillElementProps(
  db: ReturnType<typeof createDbFromEnv>,
  env: Bindings,
  orgId: string,
  connectionId: string,
  strategyBrief: z.infer<typeof strategyBriefSchema>,
  element: { type: string; props: Record<string, unknown> },
  note: { purpose: string; reason: string },
  fixGuidance?: string
): Promise<
  | { success: true; props: Record<string, unknown> }
  | { success: false; error: string }
> {
  const componentEntry = catalogComponents[element.type];
  if (!componentEntry) {
    return { success: false, error: `Unknown component type: ${element.type}` };
  }
  const currentProps = element.props as { variant?: string };
  const system = compileContentAgentPrompt({
    componentId: element.type,
    variant: currentProps.variant ?? "",
    purpose: note.purpose,
    reason: note.reason,
    strategyBrief,
    propsJsonSchema: componentEntry.props.toJSONSchema(),
    fixGuidance
  });
  const result = await runModelCompletion(
    db,
    env,
    orgId,
    connectionId,
    "patch",
    [
      { role: "system", content: system },
      { role: "user", content: `Điền props cho ${element.type}.` }
    ]
  );
  const rawProps = extractJson(result.text, z.record(z.string(), z.unknown()));
  const validated = componentEntry.props.safeParse(rawProps);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error?.message ?? "schema mismatch"
    };
  }
  const meta = componentMetaById.get(element.type);
  const props =
    meta && meta.sensitiveProps.length > 0
      ? restoreSensitiveProps(
          validated.data as Record<string, unknown>,
          element.props,
          meta.sensitiveProps
        )
      : (validated.data as Record<string, unknown>);
  return { success: true, props };
}
