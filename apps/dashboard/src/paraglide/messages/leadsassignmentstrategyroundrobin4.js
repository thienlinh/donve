/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentstrategyroundrobin4Inputs */

const vi_leadsassignmentstrategyroundrobin4 =
  /** @type {(inputs: Leadsassignmentstrategyroundrobin4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xoay vòng`;
  };

const en_leadsassignmentstrategyroundrobin4 =
  /** @type {(inputs: Leadsassignmentstrategyroundrobin4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Round robin`;
  };

/**
 * | output |
 * | --- |
 * | "Round robin" |
 *
 * @param {Leadsassignmentstrategyroundrobin4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentstrategyroundrobin4 =
  /** @type {((inputs?: Leadsassignmentstrategyroundrobin4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentstrategyroundrobin4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentstrategyroundrobin4(inputs);
      return vi_leadsassignmentstrategyroundrobin4(inputs);
    }
  );
export { leadsassignmentstrategyroundrobin4 as "leadsAssignmentStrategyRoundRobin" };
