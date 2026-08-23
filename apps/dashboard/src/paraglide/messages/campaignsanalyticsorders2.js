/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticsorders2Inputs */

const vi_campaignsanalyticsorders2 =
  /** @type {(inputs: Campaignsanalyticsorders2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đơn hàng`;
  };

const en_campaignsanalyticsorders2 =
  /** @type {(inputs: Campaignsanalyticsorders2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Orders`;
  };

/**
 * | output |
 * | --- |
 * | "Orders" |
 *
 * @param {Campaignsanalyticsorders2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticsorders2 =
  /** @type {((inputs?: Campaignsanalyticsorders2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticsorders2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticsorders2(inputs);
      return vi_campaignsanalyticsorders2(inputs);
    }
  );
export { campaignsanalyticsorders2 as "campaignsAnalyticsOrders" };
