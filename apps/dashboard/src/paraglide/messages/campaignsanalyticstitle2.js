/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticstitle2Inputs */

const vi_campaignsanalyticstitle2 =
  /** @type {(inputs: Campaignsanalyticstitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số liệu chiến dịch`;
  };

const en_campaignsanalyticstitle2 =
  /** @type {(inputs: Campaignsanalyticstitle2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Campaign analytics`;
  };

/**
 * | output |
 * | --- |
 * | "Campaign analytics" |
 *
 * @param {Campaignsanalyticstitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticstitle2 =
  /** @type {((inputs?: Campaignsanalyticstitle2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticstitle2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticstitle2(inputs);
      return vi_campaignsanalyticstitle2(inputs);
    }
  );
export { campaignsanalyticstitle2 as "campaignsAnalyticsTitle" };
