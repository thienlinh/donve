/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassignmentemptytitle3Inputs */

const vi_leadsassignmentemptytitle3 =
  /** @type {(inputs: Leadsassignmentemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có quy tắc tự động gán nào`;
  };

const en_leadsassignmentemptytitle3 =
  /** @type {(inputs: Leadsassignmentemptytitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No assignment rules yet`;
  };

/**
 * | output |
 * | --- |
 * | "No assignment rules yet" |
 *
 * @param {Leadsassignmentemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassignmentemptytitle3 =
  /** @type {((inputs?: Leadsassignmentemptytitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassignmentemptytitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassignmentemptytitle3(inputs);
      return vi_leadsassignmentemptytitle3(inputs);
    }
  );
export { leadsassignmentemptytitle3 as "leadsAssignmentEmptyTitle" };
