/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productstitle1Inputs */

const vi_productstitle1 =
  /** @type {(inputs: Productstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sản phẩm`;
  };

const en_productstitle1 =
  /** @type {(inputs: Productstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Products`;
  };

/**
 * | output |
 * | --- |
 * | "Products" |
 *
 * @param {Productstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productstitle1 =
  /** @type {((inputs?: Productstitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productstitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productstitle1(inputs);
      return vi_productstitle1(inputs);
    }
  );
export { productstitle1 as "productsTitle" };
