/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsassigneelabel2Inputs */

const vi_leadsassigneelabel2 =
  /** @type {(inputs: Leadsassigneelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Người phụ trách`;
  };

const en_leadsassigneelabel2 =
  /** @type {(inputs: Leadsassigneelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assigned to`;
  };

/**
 * | output |
 * | --- |
 * | "Assigned to" |
 *
 * @param {Leadsassigneelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsassigneelabel2 =
  /** @type {((inputs?: Leadsassigneelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsassigneelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsassigneelabel2(inputs);
      return vi_leadsassigneelabel2(inputs);
    }
  );
export { leadsassigneelabel2 as "leadsAssigneeLabel" };
