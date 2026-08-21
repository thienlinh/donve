/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscoursefieldstitle3Inputs */

const vi_productscoursefieldstitle3 =
  /** @type {(inputs: Productscoursefieldstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thông tin khoá học`;
  };

const en_productscoursefieldstitle3 =
  /** @type {(inputs: Productscoursefieldstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Course details`;
  };

/**
 * | output |
 * | --- |
 * | "Course details" |
 *
 * @param {Productscoursefieldstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscoursefieldstitle3 =
  /** @type {((inputs?: Productscoursefieldstitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscoursefieldstitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscoursefieldstitle3(inputs);
      return vi_productscoursefieldstitle3(inputs);
    }
  );
export { productscoursefieldstitle3 as "productsCourseFieldsTitle" };
