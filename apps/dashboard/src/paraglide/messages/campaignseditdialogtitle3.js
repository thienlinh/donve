/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignseditdialogtitle3Inputs */

const vi_campaignseditdialogtitle3 =
  /** @type {(inputs: Campaignseditdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sửa chiến dịch`;
  };

const en_campaignseditdialogtitle3 =
  /** @type {(inputs: Campaignseditdialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Edit campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Edit campaign" |
 *
 * @param {Campaignseditdialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignseditdialogtitle3 =
  /** @type {((inputs?: Campaignseditdialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignseditdialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignseditdialogtitle3(inputs);
      return vi_campaignseditdialogtitle3(inputs);
    }
  );
export { campaignseditdialogtitle3 as "campaignsEditDialogTitle" };
