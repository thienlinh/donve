/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsfilterrepeatcustomerlabel4Inputs */

const vi_leadsfilterrepeatcustomerlabel4 =
  /** @type {(inputs: Leadsfilterrepeatcustomerlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chỉ khách mua lặp lại`;
  };

const en_leadsfilterrepeatcustomerlabel4 =
  /** @type {(inputs: Leadsfilterrepeatcustomerlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Repeat customers only`;
  };

/**
 * | output |
 * | --- |
 * | "Repeat customers only" |
 *
 * @param {Leadsfilterrepeatcustomerlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsfilterrepeatcustomerlabel4 =
  /** @type {((inputs?: Leadsfilterrepeatcustomerlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsfilterrepeatcustomerlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsfilterrepeatcustomerlabel4(inputs);
      return vi_leadsfilterrepeatcustomerlabel4(inputs);
    }
  );
export { leadsfilterrepeatcustomerlabel4 as "leadsFilterRepeatCustomerLabel" };
