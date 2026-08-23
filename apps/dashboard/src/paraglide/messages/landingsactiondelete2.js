/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Landingsactiondelete2Inputs */

const vi_landingsactiondelete2 =
  /** @type {(inputs: Landingsactiondelete2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá`;
  };

const en_landingsactiondelete2 =
  /** @type {(inputs: Landingsactiondelete2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete`;
  };

/**
 * | output |
 * | --- |
 * | "Delete" |
 *
 * @param {Landingsactiondelete2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const landingsactiondelete2 =
  /** @type {((inputs?: Landingsactiondelete2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Landingsactiondelete2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_landingsactiondelete2(inputs);
      return vi_landingsactiondelete2(inputs);
    }
  );
export { landingsactiondelete2 as "landingsActionDelete" };
