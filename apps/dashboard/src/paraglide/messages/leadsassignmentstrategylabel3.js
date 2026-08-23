/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentstrategylabel3Inputs */

const vi_leadsassignmentstrategylabel3 =
  /** @type {(inputs: Leadsassignmentstrategylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chiến lược gán`;
  };

const en_leadsassignmentstrategylabel3 =
  /** @type {(inputs: Leadsassignmentstrategylabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Strategy`;
  };

/**
 * | output |
 * | --- |
 * | "Strategy" |
 *
 * @param {Leadsassignmentstrategylabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentstrategylabel3 =
  /** @type {((inputs?: Leadsassignmentstrategylabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentstrategylabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentstrategylabel3(inputs);
      return vi_leadsassignmentstrategylabel3(inputs);
    }
  );
export { leadsassignmentstrategylabel3 as "leadsAssignmentStrategyLabel" };
