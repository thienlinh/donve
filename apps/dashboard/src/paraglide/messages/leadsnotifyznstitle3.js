/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyznstitle3Inputs */

const vi_leadsnotifyznstitle3 =
  /** @type {(inputs: Leadsnotifyznstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo ZNS`;
  };

const en_leadsnotifyznstitle3 =
  /** @type {(inputs: Leadsnotifyznstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo ZNS`;
  };

/**
 * | output |
 * | --- |
 * | "Zalo ZNS" |
 *
 * @param {Leadsnotifyznstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyznstitle3 =
  /** @type {((inputs?: Leadsnotifyznstitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyznstitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyznstitle3(inputs);
      return vi_leadsnotifyznstitle3(inputs);
    }
  );
export { leadsnotifyznstitle3 as "leadsNotifyZnsTitle" };
