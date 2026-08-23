/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfiltersearchlabel3Inputs */

const vi_leadsfiltersearchlabel3 =
  /** @type {(inputs: Leadsfiltersearchlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tìm kiếm`;
  };

const en_leadsfiltersearchlabel3 =
  /** @type {(inputs: Leadsfiltersearchlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Search`;
  };

/**
 * | output |
 * | --- |
 * | "Search" |
 *
 * @param {Leadsfiltersearchlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfiltersearchlabel3 =
  /** @type {((inputs?: Leadsfiltersearchlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfiltersearchlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfiltersearchlabel3(inputs);
      return vi_leadsfiltersearchlabel3(inputs);
    }
  );
export { leadsfiltersearchlabel3 as "leadsFilterSearchLabel" };
