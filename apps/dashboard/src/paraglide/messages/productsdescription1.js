/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productsdescription1Inputs */

const vi_productsdescription1 =
  /** @type {(inputs: Productsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khoá học, sản phẩm và dịch vụ bạn bán qua các chiến dịch.`;
  };

const en_productsdescription1 =
  /** @type {(inputs: Productsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Courses, products, and services you sell through campaigns.`;
  };

/**
 * | output |
 * | --- |
 * | "Courses, products, and services you sell through campaigns." |
 *
 * @param {Productsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productsdescription1 =
  /** @type {((inputs?: Productsdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productsdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productsdescription1(inputs);
      return vi_productsdescription1(inputs);
    }
  );
export { productsdescription1 as "productsDescription" };
