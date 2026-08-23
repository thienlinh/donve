/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentpersonaplaceholder3Inputs */

const vi_leadsassignmentpersonaplaceholder3 =
  /** @type {(inputs: Leadsassignmentpersonaplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khớp theo persona của lead`;
  };

const en_leadsassignmentpersonaplaceholder3 =
  /** @type {(inputs: Leadsassignmentpersonaplaceholder3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Match against the lead's persona`;
  };

/**
 * | output |
 * | --- |
 * | "Match against the lead's persona" |
 *
 * @param {Leadsassignmentpersonaplaceholder3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentpersonaplaceholder3 =
  /** @type {((inputs?: Leadsassignmentpersonaplaceholder3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentpersonaplaceholder3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentpersonaplaceholder3(inputs);
      return vi_leadsassignmentpersonaplaceholder3(inputs);
    }
  );
export { leadsassignmentpersonaplaceholder3 as "leadsAssignmentPersonaPlaceholder" };
