/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscolumnprice2Inputs */

const vi_productscolumnprice2 =
  /** @type {(inputs: Productscolumnprice2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Giá`;
  };

const en_productscolumnprice2 =
  /** @type {(inputs: Productscolumnprice2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Price`;
  };

/**
 * | output |
 * | --- |
 * | "Price" |
 *
 * @param {Productscolumnprice2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscolumnprice2 =
  /** @type {((inputs?: Productscolumnprice2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscolumnprice2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscolumnprice2(inputs);
      return vi_productscolumnprice2(inputs);
    }
  );
export { productscolumnprice2 as "productsColumnPrice" };
