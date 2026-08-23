/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignspopuptitlelabel3Inputs */

const vi_campaignspopuptitlelabel3 =
  /** @type {(inputs: Campaignspopuptitlelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tiêu đề popup`;
  };

const en_campaignspopuptitlelabel3 =
  /** @type {(inputs: Campaignspopuptitlelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Popup title`;
  };

/**
 * | output |
 * | --- |
 * | "Popup title" |
 *
 * @param {Campaignspopuptitlelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignspopuptitlelabel3 =
  /** @type {((inputs?: Campaignspopuptitlelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignspopuptitlelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignspopuptitlelabel3(inputs);
      return vi_campaignspopuptitlelabel3(inputs);
    }
  );
export { campaignspopuptitlelabel3 as "campaignsPopupTitleLabel" };
