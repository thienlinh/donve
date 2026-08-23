/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportmappingfullname4Inputs */

const vi_leadsimportmappingfullname4 =
  /** @type {(inputs: Leadsimportmappingfullname4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Họ tên`;
  };

const en_leadsimportmappingfullname4 =
  /** @type {(inputs: Leadsimportmappingfullname4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Full name`;
  };

/**
 * | output |
 * | --- |
 * | "Full name" |
 *
 * @param {Leadsimportmappingfullname4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportmappingfullname4 =
  /** @type {((inputs?: Leadsimportmappingfullname4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportmappingfullname4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportmappingfullname4(inputs);
      return vi_leadsimportmappingfullname4(inputs);
    }
  );
export { leadsimportmappingfullname4 as "leadsImportMappingFullName" };
