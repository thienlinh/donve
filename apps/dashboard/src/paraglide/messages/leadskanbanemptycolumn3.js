/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadskanbanemptycolumn3Inputs */

const vi_leadskanbanemptycolumn3 =
  /** @type {(inputs: Leadskanbanemptycolumn3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kéo lead vào đây`;
  };

const en_leadskanbanemptycolumn3 =
  /** @type {(inputs: Leadskanbanemptycolumn3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Drop leads here`;
  };

/**
 * | output |
 * | --- |
 * | "Drop leads here" |
 *
 * @param {Leadskanbanemptycolumn3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadskanbanemptycolumn3 =
  /** @type {((inputs?: Leadskanbanemptycolumn3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadskanbanemptycolumn3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadskanbanemptycolumn3(inputs);
      return vi_leadskanbanemptycolumn3(inputs);
    }
  );
export { leadskanbanemptycolumn3 as "leadsKanbanEmptyColumn" };
