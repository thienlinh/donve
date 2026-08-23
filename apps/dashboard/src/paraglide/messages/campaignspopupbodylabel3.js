/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspopupbodylabel3Inputs */

const vi_campaignspopupbodylabel3 =
  /** @type {(inputs: Campaignspopupbodylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nội dung popup`;
  };

const en_campaignspopupbodylabel3 =
  /** @type {(inputs: Campaignspopupbodylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Popup body`;
  };

/**
 * | output |
 * | --- |
 * | "Popup body" |
 *
 * @param {Campaignspopupbodylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspopupbodylabel3 =
  /** @type {((inputs?: Campaignspopupbodylabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspopupbodylabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspopupbodylabel3(inputs);
      return vi_campaignspopupbodylabel3(inputs);
    }
  );
export { campaignspopupbodylabel3 as "campaignsPopupBodyLabel" };
