/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsbrandsecondarycolorlabel4Inputs */

const vi_settingsbrandsecondarycolorlabel4 =
  /** @type {(inputs: Settingsbrandsecondarycolorlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Màu phụ`;
  };

const en_settingsbrandsecondarycolorlabel4 =
  /** @type {(inputs: Settingsbrandsecondarycolorlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Secondary color`;
  };

/**
 * | output |
 * | --- |
 * | "Secondary color" |
 *
 * @param {Settingsbrandsecondarycolorlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsbrandsecondarycolorlabel4 =
  /** @type {((inputs?: Settingsbrandsecondarycolorlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsbrandsecondarycolorlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsbrandsecondarycolorlabel4(inputs);
      return vi_settingsbrandsecondarycolorlabel4(inputs);
    }
  );
export { settingsbrandsecondarycolorlabel4 as "settingsBrandSecondaryColorLabel" };
