/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticsrevenue2Inputs */

const vi_campaignsanalyticsrevenue2 =
  /** @type {(inputs: Campaignsanalyticsrevenue2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Doanh thu (VNĐ)`;
  };

const en_campaignsanalyticsrevenue2 =
  /** @type {(inputs: Campaignsanalyticsrevenue2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Revenue (VND)`;
  };

/**
 * | output |
 * | --- |
 * | "Revenue (VND)" |
 *
 * @param {Campaignsanalyticsrevenue2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticsrevenue2 =
  /** @type {((inputs?: Campaignsanalyticsrevenue2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticsrevenue2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticsrevenue2(inputs);
      return vi_campaignsanalyticsrevenue2(inputs);
    }
  );
export { campaignsanalyticsrevenue2 as "campaignsAnalyticsRevenue" };
