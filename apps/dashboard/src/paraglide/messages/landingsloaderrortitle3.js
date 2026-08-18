/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsloaderrortitle3Inputs */

const vi_landingsloaderrortitle3 =
  /** @type {(inputs: Landingsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách landing`;
  };

const en_landingsloaderrortitle3 =
  /** @type {(inputs: Landingsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load landing pages`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load landing pages" |
 *
 * @param {Landingsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsloaderrortitle3 =
  /** @type {((inputs?: Landingsloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsloaderrortitle3(inputs);
      return vi_landingsloaderrortitle3(inputs);
    }
  );
export { landingsloaderrortitle3 as "landingsLoadErrorTitle" };
