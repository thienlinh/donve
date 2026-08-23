/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentfixedassigneelabel4Inputs */

const vi_leadsassignmentfixedassigneelabel4 =
  /** @type {(inputs: Leadsassignmentfixedassigneelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Người được gán cố định`;
  };

const en_leadsassignmentfixedassigneelabel4 =
  /** @type {(inputs: Leadsassignmentfixedassigneelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Fixed assignee`;
  };

/**
 * | output |
 * | --- |
 * | "Fixed assignee" |
 *
 * @param {Leadsassignmentfixedassigneelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentfixedassigneelabel4 =
  /** @type {((inputs?: Leadsassignmentfixedassigneelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentfixedassigneelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentfixedassigneelabel4(inputs);
      return vi_leadsassignmentfixedassigneelabel4(inputs);
    }
  );
export { leadsassignmentfixedassigneelabel4 as "leadsAssignmentFixedAssigneeLabel" };
