/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentrulestitle3Inputs */

const vi_leadsassignmentrulestitle3 =
  /** @type {(inputs: Leadsassignmentrulestitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quy tắc tự động gán lead`;
  };

const en_leadsassignmentrulestitle3 =
  /** @type {(inputs: Leadsassignmentrulestitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lead assignment rules`;
  };

/**
 * | output |
 * | --- |
 * | "Lead assignment rules" |
 *
 * @param {Leadsassignmentrulestitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentrulestitle3 =
  /** @type {((inputs?: Leadsassignmentrulestitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentrulestitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentrulestitle3(inputs);
      return vi_leadsassignmentrulestitle3(inputs);
    }
  );
export { leadsassignmentrulestitle3 as "leadsAssignmentRulesTitle" };
