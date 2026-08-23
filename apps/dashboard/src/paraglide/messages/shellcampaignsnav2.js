/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellcampaignsnav2Inputs */

const vi_shellcampaignsnav2 =
  /** @type {(inputs: Shellcampaignsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chiến dịch`;
  };

const en_shellcampaignsnav2 =
  /** @type {(inputs: Shellcampaignsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Campaigns`;
  };

/**
 * | output |
 * | --- |
 * | "Campaigns" |
 *
 * @param {Shellcampaignsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellcampaignsnav2 =
  /** @type {((inputs?: Shellcampaignsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellcampaignsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellcampaignsnav2(inputs);
      return vi_shellcampaignsnav2(inputs);
    }
  );
export { shellcampaignsnav2 as "shellCampaignsNav" };
