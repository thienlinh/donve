/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentruledeletelabel4Inputs */

const vi_leadsassignmentruledeletelabel4 =
  /** @type {(inputs: Leadsassignmentruledeletelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoá quy tắc`;
  };

const en_leadsassignmentruledeletelabel4 =
  /** @type {(inputs: Leadsassignmentruledeletelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Delete rule`;
  };

/**
 * | output |
 * | --- |
 * | "Delete rule" |
 *
 * @param {Leadsassignmentruledeletelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentruledeletelabel4 =
  /** @type {((inputs?: Leadsassignmentruledeletelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentruledeletelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentruledeletelabel4(inputs);
      return vi_leadsassignmentruledeletelabel4(inputs);
    }
  );
export { leadsassignmentruledeletelabel4 as "leadsAssignmentRuleDeleteLabel" };
