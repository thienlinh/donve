/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsfilterallcampaigns3Inputs */

const vi_landingsfilterallcampaigns3 =
  /** @type {(inputs: Landingsfilterallcampaigns3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tất cả campaign`;
  };

const en_landingsfilterallcampaigns3 =
  /** @type {(inputs: Landingsfilterallcampaigns3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `All campaigns`;
  };

/**
 * | output |
 * | --- |
 * | "All campaigns" |
 *
 * @param {Landingsfilterallcampaigns3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsfilterallcampaigns3 =
  /** @type {((inputs?: Landingsfilterallcampaigns3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsfilterallcampaigns3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsfilterallcampaigns3(inputs);
      return vi_landingsfilterallcampaigns3(inputs);
    }
  );
export { landingsfilterallcampaigns3 as "landingsFilterAllCampaigns" };
