/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhooknocampaignsempty4Inputs */

const vi_leadswebhooknocampaignsempty4 =
  /** @type {(inputs: Leadswebhooknocampaignsempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có chiến dịch nào — tạo 1 chiến dịch trước, rồi quay lại đây lấy URL webhook.`;
  };

const en_leadswebhooknocampaignsempty4 =
  /** @type {(inputs: Leadswebhooknocampaignsempty4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No campaigns yet — create one first, then come back here for its webhook URL.`;
  };

/**
 * | output |
 * | --- |
 * | "No campaigns yet — create one first, then come back here for its webhook URL." |
 *
 * @param {Leadswebhooknocampaignsempty4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhooknocampaignsempty4 =
  /** @type {((inputs?: Leadswebhooknocampaignsempty4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhooknocampaignsempty4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhooknocampaignsempty4(inputs);
      return vi_leadswebhooknocampaignsempty4(inputs);
    }
  );
export { leadswebhooknocampaignsempty4 as "leadsWebhookNoCampaignsEmpty" };
