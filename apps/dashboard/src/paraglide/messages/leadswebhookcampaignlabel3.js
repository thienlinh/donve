/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadswebhookcampaignlabel3Inputs */

const vi_leadswebhookcampaignlabel3 =
  /** @type {(inputs: Leadswebhookcampaignlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chiến dịch`;
  };

const en_leadswebhookcampaignlabel3 =
  /** @type {(inputs: Leadswebhookcampaignlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Campaign" |
 *
 * @param {Leadswebhookcampaignlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadswebhookcampaignlabel3 =
  /** @type {((inputs?: Leadswebhookcampaignlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadswebhookcampaignlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadswebhookcampaignlabel3(inputs);
      return vi_leadswebhookcampaignlabel3(inputs);
    }
  );
export { leadswebhookcampaignlabel3 as "leadsWebhookCampaignLabel" };
