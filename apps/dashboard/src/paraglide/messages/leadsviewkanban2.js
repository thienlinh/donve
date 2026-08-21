/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsviewkanban2Inputs */

const vi_leadsviewkanban2 =
  /** @type {(inputs: Leadsviewkanban2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kanban`;
  };

const en_leadsviewkanban2 =
  /** @type {(inputs: Leadsviewkanban2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kanban`;
  };

/**
 * | output |
 * | --- |
 * | "Kanban" |
 *
 * @param {Leadsviewkanban2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsviewkanban2 =
  /** @type {((inputs?: Leadsviewkanban2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsviewkanban2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsviewkanban2(inputs);
      return vi_leadsviewkanban2(inputs);
    }
  );
export { leadsviewkanban2 as "leadsViewKanban" };
