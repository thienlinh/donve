/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentrulesmanagebutton4Inputs */

const vi_leadsassignmentrulesmanagebutton4 =
  /** @type {(inputs: Leadsassignmentrulesmanagebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Quản lý quy tắc gán lead`;
  };

const en_leadsassignmentrulesmanagebutton4 =
  /** @type {(inputs: Leadsassignmentrulesmanagebutton4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manage assignment rules`;
  };

/**
 * | output |
 * | --- |
 * | "Manage assignment rules" |
 *
 * @param {Leadsassignmentrulesmanagebutton4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentrulesmanagebutton4 =
  /** @type {((inputs?: Leadsassignmentrulesmanagebutton4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentrulesmanagebutton4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentrulesmanagebutton4(inputs);
      return vi_leadsassignmentrulesmanagebutton4(inputs);
    }
  );
export { leadsassignmentrulesmanagebutton4 as "leadsAssignmentRulesManageButton" };
