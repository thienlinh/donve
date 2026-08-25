/**
 * Custom Import's "comment mode + AI chat" (`page-system/custom-import.md` §Editing) —
 * "user chat 'sửa headline thành X' → AI đề xuất diff text-based trên HTML gốc → hiển thị diff
 * → approve → version mới." Modeled as a small set of exact search/replace string operations
 * rather than freeform regenerated HTML — `product/vision.md` principle #3 ("Mọi patch là thao
 * tác có kiểu trên schema — không thể tạo ra output hỏng") applies here too: a search/replace
 * op either matches the real HTML exactly (applied) or it doesn't (rejected), there's no way
 * for a hallucinated edit to corrupt the page the way a full HTML rewrite could.
 */
export interface CompileCustomImportChatPromptInput {
  html: string;
  message: string;
}

const CUSTOM_IMPORT_CHAT_SYSTEM_PROMPT = `Trợ lý sửa nội dung landing page thô theo yêu cầu người dùng. Bạn KHÔNG viết lại cả trang — chỉ đề xuất từng thay đổi nhỏ dưới dạng cặp "tìm/thay" chính xác nguyên văn trên HTML gốc được cung cấp. Mỗi "search" PHẢI là một chuỗi xuất hiện NGUYÊN VĂN, DUY NHẤT 1 lần trong HTML gốc (đủ ngữ cảnh xung quanh để không trùng chỗ khác) — nếu không tìm được đoạn nào khớp yêu cầu, đừng đề xuất edit đó.

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "summary": string,
  "edits": [
    { "search": string, "replace": string, "reason": string }
  ]
}
"edits" có thể rỗng nếu không xác định được thay đổi nào an toàn.`;

export function compileCustomImportChatPrompt(
  input: CompileCustomImportChatPromptInput
): string {
  return [
    CUSTOM_IMPORT_CHAT_SYSTEM_PROMPT,
    "",
    "--- HTML gốc hiện tại ---",
    input.html,
    "",
    "--- Yêu cầu người dùng ---",
    input.message
  ].join("\n");
}
