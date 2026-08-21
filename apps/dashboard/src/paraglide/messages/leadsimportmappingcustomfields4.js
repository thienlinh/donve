/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportmappingcustomfields4Inputs */

const vi_leadsimportmappingcustomfields4 =
  /** @type {(inputs: Leadsimportmappingcustomfields4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trường tùy chỉnh`;
  };

const en_leadsimportmappingcustomfields4 =
  /** @type {(inputs: Leadsimportmappingcustomfields4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Custom field`;
  };

/**
 * | output |
 * | --- |
 * | "Custom field" |
 *
 * @param {Leadsimportmappingcustomfields4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportmappingcustomfields4 =
  /** @type {((inputs?: Leadsimportmappingcustomfields4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportmappingcustomfields4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportmappingcustomfields4(inputs);
      return vi_leadsimportmappingcustomfields4(inputs);
    }
  );
export { leadsimportmappingcustomfields4 as "leadsImportMappingCustomFields" };
