/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsdescriptionlabel2Inputs */

const vi_productsdescriptionlabel2 =
  /** @type {(inputs: Productsdescriptionlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mô tả`;
  };

const en_productsdescriptionlabel2 =
  /** @type {(inputs: Productsdescriptionlabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Description`;
  };

/**
 * | output |
 * | --- |
 * | "Description" |
 *
 * @param {Productsdescriptionlabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsdescriptionlabel2 =
  /** @type {((inputs?: Productsdescriptionlabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsdescriptionlabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsdescriptionlabel2(inputs);
      return vi_productsdescriptionlabel2(inputs);
    }
  );
export { productsdescriptionlabel2 as "productsDescriptionLabel" };
