import type { pageVersionsRepository } from "@dv/db";

import { ApiError } from "./errors.js";

type PageVersionRow = NonNullable<
  Awaited<ReturnType<typeof pageVersionsRepository.findById>>
>;

/**
 * Narrows a `pageVersions` row to the legacy srcmap shape (`htmlKey`/`srcmapKey` both set).
 * A native (`spec`-only) version reaching one of the srcmap-editor-only routes below means the
 * route was called on the wrong kind of landing page, not a storage bug — 409, not a crash on
 * `storage.get(null)`.
 */
export function requireSrcmapVersion(
  version: PageVersionRow
): PageVersionRow & { htmlKey: string; srcmapKey: string } {
  if (!version.htmlKey || !version.srcmapKey) {
    throw new ApiError(409, "native_version_not_srcmap_editable");
  }
  return version as PageVersionRow & { htmlKey: string; srcmapKey: string };
}
