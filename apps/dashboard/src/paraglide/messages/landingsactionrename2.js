/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsactionrename2Inputs */

const vi_landingsactionrename2 =
  /** @type {(inputs: Landingsactionrename2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đổi tên`;
  };

const en_landingsactionrename2 =
  /** @type {(inputs: Landingsactionrename2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rename`;
  };

/**
 * | output |
 * | --- |
 * | "Rename" |
 *
 * @param {Landingsactionrename2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsactionrename2 =
  /** @type {((inputs?: Landingsactionrename2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsactionrename2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsactionrename2(inputs);
      return vi_landingsactionrename2(inputs);
    }
  );
export { landingsactionrename2 as "landingsActionRename" };
