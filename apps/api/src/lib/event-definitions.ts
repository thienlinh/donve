import { eventDefinitionsRepository } from "@dv/db";
import { componentMetaById } from "@dv/studio-catalog";

import type { createDbFromEnv } from "./db.js";

/** `tracking-and-attribution.md` §Event registry — "Sinh tự động ngay khi Page Architect chốt
 * PageSpec." Called after every pageVersion that changes which components are on the page
 * (`/architecture`, Auto Fixer's structure-finding branch, the native chat's `apply_page_patch`)
 * — replaces the landing page's whole registry with 1 row per `(elementId, eventName)` its
 * current elements actually declare. */
export async function syncEventDefinitions(
  db: ReturnType<typeof createDbFromEnv>,
  orgId: string,
  landingPageId: string,
  pageVersionId: string,
  elements: Record<string, { type: string }>,
  rootChildren: string[]
): Promise<void> {
  const rows = rootChildren.flatMap((elementId) => {
    const element = elements[elementId];
    const meta = element ? componentMetaById.get(element.type) : undefined;
    if (!element || !meta) return [];
    return meta.trackingEvents.map((eventName) => ({
      pageVersionId,
      eventName,
      elementId,
      componentId: element.type,
      requiredProperties: []
    }));
  });
  await eventDefinitionsRepository.replaceForLandingPage(
    db,
    orgId,
    landingPageId,
    rows
  );
}
