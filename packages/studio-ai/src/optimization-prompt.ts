/**
 * Optimization Agent (`ai/agent-pipeline.md` §Agent roles: "Input: Analytics + Quality history.
 * Output: Ranked hypothesis, không tự publish"). Never proposes a patch itself — a hypothesis
 * is just a ranked, evidence-cited suggestion a human reviews (`PATCH
 * /:id/optimization/:hypothesisId`), separate from the Auto Fixer's actual patches.
 */
export interface OptimizationEventCount {
  type: string;
  count: number;
}

export interface OptimizationAuditHistoryEntry {
  createdAt: string;
  overallScore: number;
  categoryScores: Record<string, number>;
}

export interface CompileOptimizationPromptInput {
  lookbackDays: number;
  eventCounts: OptimizationEventCount[];
  auditHistory: OptimizationAuditHistoryEntry[];
}

const OPTIMIZATION_SYSTEM_PROMPT = `Chuyên gia tối ưu hoá conversion rate. Đọc dữ liệu analytics thật và lịch sử audit chất lượng của 1 landing page, đề xuất tối đa 3 hypothesis cải thiện conversion, xếp hạng theo mức độ tin cậy của bằng chứng. Mỗi hypothesis PHẢI trích dẫn cụ thể con số/finding làm căn cứ (evidenceRefs) — không đề xuất chung chung kiểu "cải thiện UX". Không tự publish, không tự sửa trang — chỉ đề xuất.

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "hypotheses": [
    { "hypothesis": string, "rationale": string, "evidenceRefs": string[], "expectedImpact": string }
  ]
}`;

function formatEventCounts(counts: OptimizationEventCount[]): string {
  if (counts.length === 0) return "(không có event nào)";
  return counts.map((c) => `${c.type}: ${c.count}`).join(", ");
}

function formatAuditHistory(history: OptimizationAuditHistoryEntry[]): string {
  if (history.length === 0) return "(chưa có audit run nào)";
  return history
    .map(
      (run) =>
        `${run.createdAt} — overall ${run.overallScore}, category: ${JSON.stringify(run.categoryScores)}`
    )
    .join("\n");
}

export function compileOptimizationPrompt(
  input: CompileOptimizationPromptInput
): string {
  return [
    OPTIMIZATION_SYSTEM_PROMPT,
    "",
    `--- Analytics (${input.lookbackDays} ngày gần nhất, đếm theo event type) ---`,
    formatEventCounts(input.eventCounts),
    "",
    "--- Lịch sử Quality audit (mới nhất trước) ---",
    formatAuditHistory(input.auditHistory)
  ].join("\n");
}
