/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterassigneelabel3Inputs */

const vi_leadsfilterassigneelabel3 =
  /** @type {(inputs: Leadsfilterassigneelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Người phụ trách`;
  };

const en_leadsfilterassigneelabel3 =
  /** @type {(inputs: Leadsfilterassigneelabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assignee`;
  };

/**
 * | output |
 * | --- |
 * | "Assignee" |
 *
 * @param {Leadsfilterassigneelabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterassigneelabel3 =
  /** @type {((inputs?: Leadsfilterassigneelabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterassigneelabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterassigneelabel3(inputs);
      return vi_leadsfilterassigneelabel3(inputs);
    }
  );
export { leadsfilterassigneelabel3 as "leadsFilterAssigneeLabel" };
