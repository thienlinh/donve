import { createApiFetch } from "./api-client";

const entityImagesFetch = createApiFetch("entity-images");

/** Org logo / campaign OG image (`architecture-and-data-model.md` §Media/Asset) — one shared
 * endpoint for both, keyed by (ownerType, ownerId, kind). Not `features/*\/api.ts`: it's used
 * from two unrelated features (org settings, campaigns), like `api-client` itself. */
export type EntityImageOwnerType = "organization" | "campaign";
export type EntityImageKind = "logo" | "og_image";

export interface EntityImageRef {
  ownerType: EntityImageOwnerType;
  ownerId: string;
  kind: EntityImageKind;
}

function pathFor(ref: EntityImageRef): string {
  return `/${ref.ownerType}/${ref.ownerId}/${ref.kind}`;
}

/** Authenticated byte stream — used directly as an `<img src>` with `crossOrigin`. */
export function entityImageUrl(ref: EntityImageRef, version = 0): string {
  const base = `${import.meta.env.VITE_API_URL}/api/entity-images${pathFor(ref)}`;
  // Cache-busted after a replace: the R2 key is deterministic, so the URL never changes.
  return version > 0 ? `${base}?v=${version}` : base;
}

export async function uploadEntityImage(
  ref: EntityImageRef,
  blob: Blob,
  fileName: string
): Promise<void> {
  const body = new FormData();
  body.set("file", blob, fileName);
  await entityImagesFetch(pathFor(ref), { method: "PUT", body });
}

export async function deleteEntityImage(ref: EntityImageRef): Promise<void> {
  await entityImagesFetch(pathFor(ref), { method: "DELETE" });
}
