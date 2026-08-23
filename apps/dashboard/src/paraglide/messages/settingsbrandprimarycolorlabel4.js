/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsbrandprimarycolorlabel4Inputs */

const vi_settingsbrandprimarycolorlabel4 =
  /** @type {(inputs: Settingsbrandprimarycolorlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Màu chính`;
  };

const en_settingsbrandprimarycolorlabel4 =
  /** @type {(inputs: Settingsbrandprimarycolorlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Primary color`;
  };

/**
 * | output |
 * | --- |
 * | "Primary color" |
 *
 * @param {Settingsbrandprimarycolorlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsbrandprimarycolorlabel4 =
  /** @type {((inputs?: Settingsbrandprimarycolorlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsbrandprimarycolorlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsbrandprimarycolorlabel4(inputs);
      return vi_settingsbrandprimarycolorlabel4(inputs);
    }
  );
export { settingsbrandprimarycolorlabel4 as "settingsBrandPrimaryColorLabel" };
