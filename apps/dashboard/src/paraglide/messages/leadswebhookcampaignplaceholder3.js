/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookcampaignplaceholder3Inputs */

const vi_leadswebhookcampaignplaceholder3 =
  /** @type {(inputs: Leadswebhookcampaignplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chọn một chiến dịch`;
  };

const en_leadswebhookcampaignplaceholder3 =
  /** @type {(inputs: Leadswebhookcampaignplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Select a campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Select a campaign" |
 *
 * @param {Leadswebhookcampaignplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookcampaignplaceholder3 =
  /** @type {((inputs?: Leadswebhookcampaignplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookcampaignplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookcampaignplaceholder3(inputs);
      return vi_leadswebhookcampaignplaceholder3(inputs);
    }
  );
export { leadswebhookcampaignplaceholder3 as "leadsWebhookCampaignPlaceholder" };
