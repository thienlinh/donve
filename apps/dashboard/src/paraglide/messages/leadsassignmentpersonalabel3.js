/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentpersonalabel3Inputs */

const vi_leadsassignmentpersonalabel3 =
  /** @type {(inputs: Leadsassignmentpersonalabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Persona (tuỳ chọn)`;
  };

const en_leadsassignmentpersonalabel3 =
  /** @type {(inputs: Leadsassignmentpersonalabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Persona (optional)`;
  };

/**
 * | output |
 * | --- |
 * | "Persona (optional)" |
 *
 * @param {Leadsassignmentpersonalabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentpersonalabel3 =
  /** @type {((inputs?: Leadsassignmentpersonalabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentpersonalabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentpersonalabel3(inputs);
      return vi_leadsassignmentpersonalabel3(inputs);
    }
  );
export { leadsassignmentpersonalabel3 as "leadsAssignmentPersonaLabel" };
