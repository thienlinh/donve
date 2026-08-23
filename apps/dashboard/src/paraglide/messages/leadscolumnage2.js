/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadscolumnage2Inputs */

const vi_leadscolumnage2 =
  /** @type {(inputs: Leadscolumnage2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thời gian`;
  };

const en_leadscolumnage2 =
  /** @type {(inputs: Leadscolumnage2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Age`;
  };

/**
 * | output |
 * | --- |
 * | "Age" |
 *
 * @param {Leadscolumnage2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadscolumnage2 =
  /** @type {((inputs?: Leadscolumnage2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadscolumnage2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadscolumnage2(inputs);
      return vi_leadscolumnage2(inputs);
    }
  );
export { leadscolumnage2 as "leadsColumnAge" };
