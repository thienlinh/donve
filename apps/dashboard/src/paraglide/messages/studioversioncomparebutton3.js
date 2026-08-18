/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioversioncomparebutton3Inputs */

const vi_studioversioncomparebutton3 =
  /** @type {(inputs: Studioversioncomparebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `So sánh đã chọn`;
  };

const en_studioversioncomparebutton3 =
  /** @type {(inputs: Studioversioncomparebutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Compare selected`;
  };

/**
 * | output |
 * | --- |
 * | "Compare selected" |
 *
 * @param {Studioversioncomparebutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioversioncomparebutton3 =
  /** @type {((inputs?: Studioversioncomparebutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioversioncomparebutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioversioncomparebutton3(inputs);
      return vi_studioversioncomparebutton3(inputs);
    }
  );
export { studioversioncomparebutton3 as "studioVersionCompareButton" };
