/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsloaderrortitle3Inputs */

const vi_campaignsloaderrortitle3 =
  /** @type {(inputs: Campaignsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách chiến dịch`;
  };

const en_campaignsloaderrortitle3 =
  /** @type {(inputs: Campaignsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load campaigns`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load campaigns" |
 *
 * @param {Campaignsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsloaderrortitle3 =
  /** @type {((inputs?: Campaignsloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsloaderrortitle3(inputs);
      return vi_campaignsloaderrortitle3(inputs);
    }
  );
export { campaignsloaderrortitle3 as "campaignsLoadErrorTitle" };
