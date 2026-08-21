/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsimagelabel2Inputs */

const vi_productsimagelabel2 =
  /** @type {(inputs: Productsimagelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `URL ảnh`;
  };

const en_productsimagelabel2 =
  /** @type {(inputs: Productsimagelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Image URL`;
  };

/**
 * | output |
 * | --- |
 * | "Image URL" |
 *
 * @param {Productsimagelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsimagelabel2 =
  /** @type {((inputs?: Productsimagelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsimagelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsimagelabel2(inputs);
      return vi_productsimagelabel2(inputs);
    }
  );
export { productsimagelabel2 as "productsImageLabel" };
