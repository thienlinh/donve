/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentrulesdescription3Inputs */

const vi_leadsassignmentrulesdescription3 =
  /** @type {(inputs: Leadsassignmentrulesdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Lead mới được gán tự động theo thứ tự ưu tiên của các quy tắc bên dưới.`;
  };

const en_leadsassignmentrulesdescription3 =
  /** @type {(inputs: Leadsassignmentrulesdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `New leads are auto-assigned by the first matching rule below, in priority order.`;
  };

/**
 * | output |
 * | --- |
 * | "New leads are auto-assigned by the first matching rule below, in priority order." |
 *
 * @param {Leadsassignmentrulesdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentrulesdescription3 =
  /** @type {((inputs?: Leadsassignmentrulesdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentrulesdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentrulesdescription3(inputs);
      return vi_leadsassignmentrulesdescription3(inputs);
    }
  );
export { leadsassignmentrulesdescription3 as "leadsAssignmentRulesDescription" };
