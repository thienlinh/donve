/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentslabreachlabel4Inputs */

const vi_leadsassignmentslabreachlabel4 =
  /** @type {(inputs: Leadsassignmentslabreachlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khi vi phạm SLA`;
  };

const en_leadsassignmentslabreachlabel4 =
  /** @type {(inputs: Leadsassignmentslabreachlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `On SLA breach`;
  };

/**
 * | output |
 * | --- |
 * | "On SLA breach" |
 *
 * @param {Leadsassignmentslabreachlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentslabreachlabel4 =
  /** @type {((inputs?: Leadsassignmentslabreachlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentslabreachlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentslabreachlabel4(inputs);
      return vi_leadsassignmentslabreachlabel4(inputs);
    }
  );
export { leadsassignmentslabreachlabel4 as "leadsAssignmentSlaBreachLabel" };
