/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productstypeproduct2Inputs */

const vi_productstypeproduct2 =
  /** @type {(inputs: Productstypeproduct2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm`;
  };

const en_productstypeproduct2 =
  /** @type {(inputs: Productstypeproduct2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Product`;
  };

/**
 * | output |
 * | --- |
 * | "Product" |
 *
 * @param {Productstypeproduct2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productstypeproduct2 =
  /** @type {((inputs?: Productstypeproduct2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productstypeproduct2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productstypeproduct2(inputs);
      return vi_productstypeproduct2(inputs);
    }
  );
export { productstypeproduct2 as "productsTypeProduct" };
