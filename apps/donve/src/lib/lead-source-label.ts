import * as m from "@/paraglide/messages.js";

/**
 * Human label for the fixed `LeadSource` enum (`@dv/contracts` crm.ts) — used wherever a
 * lead/order's `source` falls back to this enum instead of a free-form UTM tag (leads table,
 * Today's "Nguồn tạo đơn", order desk). An unrecognized value (schema drift, a source added
 * server-side before its label shipped here) falls back to the raw string rather than hiding it.
 */
const LEAD_SOURCE_LABELS: Record<string, () => string> = {
  landing_page: m.leadSourceLandingPage,
  facebook: m.leadSourceFacebook,
  zalo_oa: m.leadSourceZaloOa,
  manual: m.leadSourceManual,
  csv_import: m.leadSourceCsvImport,
  generic: m.leadSourceGeneric,
  google_ads: m.leadSourceGoogleAds,
  tiktok: m.leadSourceTiktok,
  direct: m.leadSourceDirect
};

export function leadSourceLabel(source: string | null | undefined): string {
  if (!source) return m.leadSourceDirect();
  return (LEAD_SOURCE_LABELS[source] ?? (() => source))();
}
