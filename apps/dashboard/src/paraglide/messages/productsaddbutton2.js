/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsaddbutton2Inputs */

const vi_productsaddbutton2 =
  /** @type {(inputs: Productsaddbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm sản phẩm`;
  };

const en_productsaddbutton2 =
  /** @type {(inputs: Productsaddbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add product`;
  };

/**
 * | output |
 * | --- |
 * | "Add product" |
 *
 * @param {Productsaddbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsaddbutton2 =
  /** @type {((inputs?: Productsaddbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsaddbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsaddbutton2(inputs);
      return vi_productsaddbutton2(inputs);
    }
  );
export { productsaddbutton2 as "productsAddButton" };
