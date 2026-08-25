import type { CatalogComponentSummary } from "./page-architect-prompt.js";

/**
 * Custom Import's "convert sang native" (`page-system/custom-import.md` §Editing) — 1-way,
 * classifies each raw HTML section against the real catalog; anything that doesn't match
 * confidently becomes `raw_html_block` (`packages/studio-catalog/src/components/
 * raw-html-block.tsx`) rather than being lost or forced into a bad fit. 2 phases, same reason
 * as Page Architect/Content Agent's own split: classification (structural, needs the whole
 * page's context) and content extraction (narrow, 1 section at a time, safe to run in
 * parallel) are different jobs.
 */
export interface SectionToClassify {
  index: number;
  html: string;
}

export interface CompileClassifySectionsPromptInput {
  catalog: CatalogComponentSummary[];
  sections: SectionToClassify[];
}

const CLASSIFY_SYSTEM_PROMPT = `Chuyên gia phân loại nội dung landing page thô thành component có sẵn trong catalog. Với mỗi section HTML thô được cung cấp, chọn ĐÚNG 1 componentId+variant khớp gần nhất về mục đích và cấu trúc nội dung. Chỉ chọn khi thực sự tự tin — nếu section không khớp component nào đủ tốt (nội dung quá tuỳ biến, layout lạ, hoặc là script/style/embed đặc thù), trả componentId: null để giữ nguyên bản gốc.

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "sections": [
    { "index": number, "componentId": string|null, "variant": string|null, "reason": string }
  ]
}
Đủ 1 phần tử cho MỖI section được cung cấp, theo đúng "index".`;

function formatCatalog(catalog: CatalogComponentSummary[]): string {
  return catalog
    .map(
      (c) =>
        `- ${c.componentId} [${c.category}] variants: ${c.variants.join(", ") || "(không variant)"} — ${c.description}`
    )
    .join("\n");
}

function formatSections(sections: SectionToClassify[]): string {
  return sections
    .map((s) => `--- Section ${s.index} ---\n${s.html}`)
    .join("\n\n");
}

export function compileClassifySectionsPrompt(
  input: CompileClassifySectionsPromptInput
): string {
  return [
    CLASSIFY_SYSTEM_PROMPT,
    "",
    "--- Component catalog ---",
    formatCatalog(input.catalog),
    "",
    "--- Sections (HTML thô) ---",
    formatSections(input.sections)
  ].join("\n");
}

export interface CompileExtractContentPromptInput {
  componentId: string;
  variant: string;
  sectionHtml: string;
  propsJsonSchema: unknown;
}

const EXTRACT_SYSTEM_PROMPT = `Trích xuất nội dung từ 1 đoạn HTML thô vào đúng field của 1 component. Chỉ dùng nội dung thực sự có trong HTML được cung cấp (text, href, src, alt) — không bịa thêm. Field nào HTML không có thông tin thì viết giá trị hợp lý ngắn gọn dựa trên phần còn lại của section, không để trống nếu field đó là bắt buộc.

Trả về DUY NHẤT 1 JSON object khớp CHÍNH XÁC "JSON schema" bên dưới — không kèm markdown fence, không giải thích thêm, không thêm field ngoài schema.`;

export function compileExtractContentPrompt(
  input: CompileExtractContentPromptInput
): string {
  return [
    EXTRACT_SYSTEM_PROMPT,
    "",
    `--- Component: ${input.componentId} (variant: ${input.variant}) ---`,
    "--- JSON schema (props) ---",
    JSON.stringify(input.propsJsonSchema),
    "",
    "--- HTML thô cần trích xuất ---",
    input.sectionHtml
  ].join("\n");
}
