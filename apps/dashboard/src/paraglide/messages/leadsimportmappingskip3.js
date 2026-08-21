/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportmappingskip3Inputs */

const vi_leadsimportmappingskip3 =
  /** @type {(inputs: Leadsimportmappingskip3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Bỏ qua cột`;
  };

const en_leadsimportmappingskip3 =
  /** @type {(inputs: Leadsimportmappingskip3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ignore column`;
  };

/**
 * | output |
 * | --- |
 * | "Ignore column" |
 *
 * @param {Leadsimportmappingskip3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportmappingskip3 =
  /** @type {((inputs?: Leadsimportmappingskip3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportmappingskip3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportmappingskip3(inputs);
      return vi_leadsimportmappingskip3(inputs);
    }
  );
export { leadsimportmappingskip3 as "leadsImportMappingSkip" };
