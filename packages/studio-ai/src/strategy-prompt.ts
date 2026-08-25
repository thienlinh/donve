import type { KnowledgeItem } from "@dv/contracts";

/**
 * Strategy Agent (`ai/agent-pipeline.md` §Prompt pack §Strategy Agent) — turns a confirmed-ish
 * Business Knowledge Graph into a structured Strategy Brief. Reuses the doc's own prompt
 * wording verbatim as the system instruction.
 */
export interface CompileStrategyPromptInput {
  product: KnowledgeItem[];
  customer: KnowledgeItem[];
  market: KnowledgeItem[];
}

const STRATEGY_SYSTEM_PROMPT = `Chuyên gia chiến lược chuyển đổi. Xây chiến lược từ bằng chứng business được cung cấp. Tách sự thật đã xác minh / suy luận hợp lý / điều chưa biết. Không bịa proof, khách hàng, số liệu, guarantee, market claim.

Trả về DUY NHẤT 1 JSON object, không kèm markdown fence, không giải thích thêm, đúng shape:
{
  "business": { "product"?, "category"?, "businessModel"?, "pricingModel"?, "marginNotes"?, "geoScope"? } (mọi field: string),
  "customer": { "icp"?, "buyerRole"?, "userRole"?, "awarenessLevel"?: string, "jobsToBeDone", "painPoints", "desiredOutcomes", "objections", "triggers": string[] },
  "market": { "categoryLanguage"?: string, "alternatives", "competitors", "differentiators": string[], "proofAvailability"?: string },
  "funnel": { "trafficSource"?, "awarenessStage"?, "intentLevel"?, "conversionGoal"?, "conversionWindow"?, "qualificationRules"?: string },
  "offer": { "coreOffer"?: string, "bonuses": string[], "guarantee"?, "pricing"?, "urgencyPolicy"?, "riskReversal"?: string },
  "message": {
    "valueProposition"?: string, "corePromise"?: string,
    "supportingClaims": [{ "claim": string, "evidenceRef": string }] (3-5 claims, MỖI claim PHẢI trỏ evidenceRef vào 1 finding "fact" có sẵn — không tạo claim nếu không có fact hỗ trợ),
    "objectionHandling": string[], "primaryCta"?, "secondaryCta"?: string
  }
}

Field không có đủ căn cứ thì bỏ trống (undefined) — không suy đoán liều lĩnh, đặc biệt "guarantee"/"pricing"/số liệu.`;

function formatItems(items: KnowledgeItem[]): string {
  return items
    .map((item) => `- [${item.status}] ${item.label}: ${item.value}`)
    .join("\n");
}

export function compileStrategyPrompt(
  input: CompileStrategyPromptInput
): string {
  return [
    STRATEGY_SYSTEM_PROMPT,
    "",
    "--- Product ---",
    formatItems(input.product),
    "",
    "--- Customer ---",
    formatItems(input.customer),
    "",
    "--- Market ---",
    formatItems(input.market)
  ].join("\n");
}
