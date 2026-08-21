/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Productstypecourse2Inputs */

const vi_productstypecourse2 =
  /** @type {(inputs: Productstypecourse2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khoá học`;
  };

const en_productstypecourse2 =
  /** @type {(inputs: Productstypecourse2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Course`;
  };

/**
 * | output |
 * | --- |
 * | "Course" |
 *
 * @param {Productstypecourse2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const productstypecourse2 =
  /** @type {((inputs?: Productstypecourse2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Productstypecourse2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_productstypecourse2(inputs);
      return vi_productstypecourse2(inputs);
    }
  );
export { productstypecourse2 as "productsTypeCourse" };
