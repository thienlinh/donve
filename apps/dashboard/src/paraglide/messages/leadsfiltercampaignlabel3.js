/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfiltercampaignlabel3Inputs */

const vi_leadsfiltercampaignlabel3 =
  /** @type {(inputs: Leadsfiltercampaignlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chiến dịch`;
  };

const en_leadsfiltercampaignlabel3 =
  /** @type {(inputs: Leadsfiltercampaignlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Campaign" |
 *
 * @param {Leadsfiltercampaignlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfiltercampaignlabel3 =
  /** @type {((inputs?: Leadsfiltercampaignlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfiltercampaignlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfiltercampaignlabel3(inputs);
      return vi_leadsfiltercampaignlabel3(inputs);
    }
  );
export { leadsfiltercampaignlabel3 as "leadsFilterCampaignLabel" };
