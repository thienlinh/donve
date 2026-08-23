/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifyesmsbrandnamelabel4Inputs */

const vi_leadsnotifyesmsbrandnamelabel4 =
  /** @type {(inputs: Leadsnotifyesmsbrandnamelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Brandname (tuỳ chọn)`;
  };

const en_leadsnotifyesmsbrandnamelabel4 =
  /** @type {(inputs: Leadsnotifyesmsbrandnamelabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Brandname (optional)`;
  };

/**
 * | output |
 * | --- |
 * | "Brandname (optional)" |
 *
 * @param {Leadsnotifyesmsbrandnamelabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifyesmsbrandnamelabel4 =
  /** @type {((inputs?: Leadsnotifyesmsbrandnamelabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifyesmsbrandnamelabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifyesmsbrandnamelabel4(inputs);
      return vi_leadsnotifyesmsbrandnamelabel4(inputs);
    }
  );
export { leadsnotifyesmsbrandnamelabel4 as "leadsNotifyEsmsBrandnameLabel" };
