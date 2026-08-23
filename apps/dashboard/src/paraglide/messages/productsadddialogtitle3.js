/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsadddialogtitle3Inputs */

const vi_productsadddialogtitle3 =
  /** @type {(inputs: Productsadddialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm sản phẩm`;
  };

const en_productsadddialogtitle3 =
  /** @type {(inputs: Productsadddialogtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add a product`;
  };

/**
 * | output |
 * | --- |
 * | "Add a product" |
 *
 * @param {Productsadddialogtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsadddialogtitle3 =
  /** @type {((inputs?: Productsadddialogtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsadddialogtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsadddialogtitle3(inputs);
      return vi_productsadddialogtitle3(inputs);
    }
  );
export { productsadddialogtitle3 as "productsAddDialogTitle" };
