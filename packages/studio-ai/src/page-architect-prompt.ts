import type { StrategyBrief } from "@dv/contracts";

/**
 * Page Architect (`ai/agent-pipeline.md` §Prompt pack §Page Architect) — chooses component +
 * variant per section from a confirmed Strategy Brief, no props yet (Content Agent's job).
 * Catalog info is passed in as plain data (not imported from `@dv/studio-catalog`) so this
 * package stays decoupled from the React/JSX catalog package.
 */
export interface CatalogComponentSummary {
  componentId: string;
  category: string;
  purpose: readonly string[];
  variants: readonly string[];
  description: string;
}

export interface CompilePageArchitectPromptInput {
  strategyBrief: StrategyBrief;
  catalog: CatalogComponentSummary[];
}

const PAGE_ARCHITECT_SYSTEM_PROMPT = `Kiến trúc sư thông tin landing page. Chỉ chọn component phục vụ understanding/desire/proof/risk_reduction/action, từ catalog được cung cấp. Ưu tiên cấu trúc nhỏ nhất đạt mục tiêu chuyển đổi.

Với mỗi element trả về: purpose, componentId+variant, lý do chọn (reason).

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "sections": [
    { "componentId": string (PHẢI có trong catalog), "variant": string (PHẢI có trong variants của componentId đó), "purpose": "understanding"|"desire"|"proof"|"risk_reduction"|"action", "reason": string }
  ]
}

Quy tắc:
- Thứ tự sections = thứ tự hiển thị trên trang, theo default conversion sequence: Clarity → Relevance → Value → Proof → Objection handling → Offer → CTA.
- 1 "hero" luôn ở đầu, 1 "lead_form" hoặc "cta_banner" luôn ở cuối (action).
- Không lặp quá nhiều component cùng category liên tiếp.
- Không chọn componentId/variant ngoài catalog được cung cấp.`;

function formatCatalog(catalog: CatalogComponentSummary[]): string {
  return catalog
    .map(
      (c) =>
        `- ${c.componentId} [${c.category}, purpose: ${c.purpose.join("/")}] variants: ${c.variants.join(", ") || "(không variant)"} — ${c.description}`
    )
    .join("\n");
}

function formatStrategyBrief(brief: StrategyBrief): string {
  return [
    `Value proposition: ${brief.message.valueProposition ?? "(chưa có)"}`,
    `Core promise: ${brief.message.corePromise ?? "(chưa có)"}`,
    `ICP: ${brief.customer.icp ?? "(chưa có)"}`,
    `Pain points: ${brief.customer.painPoints.join(", ") || "(chưa có)"}`,
    `Objections: ${brief.customer.objections.join(", ") || "(chưa có)"}`,
    `Differentiators: ${brief.market.differentiators.join(", ") || "(chưa có)"}`,
    `Conversion goal: ${brief.funnel.conversionGoal ?? "(chưa có)"}`,
    `Core offer: ${brief.offer.coreOffer ?? "(chưa có)"}`,
    `Guarantee: ${brief.offer.guarantee ?? "(chưa có)"}`,
    `Primary CTA: ${brief.message.primaryCta ?? "(chưa có)"}`,
    `Supporting claims: ${brief.message.supportingClaims.map((c) => `${c.claim} (${c.evidenceRef})`).join("; ") || "(chưa có)"}`
  ].join("\n");
}

export function compilePageArchitectPrompt(
  input: CompilePageArchitectPromptInput
): string {
  return [
    PAGE_ARCHITECT_SYSTEM_PROMPT,
    "",
    "--- Component catalog ---",
    formatCatalog(input.catalog),
    "",
    "--- Strategy Brief ---",
    formatStrategyBrief(input.strategyBrief)
  ].join("\n");
}

/**
 * Auto Fixer's structure-finding branch (`ai/agent-pipeline.md` §Self-critique loop:
 * "finding cấu trúc → gọi lại propose_page_architecture (thêm/bớt element)"). Narrower than
 * `compilePageArchitectPrompt`: the page already exists, only sections covering the still-missing
 * purposes should come back — never a re-proposal of sections that already exist.
 */
export interface CompileArchitectureFixPromptInput {
  strategyBrief: StrategyBrief;
  catalog: CatalogComponentSummary[];
  existingComponentIds: string[];
  missingPurposes: string[];
}

const ARCHITECTURE_FIX_SYSTEM_PROMPT = `Kiến trúc sư thông tin landing page đang SỬA 1 trang đã tồn tại — không thiết kế lại từ đầu. Trang hiện đã có sẵn các component liệt kê bên dưới; CHỈ đề xuất section MỚI cần thêm vào cuối trang để trang có đủ section phục vụ những purpose còn thiếu. Không đề xuất lại component đã có.

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "sections": [
    { "componentId": string (PHẢI có trong catalog), "variant": string (PHẢI có trong variants của componentId đó), "purpose": "understanding"|"desire"|"proof"|"risk_reduction"|"action", "reason": string }
  ]
}

Mỗi purpose còn thiếu chỉ cần đúng 1 section mới giải quyết, không thêm section thừa.`;

export function compileArchitectureFixPrompt(
  input: CompileArchitectureFixPromptInput
): string {
  return [
    ARCHITECTURE_FIX_SYSTEM_PROMPT,
    "",
    "--- Component catalog ---",
    formatCatalog(input.catalog),
    "",
    `--- Component đã có sẵn trên trang --- \n${input.existingComponentIds.join(", ") || "(chưa có)"}`,
    "",
    `--- Purpose còn thiếu --- \n${input.missingPurposes.join(", ")}`,
    "",
    "--- Strategy Brief ---",
    formatStrategyBrief(input.strategyBrief)
  ].join("\n");
}
