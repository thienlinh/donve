/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsorderfulfill2Inputs */

const vi_leadsorderfulfill2 =
  /** @type {(inputs: Leadsorderfulfill2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kích hoạt`;
  };

const en_leadsorderfulfill2 =
  /** @type {(inputs: Leadsorderfulfill2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Activate`;
  };

/**
 * | output |
 * | --- |
 * | "Activate" |
 *
 * @param {Leadsorderfulfill2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsorderfulfill2 =
  /** @type {((inputs?: Leadsorderfulfill2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsorderfulfill2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsorderfulfill2(inputs);
      return vi_leadsorderfulfill2(inputs);
    }
  );
export { leadsorderfulfill2 as "leadsOrderFulfill" };
