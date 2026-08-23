/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscolumntype2Inputs */

const vi_productscolumntype2 =
  /** @type {(inputs: Productscolumntype2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Loại`;
  };

const en_productscolumntype2 =
  /** @type {(inputs: Productscolumntype2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Type`;
  };

/**
 * | output |
 * | --- |
 * | "Type" |
 *
 * @param {Productscolumntype2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscolumntype2 =
  /** @type {((inputs?: Productscolumntype2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscolumntype2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscolumntype2(inputs);
      return vi_productscolumntype2(inputs);
    }
  );
export { productscolumntype2 as "productsColumnType" };
