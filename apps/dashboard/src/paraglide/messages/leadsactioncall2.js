/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactioncall2Inputs */

const vi_leadsactioncall2 =
  /** @type {(inputs: Leadsactioncall2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gọi`;
  };

const en_leadsactioncall2 =
  /** @type {(inputs: Leadsactioncall2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Call`;
  };

/**
 * | output |
 * | --- |
 * | "Call" |
 *
 * @param {Leadsactioncall2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactioncall2 =
  /** @type {((inputs?: Leadsactioncall2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactioncall2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactioncall2(inputs);
      return vi_leadsactioncall2(inputs);
    }
  );
export { leadsactioncall2 as "leadsActionCall" };
