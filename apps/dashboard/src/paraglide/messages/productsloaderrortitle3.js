/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsloaderrortitle3Inputs */

const vi_productsloaderrortitle3 =
  /** @type {(inputs: Productsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách sản phẩm`;
  };

const en_productsloaderrortitle3 =
  /** @type {(inputs: Productsloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load products`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load products" |
 *
 * @param {Productsloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsloaderrortitle3 =
  /** @type {((inputs?: Productsloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsloaderrortitle3(inputs);
      return vi_productsloaderrortitle3(inputs);
    }
  );
export { productsloaderrortitle3 as "productsLoadErrorTitle" };
