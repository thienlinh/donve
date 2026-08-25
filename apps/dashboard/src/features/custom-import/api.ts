import {
  auditResultSchema,
  convertToNativeResultSchema,
  customChatApplyResultSchema,
  customChatProposeResultSchema,
  customPageBundleSchema,
  importCustomPageResponseSchema,
  pageVersionSchema,
  type AuditResult,
  type ConvertToNativeResult,
  type CustomChatApplyResult,
  type CustomChatEdit,
  type CustomChatProposeResult,
  type CustomPageBundle,
  type ImportCustomPageResponse,
  type PageVersion,
  type WireLeadFormInput
} from "@dv/contracts";

import { createApiFetch } from "@/lib/api-client";

const landingsFetch = createApiFetch("landings");

export type ImportCustomPageInput = { name?: string } & (
  | { mode: "html"; html: string }
  | { mode: "url"; url: string }
  | { mode: "file"; file: File }
);

function toFormData(input: ImportCustomPageInput): FormData {
  const body = new FormData();
  body.set("mode", input.mode);
  if (input.name) body.set("name", input.name);
  if (input.mode === "html") body.set("html", input.html);
  else if (input.mode === "url") body.set("url", input.url);
  else body.set("file", input.file, input.file.name);
  return body;
}

/** `page-system/custom-import.md` §Quy trình import — same multipart shape as the legacy
 * `/import`, but lands `source: "custom_import"` with no srcmap patch editor. */
export async function importCustomPage(
  input: ImportCustomPageInput
): Promise<ImportCustomPageResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/import-custom`,
    { method: "POST", credentials: "include", body: toFormData(input) }
  );
  if (!res.ok) {
    throw new Error(`landings api /import-custom failed: ${res.status}`);
  }
  return importCustomPageResponseSchema.parse(await res.json());
}

export async function reuploadCustomPage(
  id: string,
  input: ImportCustomPageInput
): Promise<ImportCustomPageResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${id}/reupload-custom`,
    { method: "POST", credentials: "include", body: toFormData(input) }
  );
  if (!res.ok) {
    throw new Error(`landings api /reupload-custom failed: ${res.status}`);
  }
  return importCustomPageResponseSchema.parse(await res.json());
}

export async function fetchCustomPageBundle(
  id: string
): Promise<CustomPageBundle> {
  const res = await landingsFetch(`/${id}/custom-import`);
  return customPageBundleSchema.parse(await res.json());
}

export async function fetchCustomHtml(id: string): Promise<string> {
  const res = await landingsFetch(`/${id}/custom-html`);
  return res.text();
}

export async function wireLeadForm(
  id: string,
  input: WireLeadFormInput
): Promise<PageVersion> {
  const res = await landingsFetch(`/${id}/wire-lead-form`, {
    method: "POST",
    body: JSON.stringify(input)
  });
  return pageVersionSchema.parse(await res.json());
}

export async function fetchLatestCustomAudit(
  id: string
): Promise<AuditResult | null> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/landings/${id}/custom-audit`,
    { credentials: "include" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`custom-audit api failed: ${res.status}`);
  return auditResultSchema.parse(await res.json());
}

export async function runCustomAudit(id: string): Promise<AuditResult> {
  const res = await landingsFetch(`/${id}/custom-audit`, { method: "POST" });
  return auditResultSchema.parse(await res.json());
}

/** `page-system/custom-import.md` §Editing "Comment mode + AI chat" — dry run, doesn't persist. */
export async function proposeCustomChatEdits(
  id: string,
  message: string
): Promise<CustomChatProposeResult> {
  const res = await landingsFetch(`/${id}/custom-chat`, {
    method: "POST",
    body: JSON.stringify({ message })
  });
  return customChatProposeResultSchema.parse(await res.json());
}

export async function applyCustomChatEdits(
  id: string,
  edits: CustomChatEdit[]
): Promise<CustomChatApplyResult> {
  const res = await landingsFetch(`/${id}/custom-chat/apply`, {
    method: "POST",
    body: JSON.stringify({ edits })
  });
  return customChatApplyResultSchema.parse(await res.json());
}

/** `page-system/custom-import.md` §Editing "Convert sang native" — 1-way. */
export async function convertToNative(
  id: string
): Promise<ConvertToNativeResult> {
  const res = await landingsFetch(`/${id}/convert-to-native`, {
    method: "POST"
  });
  return convertToNativeResultSchema.parse(await res.json());
}
