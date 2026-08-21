/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsloaderrortitle3Inputs */

const vi_leadsloaderrortitle3 =
  /** @type {(inputs: Leadsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách lead`;
  };

const en_leadsloaderrortitle3 =
  /** @type {(inputs: Leadsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load leads`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load leads" |
 *
 * @param {Leadsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsloaderrortitle3 =
  /** @type {((inputs?: Leadsloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsloaderrortitle3(inputs);
      return vi_leadsloaderrortitle3(inputs);
    }
  );
export { leadsloaderrortitle3 as "leadsLoadErrorTitle" };
