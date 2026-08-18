/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsfilterall2Inputs */

const vi_landingsfilterall2 =
  /** @type {(inputs: Landingsfilterall2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tất cả`;
  };

const en_landingsfilterall2 =
  /** @type {(inputs: Landingsfilterall2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `All`;
  };

/**
 * | output |
 * | --- |
 * | "All" |
 *
 * @param {Landingsfilterall2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsfilterall2 =
  /** @type {((inputs?: Landingsfilterall2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsfilterall2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsfilterall2(inputs);
      return vi_landingsfilterall2(inputs);
    }
  );
export { landingsfilterall2 as "landingsFilterAll" };
