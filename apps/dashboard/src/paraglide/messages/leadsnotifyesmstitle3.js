/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmstitle3Inputs */

const vi_leadsnotifyesmstitle3 =
  /** @type {(inputs: Leadsnotifyesmstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `SMS (eSMS.vn)`;
  };

const en_leadsnotifyesmstitle3 =
  /** @type {(inputs: Leadsnotifyesmstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `SMS (eSMS.vn)`;
  };

/**
 * | output |
 * | --- |
 * | "SMS (eSMS.vn)" |
 *
 * @param {Leadsnotifyesmstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmstitle3 =
  /** @type {((inputs?: Leadsnotifyesmstitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmstitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyesmstitle3(inputs);
      return vi_leadsnotifyesmstitle3(inputs);
    }
  );
export { leadsnotifyesmstitle3 as "leadsNotifyEsmsTitle" };
