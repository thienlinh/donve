/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopresent1Inputs */

const vi_studiopresent1 =
  /** @type {(inputs: Studiopresent1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trình chiếu`;
  };

const en_studiopresent1 =
  /** @type {(inputs: Studiopresent1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Present`;
  };

/**
 * | output |
 * | --- |
 * | "Present" |
 *
 * @param {Studiopresent1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopresent1 =
  /** @type {((inputs?: Studiopresent1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopresent1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopresent1(inputs);
      return vi_studiopresent1(inputs);
    }
  );
export { studiopresent1 as "studioPresent" };
