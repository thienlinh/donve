export const purposeValues = [
  "understanding",
  "desire",
  "proof",
  "risk_reduction",
  "action"
] as const;
export type Purpose = (typeof purposeValues)[number];

/**
 * Platform-level bookkeeping per component — distinct from json-render's own `Catalog`
 * (which only needs props/slots/description for AI prompting). Mirrors `componentRegistry`
 * in `technical/architecture-and-data-model.md`.
 */
export interface ComponentMeta {
  componentId: string;
  category: string;
  variants: readonly string[];
  purpose: readonly Purpose[];
  trackingEvents: readonly string[];
  /** Prop paths (dot notation) requiring `humanApproved` before a patch may write them. */
  sensitiveProps: readonly string[];
}
