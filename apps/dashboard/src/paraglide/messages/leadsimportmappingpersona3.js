/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsimportmappingpersona3Inputs */

const vi_leadsimportmappingpersona3 =
  /** @type {(inputs: Leadsimportmappingpersona3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Persona`;
  };

const en_leadsimportmappingpersona3 =
  /** @type {(inputs: Leadsimportmappingpersona3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Persona`;
  };

/**
 * | output |
 * | --- |
 * | "Persona" |
 *
 * @param {Leadsimportmappingpersona3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsimportmappingpersona3 =
  /** @type {((inputs?: Leadsimportmappingpersona3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsimportmappingpersona3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsimportmappingpersona3(inputs);
      return vi_leadsimportmappingpersona3(inputs);
    }
  );
export { leadsimportmappingpersona3 as "leadsImportMappingPersona" };
