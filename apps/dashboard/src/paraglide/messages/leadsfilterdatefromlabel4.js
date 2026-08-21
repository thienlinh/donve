/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterdatefromlabel4Inputs */

const vi_leadsfilterdatefromlabel4 =
  /** @type {(inputs: Leadsfilterdatefromlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Từ ngày`;
  };

const en_leadsfilterdatefromlabel4 =
  /** @type {(inputs: Leadsfilterdatefromlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `From`;
  };

/**
 * | output |
 * | --- |
 * | "From" |
 *
 * @param {Leadsfilterdatefromlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterdatefromlabel4 =
  /** @type {((inputs?: Leadsfilterdatefromlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterdatefromlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterdatefromlabel4(inputs);
      return vi_leadsfilterdatefromlabel4(inputs);
    }
  );
export { leadsfilterdatefromlabel4 as "leadsFilterDateFromLabel" };
