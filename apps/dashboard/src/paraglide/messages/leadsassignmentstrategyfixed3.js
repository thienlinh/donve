/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentstrategyfixed3Inputs */

const vi_leadsassignmentstrategyfixed3 =
  /** @type {(inputs: Leadsassignmentstrategyfixed3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gán cố định`;
  };

const en_leadsassignmentstrategyfixed3 =
  /** @type {(inputs: Leadsassignmentstrategyfixed3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Fixed assignee`;
  };

/**
 * | output |
 * | --- |
 * | "Fixed assignee" |
 *
 * @param {Leadsassignmentstrategyfixed3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentstrategyfixed3 =
  /** @type {((inputs?: Leadsassignmentstrategyfixed3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentstrategyfixed3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentstrategyfixed3(inputs);
      return vi_leadsassignmentstrategyfixed3(inputs);
    }
  );
export { leadsassignmentstrategyfixed3 as "leadsAssignmentStrategyFixed" };
