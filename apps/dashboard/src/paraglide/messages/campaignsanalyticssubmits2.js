/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticssubmits2Inputs */

const vi_campaignsanalyticssubmits2 =
  /** @type {(inputs: Campaignsanalyticssubmits2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lượt đăng ký`;
  };

const en_campaignsanalyticssubmits2 =
  /** @type {(inputs: Campaignsanalyticssubmits2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Submits`;
  };

/**
 * | output |
 * | --- |
 * | "Submits" |
 *
 * @param {Campaignsanalyticssubmits2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticssubmits2 =
  /** @type {((inputs?: Campaignsanalyticssubmits2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticssubmits2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticssubmits2(inputs);
      return vi_campaignsanalyticssubmits2(inputs);
    }
  );
export { campaignsanalyticssubmits2 as "campaignsAnalyticsSubmits" };
