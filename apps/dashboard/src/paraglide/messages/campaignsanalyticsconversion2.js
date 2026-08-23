/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticsconversion2Inputs */

const vi_campaignsanalyticsconversion2 =
  /** @type {(inputs: Campaignsanalyticsconversion2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tỷ lệ chuyển đổi`;
  };

const en_campaignsanalyticsconversion2 =
  /** @type {(inputs: Campaignsanalyticsconversion2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Conversion`;
  };

/**
 * | output |
 * | --- |
 * | "Conversion" |
 *
 * @param {Campaignsanalyticsconversion2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticsconversion2 =
  /** @type {((inputs?: Campaignsanalyticsconversion2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticsconversion2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticsconversion2(inputs);
      return vi_campaignsanalyticsconversion2(inputs);
    }
  );
export { campaignsanalyticsconversion2 as "campaignsAnalyticsConversion" };
