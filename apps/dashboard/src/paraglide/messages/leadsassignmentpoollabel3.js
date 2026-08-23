/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentpoollabel3Inputs */

const vi_leadsassignmentpoollabel3 =
  /** @type {(inputs: Leadsassignmentpoollabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nhóm người nhận lead`;
  };

const en_leadsassignmentpoollabel3 =
  /** @type {(inputs: Leadsassignmentpoollabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assignee pool`;
  };

/**
 * | output |
 * | --- |
 * | "Assignee pool" |
 *
 * @param {Leadsassignmentpoollabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentpoollabel3 =
  /** @type {((inputs?: Leadsassignmentpoollabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentpoollabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentpoollabel3(inputs);
      return vi_leadsassignmentpoollabel3(inputs);
    }
  );
export { leadsassignmentpoollabel3 as "leadsAssignmentPoolLabel" };
