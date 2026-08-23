/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotabdesignfiles3Inputs */

const vi_studiotabdesignfiles3 =
  /** @type {(inputs: Studiotabdesignfiles3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Design Files`;
  };

const en_studiotabdesignfiles3 =
  /** @type {(inputs: Studiotabdesignfiles3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Design Files`;
  };

/**
 * | output |
 * | --- |
 * | "Design Files" |
 *
 * @param {Studiotabdesignfiles3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotabdesignfiles3 =
  /** @type {((inputs?: Studiotabdesignfiles3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotabdesignfiles3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotabdesignfiles3(inputs);
      return vi_studiotabdesignfiles3(inputs);
    }
  );
export { studiotabdesignfiles3 as "studioTabDesignFiles" };
