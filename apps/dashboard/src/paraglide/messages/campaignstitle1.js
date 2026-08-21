/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignstitle1Inputs */

const vi_campaignstitle1 =
  /** @type {(inputs: Campaignstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chiến dịch`;
  };

const en_campaignstitle1 =
  /** @type {(inputs: Campaignstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Campaigns`;
  };

/**
 * | output |
 * | --- |
 * | "Campaigns" |
 *
 * @param {Campaignstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignstitle1 =
  /** @type {((inputs?: Campaignstitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignstitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignstitle1(inputs);
      return vi_campaignstitle1(inputs);
    }
  );
export { campaignstitle1 as "campaignsTitle" };
