/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactionzalo2Inputs */

const vi_leadsactionzalo2 =
  /** @type {(inputs: Leadsactionzalo2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo`;
  };

const en_leadsactionzalo2 =
  /** @type {(inputs: Leadsactionzalo2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zalo`;
  };

/**
 * | output |
 * | --- |
 * | "Zalo" |
 *
 * @param {Leadsactionzalo2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactionzalo2 =
  /** @type {((inputs?: Leadsactionzalo2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactionzalo2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactionzalo2(inputs);
      return vi_leadsactionzalo2(inputs);
    }
  );
export { leadsactionzalo2 as "leadsActionZalo" };
