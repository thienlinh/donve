/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticsloaderrortitle4Inputs */

const vi_campaignsanalyticsloaderrortitle4 =
  /** @type {(inputs: Campaignsanalyticsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được số liệu`;
  };

const en_campaignsanalyticsloaderrortitle4 =
  /** @type {(inputs: Campaignsanalyticsloaderrortitle4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load analytics`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load analytics" |
 *
 * @param {Campaignsanalyticsloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticsloaderrortitle4 =
  /** @type {((inputs?: Campaignsanalyticsloaderrortitle4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticsloaderrortitle4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticsloaderrortitle4(inputs);
      return vi_campaignsanalyticsloaderrortitle4(inputs);
    }
  );
export { campaignsanalyticsloaderrortitle4 as "campaignsAnalyticsLoadErrorTitle" };
