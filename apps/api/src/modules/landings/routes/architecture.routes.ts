import {
  nativePageDocumentSchema,
  pageVersionSchema,
  strategyBriefSchema
} from "@dv/contracts";
import { pageVersionsRepository, strategyBriefsRepository } from "@dv/db";
import { compilePageArchitectPrompt } from "@dv/studio-ai";
import {
  architectCatalogSummary,
  DEFAULT_DESIGN_TOKENS
} from "@dv/studio-catalog";
import { Hono } from "hono";

import {
  resolveGenerateConnectionId,
  runModelCompletion
} from "@/lib/ai-gateway.js";
import { createDbFromEnv } from "@/lib/db.js";
import { ApiError } from "@/lib/errors.js";
import { syncEventDefinitions } from "@/lib/event-definitions.js";
import type { AppEnv } from "@/types.js";

import {
  buildElementsFromSections,
  extractJson,
  fillElementProps,
  insertVersionAndActivate,
  pageArchitectResultSchema,
  requireLandingPage,
  requireLandingPageContext,
  requireOrgId
} from "../shared.js";

export const architectureRoutes = new Hono<AppEnv>();

// --- Page Architect + Content Agent (ai/agent-pipeline.md §Agent roles) ---

// Page Architect — requires a *confirmed* Strategy Brief (`strategy-brief.md` §Xác nhận).
// Seeds each element's props with only `variant` (the one prop field the flat `PageSpec`
// model has no separate slot for — page-schema.md's `PageElement` has no `variant` field of
// its own) — everything else stays for Content Agent to fill next.
architectureRoutes.post("/:id/architecture", async (c) => {
  const { db, orgId, id } = await requireLandingPageContext(c);

  const strategyBriefRow = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!strategyBriefRow) throw new ApiError(409, "strategy_brief_required");
  if (!strategyBriefRow.confirmedAt) {
    throw new ApiError(409, "strategy_brief_not_confirmed");
  }
  const strategyBrief = strategyBriefSchema.parse(strategyBriefRow);

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const system = compilePageArchitectPrompt({
    strategyBrief,
    catalog: architectCatalogSummary
  });
  const result = await runModelCompletion(
    db,
    c.env,
    orgId,
    connectionId,
    "generate",
    [
      { role: "system", content: system },
      {
        role: "user",
        content: "Đề xuất kiến trúc trang từ Strategy Brief ở trên."
      }
    ]
  );
  const parsed = extractJson(result.text, pageArchitectResultSchema);

  const {
    elements,
    architectureNotes,
    elementIds: rootChildren
  } = buildElementsFromSections(parsed.sections);
  elements["page-root"] = {
    type: "page_root",
    props: {},
    children: rootChildren
  };

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const version = await insertVersionAndActivate(db, orgId, id, seq, {
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      pageSpec: { root: "page-root", elements },
      tokens: DEFAULT_DESIGN_TOKENS,
      architectureNotes
    }
  });
  await syncEventDefinitions(db, orgId, id, version.id, elements, rootChildren);

  return c.json(pageVersionSchema.parse(version), 201);
});

// Content Agent — runs once per element, in parallel (ai/agent-pipeline.md §Model routing:
// "Content Agent: model nhỏ đủ dùng"). Requires an ARCHITECTED version (has `architectureNotes`)
// already on `currentVersionId`.
architectureRoutes.post("/:id/content-fill", async (c) => {
  const db = createDbFromEnv(c.env);
  const orgId = requireOrgId(c);
  const id = c.req.param("id");
  const landingPage = await requireLandingPage(db, orgId, id);
  if (!landingPage.currentVersionId)
    throw new ApiError(409, "architecture_required");

  const currentVersion = await pageVersionsRepository.findById(
    db,
    orgId,
    landingPage.currentVersionId
  );
  if (!currentVersion?.spec) throw new ApiError(409, "architecture_required");
  const doc = nativePageDocumentSchema.parse(currentVersion.spec);
  if (!doc.architectureNotes) throw new ApiError(409, "architecture_required");

  const strategyBriefRow = await strategyBriefsRepository.findByLandingPage(
    db,
    orgId,
    id
  );
  if (!strategyBriefRow) throw new ApiError(409, "strategy_brief_required");
  const strategyBrief = strategyBriefSchema.parse(strategyBriefRow);

  const connectionId = await resolveGenerateConnectionId(db, orgId);
  const rootElement = doc.pageSpec.elements[doc.pageSpec.root];
  const elementIds = rootElement?.children ?? [];

  const filled = await Promise.all(
    elementIds.map(async (elementId) => {
      const element = doc.pageSpec.elements[elementId];
      const note = doc.architectureNotes?.[elementId];
      if (!element || !note) return null;

      const outcome = await fillElementProps(
        db,
        c.env,
        orgId,
        connectionId,
        strategyBrief,
        element,
        note
      );
      if (!outcome.success) {
        throw new ApiError(
          422,
          "model_output_invalid",
          `${elementId}: ${outcome.error}`
        );
      }
      return [elementId, outcome.props] as const;
    })
  );

  const newElements = { ...doc.pageSpec.elements };
  for (const entry of filled) {
    if (!entry) continue;
    const [elementId, props] = entry;
    const existingElement = newElements[elementId];
    if (existingElement) newElements[elementId] = { ...existingElement, props };
  }

  const versions = await pageVersionsRepository.listByLandingPage(
    db,
    orgId,
    id
  );
  const seq = (versions[0]?.seq ?? 0) + 1;
  const version = await insertVersionAndActivate(db, orgId, id, seq, {
    origin: "ai_full",
    patch: null,
    chatMessageId: null,
    label: null,
    createdBy: null,
    spec: {
      ...doc,
      pageSpec: { ...doc.pageSpec, elements: newElements }
    }
  });

  return c.json(pageVersionSchema.parse(version), 201);
});
