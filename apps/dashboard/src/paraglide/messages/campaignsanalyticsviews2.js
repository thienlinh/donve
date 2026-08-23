/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticsviews2Inputs */

const vi_campaignsanalyticsviews2 =
  /** @type {(inputs: Campaignsanalyticsviews2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lượt xem`;
  };

const en_campaignsanalyticsviews2 =
  /** @type {(inputs: Campaignsanalyticsviews2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Views`;
  };

/**
 * | output |
 * | --- |
 * | "Views" |
 *
 * @param {Campaignsanalyticsviews2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticsviews2 =
  /** @type {((inputs?: Campaignsanalyticsviews2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticsviews2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticsviews2(inputs);
      return vi_campaignsanalyticsviews2(inputs);
    }
  );
export { campaignsanalyticsviews2 as "campaignsAnalyticsViews" };
