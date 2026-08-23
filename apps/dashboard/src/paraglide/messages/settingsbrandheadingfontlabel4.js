/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsbrandheadingfontlabel4Inputs */

const vi_settingsbrandheadingfontlabel4 =
  /** @type {(inputs: Settingsbrandheadingfontlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Font tiêu đề`;
  };

const en_settingsbrandheadingfontlabel4 =
  /** @type {(inputs: Settingsbrandheadingfontlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Heading font`;
  };

/**
 * | output |
 * | --- |
 * | "Heading font" |
 *
 * @param {Settingsbrandheadingfontlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsbrandheadingfontlabel4 =
  /** @type {((inputs?: Settingsbrandheadingfontlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsbrandheadingfontlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsbrandheadingfontlabel4(inputs);
      return vi_settingsbrandheadingfontlabel4(inputs);
    }
  );
export { settingsbrandheadingfontlabel4 as "settingsBrandHeadingFontLabel" };
