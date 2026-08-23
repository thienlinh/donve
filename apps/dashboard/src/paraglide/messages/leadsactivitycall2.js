/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactivitycall2Inputs */

const vi_leadsactivitycall2 =
  /** @type {(inputs: Leadsactivitycall2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cuộc gọi`;
  };

const en_leadsactivitycall2 =
  /** @type {(inputs: Leadsactivitycall2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Call`;
  };

/**
 * | output |
 * | --- |
 * | "Call" |
 *
 * @param {Leadsactivitycall2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactivitycall2 =
  /** @type {((inputs?: Leadsactivitycall2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactivitycall2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactivitycall2(inputs);
      return vi_leadsactivitycall2(inputs);
    }
  );
export { leadsactivitycall2 as "leadsActivityCall" };
