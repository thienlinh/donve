import { Input } from "@dv/ui/components/shadcn/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@dv/ui/components/shadcn/tabs";
import { Textarea } from "@dv/ui/components/shadcn/textarea";
import * as React from "react";

import * as m from "@/paraglide/messages.js";

import type { ImportCustomPageInput } from "../api";

export type ImportMode = "html" | "url" | "file";

/** Maps the API's stable error `code` (`apps/api/src/lib/import-zip.ts`,
 * `.../routes/custom-import.routes.ts`) to a Vietnamese message a non-technical user can act
 * on — shared by both the create dialog and the re-upload dialog, since both hit the same
 * import endpoint shape. Any code not listed here falls back to the raw `error.message`. */
export const IMPORT_ERROR_MESSAGES: Record<string, string> = {
  zip_too_large:
    "Tệp .zip quá lớn sau khi giải nén (giới hạn khoảng 100MB). Hãy giảm dung lượng ảnh/video rồi thử lại.",
  import_html_invalid:
    "Không đọc được nội dung HTML này. Kiểm tra lại mã HTML hoặc đường dẫn rồi thử lại."
};

/** Shared html/url/file tab state behind both the create dialog (`CustomImportDialog`) and
 * the reupload dialog (`ReuploadCustomDialog`) — same 3 source modes, same `ImportCustomPageInput`
 * shape, only the submit target (create vs. reupload) differs between callers. */
export function useImportSourceForm() {
  const [mode, setMode] = React.useState<ImportMode>("html");
  const [html, setHtml] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  function reset() {
    setMode("html");
    setHtml("");
    setUrl("");
    setFile(null);
  }

  const canSubmit =
    mode === "html"
      ? html.trim() !== ""
      : mode === "url"
        ? url.trim() !== ""
        : file !== null;

  function toInput(name?: string): ImportCustomPageInput | null {
    const base = { name: name?.trim() || undefined };
    if (mode === "html") return html.trim() ? { ...base, mode, html } : null;
    if (mode === "url") return url.trim() ? { ...base, mode, url } : null;
    return file ? { ...base, mode, file } : null;
  }

  return {
    mode,
    setMode,
    html,
    setHtml,
    url,
    setUrl,
    file,
    setFile,
    reset,
    canSubmit,
    toInput
  };
}

export function ImportSourceFields({
  form
}: {
  form: ReturnType<typeof useImportSourceForm>;
}) {
  return (
    <Tabs
      value={form.mode}
      onValueChange={(v) => v && form.setMode(v as ImportMode)}
    >
      <TabsList>
        <TabsTrigger value="html">{m.landingsImportTabHtml()}</TabsTrigger>
        <TabsTrigger value="url">{m.landingsImportTabUrl()}</TabsTrigger>
        <TabsTrigger value="file">{m.landingsImportTabFile()}</TabsTrigger>
      </TabsList>
      <TabsContent value="html">
        <Textarea
          rows={8}
          value={form.html}
          onChange={(e) => form.setHtml(e.target.value)}
          placeholder={m.landingsImportHtmlPlaceholder()}
        />
      </TabsContent>
      <TabsContent value="url">
        <Input
          value={form.url}
          onChange={(e) => form.setUrl(e.target.value)}
          placeholder={m.landingsImportUrlPlaceholder()}
        />
      </TabsContent>
      <TabsContent value="file">
        <div className="flex flex-col gap-1.5">
          <Input
            type="file"
            accept=".html,.zip"
            onChange={(e) => form.setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            Chọn 1 tệp .html, hoặc 1 tệp .zip chứa toàn bộ trang (HTML +
            ảnh/CSS/JS đi kèm). Dung lượng tối đa khoảng 100MB sau khi giải nén.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
