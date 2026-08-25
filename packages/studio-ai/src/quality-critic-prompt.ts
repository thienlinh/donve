import type { StrategyBrief } from "@dv/contracts";

/**
 * Quality Critic (`ai/agent-pipeline.md` §Prompt pack §Quality Critic) — the only LLM-judged
 * categories in the 3-tier quality system (`quality-spec.md` §Tầng 3): strategy_alignment and
 * messaging_copy. Everything else (structure/SEO/tracking/token/performance/visual) is
 * rule-based, computed server-side without a model call.
 */
export interface QualityCriticElement {
  elementId: string;
  componentId: string;
  props: Record<string, unknown>;
}

export interface CompileQualityCriticPromptInput {
  strategyBrief: StrategyBrief;
  elements: QualityCriticElement[];
}

const QUALITY_CRITIC_SYSTEM_PROMPT = `Người phản biện đối nghịch. Tìm mơ hồ, claim không bằng chứng, ma sát chuyển đổi, hierarchy yếu, proof yếu, vi phạm accessibility, lỗ hổng SEO. Mỗi finding trích dẫn đúng element id. Không hạ severity vì trang trông đẹp.

Chỉ đánh giá 2 khía cạnh:
- "strategy_alignment": nội dung có khớp Strategy Brief (ICP, positioning, value proposition) không.
- "messaging_copy": copy có rõ ràng, cụ thể, khác biệt, có proof cho từng claim không (anti-pattern: headline mơ hồ, claim "all-in-one" không kèm proof, testimonial không danh tính, urgency giả).

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "findings": [
    { "category": "strategy_alignment"|"messaging_copy", "severity": "critical"|"high"|"medium"|"low", "message": string, "elementId": string|null }
  ]
}
Nếu không có vấn đề gì, trả "findings": [].`;

function formatElements(elements: QualityCriticElement[]): string {
  return elements
    .map(
      (e) => `- ${e.elementId} (${e.componentId}): ${JSON.stringify(e.props)}`
    )
    .join("\n");
}

function formatStrategyBrief(brief: StrategyBrief): string {
  return [
    `Value proposition: ${brief.message.valueProposition ?? "(chưa có)"}`,
    `ICP: ${brief.customer.icp ?? "(chưa có)"}`,
    `Differentiators: ${brief.market.differentiators.join(", ") || "(chưa có)"}`,
    `Supporting claims hợp lệ: ${brief.message.supportingClaims.map((c) => `"${c.claim}" [${c.evidenceRef}]`).join("; ") || "(chưa có)"}`
  ].join("\n");
}

export function compileQualityCriticPrompt(
  input: CompileQualityCriticPromptInput
): string {
  return [
    QUALITY_CRITIC_SYSTEM_PROMPT,
    "",
    "--- Strategy Brief ---",
    formatStrategyBrief(input.strategyBrief),
    "",
    "--- Trang hiện tại (element id : props) ---",
    formatElements(input.elements)
  ].join("\n");
}
