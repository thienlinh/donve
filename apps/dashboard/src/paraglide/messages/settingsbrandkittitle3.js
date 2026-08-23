/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsbrandkittitle3Inputs */

const vi_settingsbrandkittitle3 =
  /** @type {(inputs: Settingsbrandkittitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bộ nhận diện thương hiệu`;
  };

const en_settingsbrandkittitle3 =
  /** @type {(inputs: Settingsbrandkittitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Brand kit`;
  };

/**
 * | output |
 * | --- |
 * | "Brand kit" |
 *
 * @param {Settingsbrandkittitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsbrandkittitle3 =
  /** @type {((inputs?: Settingsbrandkittitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsbrandkittitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsbrandkittitle3(inputs);
      return vi_settingsbrandkittitle3(inputs);
    }
  );
export { settingsbrandkittitle3 as "settingsBrandKitTitle" };
