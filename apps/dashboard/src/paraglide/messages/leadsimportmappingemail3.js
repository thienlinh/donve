/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportmappingemail3Inputs */

const vi_leadsimportmappingemail3 =
  /** @type {(inputs: Leadsimportmappingemail3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`;
  };

const en_leadsimportmappingemail3 =
  /** @type {(inputs: Leadsimportmappingemail3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`;
  };

/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Leadsimportmappingemail3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportmappingemail3 =
  /** @type {((inputs?: Leadsimportmappingemail3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportmappingemail3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportmappingemail3(inputs);
      return vi_leadsimportmappingemail3(inputs);
    }
  );
export { leadsimportmappingemail3 as "leadsImportMappingEmail" };
