/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscolumnactions2Inputs */

const vi_productscolumnactions2 =
  /** @type {(inputs: Productscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Hành động`;
  };

const en_productscolumnactions2 =
  /** @type {(inputs: Productscolumnactions2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Actions`;
  };

/**
 * | output |
 * | --- |
 * | "Actions" |
 *
 * @param {Productscolumnactions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscolumnactions2 =
  /** @type {((inputs?: Productscolumnactions2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscolumnactions2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscolumnactions2(inputs);
      return vi_productscolumnactions2(inputs);
    }
  );
export { productscolumnactions2 as "productsColumnActions" };
