/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportmappingphone3Inputs */

const vi_leadsimportmappingphone3 =
  /** @type {(inputs: Leadsimportmappingphone3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số điện thoại`;
  };

const en_leadsimportmappingphone3 =
  /** @type {(inputs: Leadsimportmappingphone3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Phone`;
  };

/**
 * | output |
 * | --- |
 * | "Phone" |
 *
 * @param {Leadsimportmappingphone3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportmappingphone3 =
  /** @type {((inputs?: Leadsimportmappingphone3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportmappingphone3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportmappingphone3(inputs);
      return vi_leadsimportmappingphone3(inputs);
    }
  );
export { leadsimportmappingphone3 as "leadsImportMappingPhone" };
