/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Shellproductsnav2Inputs */

const vi_shellproductsnav2 =
  /** @type {(inputs: Shellproductsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm`;
  };

const en_shellproductsnav2 =
  /** @type {(inputs: Shellproductsnav2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Products`;
  };

/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Shellproductsnav2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellproductsnav2 =
  /** @type {((inputs?: Shellproductsnav2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellproductsnav2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellproductsnav2(inputs);
      return vi_shellproductsnav2(inputs);
    }
  );
export { shellproductsnav2 as "shellProductsNav" };
