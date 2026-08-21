/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspopuppaidtitle3Inputs */

const vi_campaignspopuppaidtitle3 =
  /** @type {(inputs: Campaignspopuppaidtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sau khi thanh toán`;
  };

const en_campaignspopuppaidtitle3 =
  /** @type {(inputs: Campaignspopuppaidtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `After payment`;
  };

/**
 * | output |
 * | --- |
 * | "After payment" |
 *
 * @param {Campaignspopuppaidtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspopuppaidtitle3 =
  /** @type {((inputs?: Campaignspopuppaidtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspopuppaidtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspopuppaidtitle3(inputs);
      return vi_campaignspopuppaidtitle3(inputs);
    }
  );
export { campaignspopuppaidtitle3 as "campaignsPopupPaidTitle" };
