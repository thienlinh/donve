import type { StrategyBrief } from "@dv/contracts";

/**
 * Content Agent (`ai/agent-pipeline.md` §Prompt pack, §Agent roles: "Input: 1 element + Strategy
 * Brief. Output: props khớp Zod schema của component đó"). Runs once per element, in parallel
 * (`Promise.all` at the call site) — task scope is narrow enough for a small/fast model.
 */
export interface CompileContentAgentPromptInput {
  componentId: string;
  variant: string;
  purpose: string;
  reason: string;
  strategyBrief: StrategyBrief;
  /** `catalog.data.components[componentId].props.toJSONSchema()` — the exact schema `apply_schema_patch`
   * validates against, so the model can't drift from what will actually be accepted. */
  propsJsonSchema: unknown;
  /** Set only when Auto Fixer is re-running this element after a Quality Critic finding
   * (`ai/agent-pipeline.md` §Self-critique loop) — the finding's own message, so the retry
   * targets exactly that problem instead of regenerating blind. */
  fixGuidance?: string;
}

const CONTENT_AGENT_SYSTEM_PROMPT = `Bạn điền nội dung cho đúng 1 component landing page. Chỉ dùng thông tin có trong Strategy Brief được cung cấp — không bịa số liệu, khách hàng, giá, guarantee, market claim. Field nào Strategy Brief không có căn cứ thì viết chung chung dựa trên value proposition, không bịa cụ thể.

Trả về DUY NHẤT 1 JSON object khớp CHÍNH XÁC "JSON schema" bên dưới (đúng field, đúng type, đúng enum "variant") — không kèm markdown fence, không giải thích thêm, không thêm field ngoài schema.`;

/** Also used by `spec-chat-prompt.ts` — same brief, same wording, one copy. */
export function formatStrategyBrief(brief: StrategyBrief): string {
  return [
    `Value proposition: ${brief.message.valueProposition ?? "(chưa có)"}`,
    `Core promise: ${brief.message.corePromise ?? "(chưa có)"}`,
    `ICP: ${brief.customer.icp ?? "(chưa có)"}`,
    `Pain points: ${brief.customer.painPoints.join(", ") || "(chưa có)"}`,
    `Desired outcomes: ${brief.customer.desiredOutcomes.join(", ") || "(chưa có)"}`,
    `Objections: ${brief.customer.objections.join(", ") || "(chưa có)"}`,
    `Differentiators: ${brief.market.differentiators.join(", ") || "(chưa có)"}`,
    `Competitors: ${brief.market.competitors.join(", ") || "(chưa có)"}`,
    `Core offer: ${brief.offer.coreOffer ?? "(chưa có)"}`,
    `Guarantee: ${brief.offer.guarantee ?? "(chưa có)"}`,
    `Pricing: ${brief.offer.pricing ?? "(chưa có)"}`,
    `Primary CTA: ${brief.message.primaryCta ?? "(chưa có)"}`,
    `Secondary CTA: ${brief.message.secondaryCta ?? "(chưa có)"}`,
    `Supporting claims (dùng evidenceRef này nếu component cần claim/proof): ${brief.message.supportingClaims.map((c) => `"${c.claim}" [evidenceRef: ${c.evidenceRef}]`).join("; ") || "(chưa có)"}`,
    `Objection handling: ${brief.message.objectionHandling.join(", ") || "(chưa có)"}`
  ].join("\n");
}

export function compileContentAgentPrompt(
  input: CompileContentAgentPromptInput
): string {
  return [
    CONTENT_AGENT_SYSTEM_PROMPT,
    "",
    `--- Component: ${input.componentId} (variant: ${input.variant}, purpose: ${input.purpose}) ---`,
    `Lý do Page Architect chọn component này: ${input.reason}`,
    "",
    "--- JSON schema (props) ---",
    JSON.stringify(input.propsJsonSchema),
    "",
    "--- Strategy Brief ---",
    formatStrategyBrief(input.strategyBrief),
    ...(input.fixGuidance
      ? [
          "",
          "--- Feedback cần sửa (từ Quality Critic, ưu tiên giải quyết đúng vấn đề này) ---",
          input.fixGuidance
        ]
      : [])
  ].join("\n");
}
