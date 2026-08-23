/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscoursezalolabel3Inputs */

const vi_productscoursezalolabel3 =
  /** @type {(inputs: Productscoursezalolabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Link nhóm Zalo`;
  };

const en_productscoursezalolabel3 =
  /** @type {(inputs: Productscoursezalolabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo group link`;
  };

/**
 * | output |
 * | --- |
 * | "Zalo group link" |
 *
 * @param {Productscoursezalolabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscoursezalolabel3 =
  /** @type {((inputs?: Productscoursezalolabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscoursezalolabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscoursezalolabel3(inputs);
      return vi_productscoursezalolabel3(inputs);
    }
  );
export { productscoursezalolabel3 as "productsCourseZaloLabel" };
