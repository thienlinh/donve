/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspopupssectiontitle3Inputs */

const vi_campaignspopupssectiontitle3 =
  /** @type {(inputs: Campaignspopupssectiontitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Popup`;
  };

const en_campaignspopupssectiontitle3 =
  /** @type {(inputs: Campaignspopupssectiontitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Popups`;
  };

/**
 * | output |
 * | --- |
 * | "Popups" |
 *
 * @param {Campaignspopupssectiontitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspopupssectiontitle3 =
  /** @type {((inputs?: Campaignspopupssectiontitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspopupssectiontitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspopupssectiontitle3(inputs);
      return vi_campaignspopupssectiontitle3(inputs);
    }
  );
export { campaignspopupssectiontitle3 as "campaignsPopupsSectionTitle" };
