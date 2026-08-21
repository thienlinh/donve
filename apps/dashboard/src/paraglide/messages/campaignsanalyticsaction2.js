/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticsaction2Inputs */

const vi_campaignsanalyticsaction2 =
  /** @type {(inputs: Campaignsanalyticsaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xem số liệu`;
  };

const en_campaignsanalyticsaction2 =
  /** @type {(inputs: Campaignsanalyticsaction2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `View analytics`;
  };

/**
 * | output |
 * | --- |
 * | "View analytics" |
 *
 * @param {Campaignsanalyticsaction2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticsaction2 =
  /** @type {((inputs?: Campaignsanalyticsaction2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticsaction2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticsaction2(inputs);
      return vi_campaignsanalyticsaction2(inputs);
    }
  );
export { campaignsanalyticsaction2 as "campaignsAnalyticsAction" };
