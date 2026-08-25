/**
 * Research Agent (`ai/agent-pipeline.md` §Agent roles) — extracts a Business Knowledge Graph
 * from a business brief (+ optional source URLs, already fetched by the caller as plain text).
 * Independent of `prompt.ts`'s srcmap-editing prompt — this agent never touches HTML.
 */
export interface CompileResearchPromptInput {
  brief: string;
  /** `{ url, text }` pairs — the caller has already fetched/extracted these server-side. */
  sources?: { url: string; text: string }[];
}

const RESEARCH_SYSTEM_PROMPT = `Bạn là Research Agent cho nền tảng landing page. Nhiệm vụ: trích xuất Business Knowledge Graph từ business brief và tài liệu nguồn được cung cấp.

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "product": [{ "label": string, "value": string, "status": "fact"|"inference"|"unknown", "sourceRef"?: string }],
  "customer": [...],
  "market": [...]
}

Quy tắc bắt buộc:
- "fact": có trong brief/nguồn, PHẢI kèm "sourceRef" (URL hoặc "brief").
- "inference": suy luận hợp lý từ dữ liệu có, không bịa số liệu/tên khách hàng/giá cụ thể.
- "unknown": thông tin quan trọng nhưng brief không đề cập — value là câu hỏi cần hỏi thêm, không phải chuỗi rỗng.
- KHÔNG bịa fact. Nếu không chắc, hạ xuống "inference" hoặc "unknown".
- "product": category, features, benefits, differentiators, pricing, integrations.
- "customer": ICP, industry, job title, pain points, goals, objections, buying triggers.
- "market": competitors, alternatives, positioning hiện tại, category language.`;

export function compileResearchPrompt(
  input: CompileResearchPromptInput
): string {
  const sourcesBlock = (input.sources ?? [])
    .map((s) => `--- Nguồn: ${s.url} ---\n${s.text.slice(0, 4000)}`)
    .join("\n\n");

  return [
    RESEARCH_SYSTEM_PROMPT,
    "",
    "--- Business brief ---",
    input.brief,
    sourcesBlock ? `\n${sourcesBlock}` : ""
  ].join("\n");
}
