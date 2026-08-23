/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studionew1Inputs */

const vi_studionew1 =
  /** @type {(inputs: Studionew1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mới`;
  };

const en_studionew1 =
  /** @type {(inputs: Studionew1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `New`;
  };

/**
 * | output |
 * | --- |
 * | "New" |
 *
 * @param {Studionew1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studionew1 =
  /** @type {((inputs?: Studionew1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studionew1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studionew1(inputs);
      return vi_studionew1(inputs);
    }
  );
export { studionew1 as "studioNew" };
