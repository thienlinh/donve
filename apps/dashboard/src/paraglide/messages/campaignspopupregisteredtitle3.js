/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspopupregisteredtitle3Inputs */

const vi_campaignspopupregisteredtitle3 =
  /** @type {(inputs: Campaignspopupregisteredtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sau khi đăng ký`;
  };

const en_campaignspopupregisteredtitle3 =
  /** @type {(inputs: Campaignspopupregisteredtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `After registration`;
  };

/**
 * | output |
 * | --- |
 * | "After registration" |
 *
 * @param {Campaignspopupregisteredtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspopupregisteredtitle3 =
  /** @type {((inputs?: Campaignspopupregisteredtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspopupregisteredtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspopupregisteredtitle3(inputs);
      return vi_campaignspopupregisteredtitle3(inputs);
    }
  );
export { campaignspopupregisteredtitle3 as "campaignsPopupRegisteredTitle" };
