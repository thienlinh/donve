/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadstitle1Inputs */

const vi_leadstitle1 =
  /** @type {(inputs: Leadstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Khách hàng tiềm năng`;
  };

const en_leadstitle1 =
  /** @type {(inputs: Leadstitle1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Leads`;
  };

/**
 * | output |
 * | --- |
 * | "Leads" |
 *
 * @param {Leadstitle1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadstitle1 =
  /** @type {((inputs?: Leadstitle1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadstitle1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadstitle1(inputs);
      return vi_leadstitle1(inputs);
    }
  );
export { leadstitle1 as "leadsTitle" };
