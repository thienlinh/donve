/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productscoursestartsatlabel4Inputs */

const vi_productscoursestartsatlabel4 =
  /** @type {(inputs: Productscoursestartsatlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ngày khai giảng`;
  };

const en_productscoursestartsatlabel4 =
  /** @type {(inputs: Productscoursestartsatlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Start date`;
  };

/**
 * | output |
 * | --- |
 * | "Start date" |
 *
 * @param {Productscoursestartsatlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productscoursestartsatlabel4 =
  /** @type {((inputs?: Productscoursestartsatlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productscoursestartsatlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productscoursestartsatlabel4(inputs);
      return vi_productscoursestartsatlabel4(inputs);
    }
  );
export { productscoursestartsatlabel4 as "productsCourseStartsAtLabel" };
