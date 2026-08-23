/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentstrategyleastactive4Inputs */

const vi_leadsassignmentstrategyleastactive4 =
  /** @type {(inputs: Leadsassignmentstrategyleastactive4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Ít lead đang xử lý nhất`;
  };

const en_leadsassignmentstrategyleastactive4 =
  /** @type {(inputs: Leadsassignmentstrategyleastactive4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Least active leads`;
  };

/**
 * | output |
 * | --- |
 * | "Least active leads" |
 *
 * @param {Leadsassignmentstrategyleastactive4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentstrategyleastactive4 =
  /** @type {((inputs?: Leadsassignmentstrategyleastactive4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentstrategyleastactive4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en")
        return en_leadsassignmentstrategyleastactive4(inputs);
      return vi_leadsassignmentstrategyleastactive4(inputs);
    }
  );
export { leadsassignmentstrategyleastactive4 as "leadsAssignmentStrategyLeastActive" };
