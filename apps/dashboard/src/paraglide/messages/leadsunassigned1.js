/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsunassigned1Inputs */

const vi_leadsunassigned1 =
  /** @type {(inputs: Leadsunassigned1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa gán`;
  };

const en_leadsunassigned1 =
  /** @type {(inputs: Leadsunassigned1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unassigned`;
  };

/**
 * | output |
 * | --- |
 * | "Unassigned" |
 *
 * @param {Leadsunassigned1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsunassigned1 =
  /** @type {((inputs?: Leadsunassigned1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsunassigned1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsunassigned1(inputs);
      return vi_leadsunassigned1(inputs);
    }
  );
export { leadsunassigned1 as "leadsUnassigned" };
