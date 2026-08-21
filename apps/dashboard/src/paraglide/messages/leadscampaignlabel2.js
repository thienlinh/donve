/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadscampaignlabel2Inputs */

const vi_leadscampaignlabel2 =
  /** @type {(inputs: Leadscampaignlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chiến dịch`;
  };

const en_leadscampaignlabel2 =
  /** @type {(inputs: Leadscampaignlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Campaign" |
 *
 * @param {Leadscampaignlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadscampaignlabel2 =
  /** @type {((inputs?: Leadscampaignlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadscampaignlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadscampaignlabel2(inputs);
      return vi_leadscampaignlabel2(inputs);
    }
  );
export { leadscampaignlabel2 as "leadsCampaignLabel" };
