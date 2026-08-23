/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsadddialogtitle3Inputs */

const vi_campaignsadddialogtitle3 =
  /** @type {(inputs: Campaignsadddialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm chiến dịch`;
  };

const en_campaignsadddialogtitle3 =
  /** @type {(inputs: Campaignsadddialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add a campaign`;
  };

/**
 * | output |
 * | --- |
 * | "Add a campaign" |
 *
 * @param {Campaignsadddialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsadddialogtitle3 =
  /** @type {((inputs?: Campaignsadddialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsadddialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsadddialogtitle3(inputs);
      return vi_campaignsadddialogtitle3(inputs);
    }
  );
export { campaignsadddialogtitle3 as "campaignsAddDialogTitle" };
